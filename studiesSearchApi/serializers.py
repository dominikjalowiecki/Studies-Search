from rest_framework import serializers
from studiesSearchApi.models import (
    User,
    Faculties,
    FacultiesImages,
    Comments,
    Cities,
    Membership,
    Schools,
    Cities,
    Comments,
    Courses,
)
from djoser.serializers import UserSerializer, UserCreateSerializer, TokenSerializer
from djoser.conf import settings
from django.conf import settings as djangoSettings
from django.db import transaction
from rest_framework.exceptions import ValidationError
from django.core.validators import RegexValidator


class FacultiesImagesField(serializers.RelatedField):
    def to_representation(self, value):
        url = value.image.url
        request = self.context.get("request", None)
        if djangoSettings.DEBUG and request is not None:
            return request.build_absolute_uri(url)
        return url

    def to_internal_value(self, data):
        return data


class SlugRelatedGetOrCreateField(serializers.SlugRelatedField):
    def to_internal_value(self, data):
        queryset = self.get_queryset()
        try:
            return queryset.get_or_create(**{self.slug_field: data})[0]
        except (TypeError, ValueError):
            self.fail("invalid")


class FiltersSerializer(serializers.Serializer):
    schools = serializers.ListField(child=serializers.DictField(child=serializers.CharField()))
    cities = serializers.ListField(child=serializers.DictField(child=serializers.CharField()))
    courses = serializers.ListField(child=serializers.DictField(child=serializers.CharField()))


class ExtendsTokenSerializer(TokenSerializer):
    is_moderator = serializers.BooleanField(source="user.is_moderator")

    class Meta:
        model = settings.TOKEN_MODEL
        fields = ("auth_token", "is_moderator")


class ExtendsUserSerializer(UserSerializer):
    membership = serializers.SlugRelatedField(slug_field="name", read_only=True)

    class Meta:
        model = User
        fields = (User._meta.pk.name, "username", "membership")


class ExtendsCurrentUserSerializer(UserSerializer):
    membership = serializers.SlugRelatedField(slug_field="name", queryset=Membership.objects.all())

    class Meta:
        model = User
        fields = (User._meta.pk.name, "username", settings.LOGIN_FIELD, "membership", "is_moderator", 'date_joined') + tuple(
            User.REQUIRED_FIELDS
        )

        read_only_fields = (settings.LOGIN_FIELD, "is_moderator")


class ExtendsUserCreateSerializer(UserCreateSerializer):
    membership = serializers.PrimaryKeyRelatedField(queryset=Membership.objects.all())

    class Meta:
        model = User
        fields = tuple(User.REQUIRED_FIELDS) + (
            User._meta.pk.name,
            "username",
            settings.LOGIN_FIELD,
            "password",
            "membership",
        )


class ExtendsUserCreatePasswordRetypeSerializer(ExtendsUserCreateSerializer):
    default_error_messages = {"password_mismatch": settings.CONSTANTS.messages.PASSWORD_MISMATCH_ERROR}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["re_password"] = serializers.CharField(style={"input_type": "password"})

    def validate(self, attrs):
        self.fields.pop("re_password", None)
        re_password = attrs.pop("re_password")
        attrs = super().validate(attrs)
        if attrs["password"] == re_password:
            return attrs
        else:
            self.fail("password_mismatch")


class FacultiesListSerializer(serializers.ModelSerializer):
    school = serializers.SlugRelatedField(slug_field="name", read_only=True)
    city = serializers.SlugRelatedField(slug_field="name", read_only=True)
    first_image = FacultiesImagesField(read_only=True)
    courses = serializers.SlugRelatedField(many=True, slug_field="name", read_only=True)

    @staticmethod
    def setup_eager_loading(queryset):
        queryset = queryset.select_related("school", "city")

        queryset = queryset.prefetch_related("courses", "images")

        queryset = queryset.defer("hyperlink", "modificated_by_id", "modification_date")

        return queryset

    class Meta:
        model = Faculties
        fields = ["id", "name", "description_preview", "school", "city", "first_image", "courses"]


class FacultiesRetrieveSerializer(serializers.ModelSerializer):
    school = serializers.SlugRelatedField(read_only=True, slug_field="name")
    add_school = serializers.CharField(
        write_only=True, required=True, max_length=Schools._meta.get_field("name").max_length
    )
    city = serializers.SlugRelatedField(read_only=True, slug_field="name")
    add_city = serializers.CharField(
        write_only=True,
        required=True,
        max_length=Cities._meta.get_field("name").max_length,
        validators=[RegexValidator(r"^[a-zA-Z ]*$", "City name should contain only letters and spaces.")],
    )
    images = FacultiesImagesField(many=True, read_only=True)

    def image_validator(image):
        MEGABYTE_LIMIT = 2
        filesize = image.size

        if filesize > MEGABYTE_LIMIT * 1024 * 1024:
            raise ValidationError(f"Max file size is {MEGABYTE_LIMIT}MB")

    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=100, allow_empty_file=False, validators=[image_validator]),
        write_only=True,
        required=False,
        default=[],
        max_length=4,
    )

    courses = serializers.SlugRelatedField(many=True, slug_field="name", read_only=True)
    add_courses = serializers.ListField(
        child=serializers.CharField(max_length=Courses()._meta.get_field("name").max_length),
        write_only=True,
        required=False,
        default=[],
    )
    comments = serializers.SlugRelatedField(many=True, slug_field="comment_details", read_only=True, required=False)
    modificated_by = serializers.SlugRelatedField(slug_field="username_and_membership", read_only=True)

    @transaction.atomic
    def create(self, validated_data):
        uploaded_data = validated_data.pop("uploaded_images")
        add_courses = validated_data.pop("add_courses")
        courses = []
        for course in add_courses:
            courses.append(Courses.objects.get_or_create(**{"name": course.title()})[0])

        school = Schools.objects.get_or_create(**{"name": validated_data.pop("add_school").title()})[0]
        city = Cities.objects.get_or_create(**{"name": validated_data.pop("add_city").title()})[0]
        validated_data = {**validated_data, "school": school, "city": city}
        instance = Faculties.objects.create(**validated_data)
        instance.courses.set(courses)

        for uploaded_item in uploaded_data:
            try:
                FacultiesImages.objects.create(faculty=instance, image=uploaded_item)
            except:
                pass

        return instance

    @transaction.atomic
    def update(self, instance, validated_data):
        uploaded_data = validated_data.get("uploaded_images")

        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.school = Schools.objects.get_or_create(**{"name": validated_data.get("add_school", instance.school)})[0]
        instance.city = Cities.objects.get_or_create(**{"name": validated_data.get("add_city", instance.city)})[0]
        instance.hyperlink = validated_data.get("hyperlink", instance.hyperlink)
        instance.modificated_by = validated_data['modificated_by']

        add_courses = validated_data.get("add_courses")
        if add_courses != None:
            courses = []
            for course in add_courses:
                courses.append(Courses.objects.get_or_create(**{"name": course})[0])
            instance.courses.set(courses)
        
        if uploaded_data:
            FacultiesImages.objects.filter(faculty=instance).delete()
            for uploaded_item in uploaded_data:
                try:
                    FacultiesImages.objects.create(faculty=instance, image=uploaded_item)
                except:
                    pass
        
        instance.save()
        return instance

    @staticmethod
    def setup_eager_loading(queryset):
        queryset = queryset.select_related("school", "city", "modificated_by", "modificated_by__membership").defer(
            "modificated_by__password",
            "modificated_by__last_login",
            "modificated_by__is_superuser",
            "modificated_by__first_name",
            "modificated_by__last_name",
            "modificated_by__is_staff",
            "modificated_by__is_active",
            "modificated_by__date_joined",
            "modificated_by__email",
            "modificated_by__is_moderator",
        )

        queryset = queryset.prefetch_related("courses", "images", "comments")

        return queryset

    class Meta:
        model = Faculties
        fields = [
            "id",
            "name",
            "description",
            "school",
            "city",
            "hyperlink",
            "images",
            "courses",
            "add_courses",
            "add_school",
            "add_city",
            "uploaded_images",
            "comments",
            "modificated_by",
            "modification_date",
        ]


class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ["id", "name"]


class SchoolsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schools
        fields = ["name"]


class CitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cities
        fields = ["name"]


class CoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = ["name"]


class CommentsSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    entry = serializers.PrimaryKeyRelatedField(queryset=Faculties.objects.all())

    class Meta:
        model = Comments
        fields = ["id", "user", "entry", "content"]

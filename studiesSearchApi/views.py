from studiesSearchApi.models import Faculties, Schools, Cities, Comments, Courses, Membership
from studiesSearchApi.serializers import (
    FacultiesListSerializer,
    FacultiesRetrieveSerializer,
    SchoolsSerializer,
    MembershipSerializer,
    CitiesSerializer,
    CommentsSerializer,
    CoursesSerializer,
    FiltersSerializer
)
from studiesSearchApi.permissions import IsModerator
from studiesSearchApi.filters import FacuilitesFilter
from rest_framework import viewsets, permissions, mixins
from rest_framework.response import Response
from studiesSearchApi.models import Schools, Cities, Courses
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from djoser.views import TokenCreateView
from rest_framework.throttling import ScopedRateThrottle

class ThrottlingTokenCreateView(TokenCreateView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'login'

class FiltersViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = None
    serializer_class = FiltersSerializer
    serializer_class_schools = SchoolsSerializer
    serializer_class_cities = CitiesSerializer
    serializer_class_courses = CoursesSerializer
    pagination_class = None

    def list(self, request, *args, **kwargs):
        schools = self.serializer_class_schools(Schools.objects.all(), many=True)
        cities = self.serializer_class_cities(Cities.objects.all(), many=True)
        courses = self.serializer_class_courses(Courses.objects.all(), many=True)

        return Response({
            "schools": schools.data,
            "cities": cities.data,
            "courses": courses.data,
        })

class FacultiesViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Faculties.objects.all()
    filterset_class = FacuilitesFilter
    permission_classes = [IsModerator]

    @method_decorator(cache_page(60 * 2, key_prefix="posts"))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(60 * 2))
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(modificated_by=self.request.user)
        # Refresh cache
        if hasattr(cache, '_cache'):
            for key in cache._cache.keys():
                if 'posts' in key:
                    cache.delete(key)
    
    def perform_update(self, serializer):
        serializer.save(modificated_by=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return FacultiesListSerializer
        if self.action == 'retrieve':
            return FacultiesRetrieveSerializer

        return FacultiesRetrieveSerializer

class MembershipViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    pagination_class = None

class SchoolsViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Schools.objects.all()
    serializer_class = SchoolsSerializer
    permission_classes = [IsModerator]
    pagination_class = None
    filterset_fields = {
        'name': ['exact', 'contains']
    }

class CitiesViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Cities.objects.all()
    serializer_class = CitiesSerializer
    permission_classes = [IsModerator]
    pagination_class = None
    filterset_fields = {
        'name': ['exact', 'contains']
    }


class CoursesViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Courses.objects.all()
    serializer_class = CoursesSerializer
    permission_classes = [IsModerator]
    pagination_class = None
    filterset_fields = {
        'name': ['exact', 'contains']
    }

class CommentsViewSet(
    mixins.CreateModelMixin,
    viewsets.GenericViewSet
):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
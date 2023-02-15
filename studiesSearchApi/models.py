from django.contrib.auth.models import AbstractUser, AnonymousUser
import django.contrib.auth.models as django_auth_models
from django.db import models
from backendApi import settings
from django.core.validators import RegexValidator



class CustomAnonymousUser(AnonymousUser):
    email = ''
    class membership:
        name = ''

django_auth_models.AnonymousUser = CustomAnonymousUser



class User(AbstractUser):
    email = models.EmailField(unique=True)
    membership = models.ForeignKey(
        'Membership',
        on_delete=models.SET_NULL,
        related_name='users',
        blank=True,
        null=True
    )
    is_moderator = models.BooleanField(default=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ('username',)

    @property
    def username_and_membership(self):
        return {'username': self.username, 'membership': str(self.membership)}

class Membership(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name

class Schools(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Cities(models.Model):
    name = models.CharField(max_length=50, unique=True, validators=[RegexValidator(r"^[a-zA-Z ]*$", "City name should contain only letters and spaces.")])

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Courses(models.Model):
    name = models.CharField(max_length=100, unique=True)
    faculities = models.ManyToManyField(
        'Faculities',
        related_name='courses'
    )

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Faculities(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(max_length=500)
    school = models.ForeignKey(
        'Schools',
        on_delete=models.PROTECT,
        related_name='faculities',
        null=True
    )
    city = models.ForeignKey(
        'Cities',
        on_delete=models.SET_NULL,
        related_name='faculities',
        null=True
    )
    hyperlink = models.URLField(null=True)
    modificated_by = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='entries',
        null=True
    )
    modification_date = models.DateTimeField(auto_now=True)

    @property
    def first_image(self):
        return self.images.first()
    
    def smart_truncate(self, content, length=100, suffix='...'):
        if len(content) <= length:
            return content
        else:
            return ' '.join(content[:length+1].split(' ')[0:-1]) + suffix

    @property
    def description_preview(self):
        return self.smart_truncate(self.description)

    class Meta:
        ordering = ['-modification_date']

    def __str__(self):
        return self.name

class FaculitiesImages(models.Model):
    if not settings.DEBUG:  
        from gdstorage.storage import GoogleDriveStorage
        gd_storage = GoogleDriveStorage()
        image = models.ImageField(upload_to='images', storage=gd_storage)
    else:
        image = models.ImageField(upload_to='images')
    faculity = models.ForeignKey(
        'Faculities',
        on_delete=models.CASCADE,
        related_name='images'
    )

class Comments(models.Model):
    user = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
    )
    entry = models.ForeignKey(
        'Faculities',
        on_delete=models.CASCADE,
        related_name='comments',
    )
    content = models.CharField(max_length=250)
    modification_date = models.DateTimeField(auto_now=True)

    @property
    def comment_details(self):
        return {'username': self.user.username, 'membership': self.user.membership.name, 'content': self.content, 'modification_date': self.modification_date}
    
    class Meta:
        ordering = ['-modification_date']
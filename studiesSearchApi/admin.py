from django.contrib import admin
from studiesSearchApi.models import User, Membership, Schools, Cities, Courses, Faculities, FaculitiesImages, Comments

@admin.register(User, Membership, Schools, Cities, Courses, Faculities, FaculitiesImages, Comments)
class ModelRegister(admin.ModelAdmin):
    pass

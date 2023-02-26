from django.contrib import admin
from studiesSearchApi.models import User, Membership, Schools, Cities, Courses, Faculties, FacultiesImages, Comments

@admin.register(User, Membership, Schools, Cities, Courses, Faculties, FacultiesImages, Comments)
class ModelRegister(admin.ModelAdmin):
    pass

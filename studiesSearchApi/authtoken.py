from django.urls import re_path

from .views import ThrottlingTokenCreateView
from djoser import views

urlpatterns = [
    re_path(r"^token/login/?$", ThrottlingTokenCreateView.as_view(), name="login"),
    re_path(r"^token/logout/?$", views.TokenDestroyView.as_view(), name="logout"),
]

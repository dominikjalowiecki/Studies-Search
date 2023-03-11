from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.routers import DefaultRouter
from studiesSearchApi.urls import router as apiRouter
from djoser.urls.base import router as djoserRouter
from django.views.generic.base import TemplateView
from django.contrib import admin

admin.autodiscover()
admin.site.enable_nav_sidebar = False

router = DefaultRouter()
router.registry.extend(apiRouter.registry)
router.registry.extend(djoserRouter.registry)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/', include('studiesSearchApi.authtoken')),
    path('admin/', admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
    urlpatterns += [
        path('__debug__/', include('debug_toolbar.urls')),
    ]

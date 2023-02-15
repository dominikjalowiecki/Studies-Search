from rest_framework.routers import SimpleRouter
from studiesSearchApi import views

router = SimpleRouter()
router.register(r'faculities', views.FaculitiesViewSet)
router.register(r'filters', views.FiltersViewSet, basename='filters-list')
router.register(r'schools', views.SchoolsViewSet)
router.register(r'cities', views.CitiesViewSet)
router.register(r'membership', views.MembershipViewSet)
router.register(r'comments', views.CommentsViewSet)
router.register(r'courses', views.CoursesViewSet)
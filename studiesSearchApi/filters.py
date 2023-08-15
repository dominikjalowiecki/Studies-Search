import django_filters
from studiesSearchApi.models import Faculties

class FacultiesFilter(django_filters.FilterSet):
    faculty = django_filters.CharFilter(
        field_name='name',
        lookup_expr='contains'
    )
    school = django_filters.CharFilter(
        field_name='school__name',
        lookup_expr='exact'
    )
    city = django_filters.CharFilter(
        field_name='city__name',
        lookup_expr='exact'
    )
    course = django_filters.CharFilter(
        field_name='courses__name',
        lookup_expr='exact'
    )

    class Meta:
        model = Faculties
        fields = ('faculty', 'school', 'city', 'course')
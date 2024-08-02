from django_filters import rest_framework as filters
from .models import Expense

class ExpenseFilter(filters.FilterSet):
    category = filters.NumberFilter(field_name='category', lookup_expr='exact')
    search = filters.CharFilter(method='filter_by_search')

    class Meta:
        model = Expense
        fields = ['category']

    def filter_by_search(self, queryset, name, value):
        return queryset.filter(category__name__icontains=value)

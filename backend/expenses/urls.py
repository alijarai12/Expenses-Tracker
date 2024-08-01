from django.urls import path, include
from rest_framework.routers import DefaultRouter
from expenses.views import CategoryViewSet, ExpenseListCreateView,ExpenseDetailView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')


urlpatterns = [
    path('', include(router.urls)),
    path('expenses/', ExpenseListCreateView.as_view(), name='expense-create'),
    path('expenses/<int:pk>/', ExpenseDetailView.as_view(), name='expense-detail'),

]
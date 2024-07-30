from django.urls import path, include
from rest_framework.routers import DefaultRouter
from expenses.views import CategoryViewSet, ExpenseViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'expenses', ExpenseViewSet, basename='expenses')


urlpatterns = [
    path('', include(router.urls)),

]
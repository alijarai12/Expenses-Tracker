from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Expense



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
                
    
class ExpenseSerializer(serializers.ModelSerializer):
    category = CategorySerializer()    
    class Meta:
        model = Expense
        fields = '__all__'



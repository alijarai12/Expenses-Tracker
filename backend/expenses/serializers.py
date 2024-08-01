from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Expense



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
                
    
class ExpenseCreateSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    class Meta:
        model = Expense
        fields = ['amount', 'date', 'category', 'description', 'username']
        extra_kwargs = {'username': {'required': False}}

    def create(self, validated_data):
        validated_data['username'] = self.context['request'].user
        return super().create(validated_data)

class ExpenseRetrieveSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    username = serializers.CharField(source='username.username', read_only=True)
    class Meta:
        model = Expense
        fields = '__all__'


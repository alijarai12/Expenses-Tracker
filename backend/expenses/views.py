from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import viewsets
from .models import Category, Expense
from .serializers import CategorySerializer, ExpenseCreateSerializer, ExpenseRetrieveSerializer
from rest_framework.permissions import IsAuthenticated
from .filters import ExpenseFilter
from django_filters.rest_framework import DjangoFilterBackend


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ExpenseListCreateView(APIView):
    filter_backends = [DjangoFilterBackend]
    filterset_class = ExpenseFilter
    permission_classes = [IsAuthenticated]
    def post(self, request,  *args, **kwargs):
        serializer = ExpenseCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, *args, **kwargs):
        expenses = Expense.objects.filter(username=request.user)
        serializers = ExpenseRetrieveSerializer(expenses, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    

class ExpenseDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk, *arg, **kwargs):
        expense  = Expense.objects.get(pk=pk, username=request.user)
        serializers = ExpenseRetrieveSerializer(expense )
        
        return Response(serializers.data, status=status.HTTP_200_OK)

    def put(self, request, pk, *args, **kwargs):
        try:
            expense = Expense.objects.get(pk=pk, username=request.user)
        except Expense.DoesNotExist:
            return Response({'message': 'Expense not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializers = ExpenseCreateSerializer(expense, data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data, status=status.HTTP_200_OK)        
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
        

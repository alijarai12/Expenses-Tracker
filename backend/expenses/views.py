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
from rest_framework.pagination import PageNumberPagination
from django.http import HttpResponse
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle,  Spacer, Paragraph
from reportlab.lib.styles import getSampleStyleSheet


class CategoryPagination(PageNumberPagination):
    page_size = 3  # Number of items per page
    page_size_query_param = 'page_size'
    max_page_size = 100

class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = CategoryPagination
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ExpenseListCreateView(APIView):
    filter_backends = [DjangoFilterBackend]
    filterset_class = ExpenseFilter
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def post(self, request,  *args, **kwargs):
        serializer = ExpenseCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, *args, **kwargs):
        queryset  = Expense.objects.filter(username=request.user)
        filtered_queryset = ExpenseFilter(request.GET, queryset=queryset).qs
        
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(filtered_queryset, request)
        if page is not None:
            serializers = ExpenseRetrieveSerializer(page, many=True)
            return paginator.get_paginated_response(serializers.data)
        
        serializers = ExpenseRetrieveSerializer(filtered_queryset, many=True)
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
        


class DownloadExpensesPDFView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, year, month):
        # Generate PDF
        pdf_buffer = self.generate_pdf_file(request.user, year, month)
        
        # Create HTTP response with PDF
        response = HttpResponse(pdf_buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename=expenses_{year}_{month:02d}.pdf'
        return response

    def generate_pdf_file(self, user, year, month):
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []
        
        expenses = Expense.objects.filter(date__year=year, date__month=month, username=user)
        styles = getSampleStyleSheet()

        data = [['Amount', 'Date', 'Category', 'Description']]
        total_amount = 0
        
        for expense in expenses:
            data.append([str(expense.amount), expense.date.strftime('%Y-%m-%d'), expense.category.name, expense.description])
            total_amount += expense.amount
        
        table = Table(data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        
        elements.append(Paragraph(f"Expenses for {user.username} - {month:02d}/{year}", styles['Title']))
        elements.append(table)
        elements.append(Spacer(1, 0.25 * inch))
        elements.append(Paragraph(f'Total Amount: {total_amount}', styles['Heading2']))

        doc.build(elements)
        buffer.seek(0)
        return buffer
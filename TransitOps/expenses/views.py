from django.shortcuts import render
from rest_framework import generics
from expenses.serializer import *
from expenses.models import Expense
# Create your views here.
class ExpensesApi(generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpensesSerializer

class ExpensesUpdateApi(generics.RetrieveUpdateDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpensesSerializer 
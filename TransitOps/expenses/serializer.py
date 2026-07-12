from .models import *
from rest_framework import serializers

class ExpensesSerializer(serializers.ModelSerializer):
    class Meta:
        model=Expense
        fields="__all__"

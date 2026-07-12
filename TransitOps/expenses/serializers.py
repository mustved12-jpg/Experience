from rest_framework import serializers
from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    vehicleId = serializers.CharField(source='vehicle_id')
    expenseType = serializers.CharField(source='expense_type')

    class Meta:
        model = Expense
        fields = ['id', 'vehicleId', 'expenseType', 'amount', 'date']

from rest_framework import serializers
from .models import Fuel


class FuelSerializer(serializers.ModelSerializer):
    vehicleId = serializers.CharField(source='vehicle_id')
    fuelLiters = serializers.DecimalField(source='fuel_liters', max_digits=10, decimal_places=2)
    fuelCost = serializers.DecimalField(source='fuel_cost', max_digits=10, decimal_places=2)

    class Meta:
        model = Fuel
        fields = ['id', 'vehicleId', 'fuelLiters', 'fuelCost', 'date']

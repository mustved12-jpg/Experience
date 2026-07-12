from rest_framework import serializers
from .models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    registrationNumber = serializers.CharField(source='registration_number')
    vehicleName = serializers.CharField(source='vehicle_name')
    vehicleType = serializers.CharField(source='vehicle_type')
    maxLoadCapacity = serializers.DecimalField(source='max_load_capacity', max_digits=10, decimal_places=2)
    acquisitionCost = serializers.DecimalField(source='acquisition_cost', max_digits=13, decimal_places=2)

    class Meta:
        model = Vehicle
        fields = ['id', 'registrationNumber', 'vehicleName', 'vehicleType', 'maxLoadCapacity', 'odometer', 'acquisitionCost', 'status']

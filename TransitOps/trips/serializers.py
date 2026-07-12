from rest_framework import serializers
from .models import Trip


class TripSerializer(serializers.ModelSerializer):
    vehicleId = serializers.CharField(source='vehicle_id')
    driverId = serializers.CharField(source='driver_id')
    cargoWeight = serializers.DecimalField(source='cargo_weight', max_digits=10, decimal_places=2)
    plannedDistance = serializers.IntegerField(source='planned_distance')

    class Meta:
        model = Trip
        fields = ['id', 'source', 'destination', 'vehicleId', 'driverId', 'cargoWeight', 'plannedDistance', 'status']

from rest_framework import serializers
from .models import Maintenance


class MaintenanceSerializer(serializers.ModelSerializer):
    vehicleId = serializers.CharField(source='vehicle_id')

    class Meta:
        model = Maintenance
        fields = ['id', 'vehicleId', 'issue', 'cost', 'date', 'status']

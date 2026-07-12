from .models import User
from rest_framework import serializers
from .models import Vehicle
from maintenance.models import Maintenance
class MaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model=Maintenance 
        fields="__all__"
from rest_framework import serializers
from .models import Driver


class DriverSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='full_name')
    licenseNumber = serializers.CharField(source='license_number')
    licenseCategory = serializers.CharField(source='license_category')
    licenseExpiryDate = serializers.DateField(source='license_expiry_date')
    contactNumber = serializers.CharField(source='contact_number')
    safetyScore = serializers.IntegerField(source='safety_score')

    class Meta:
        model = Driver
        fields = ['id', 'fullName', 'licenseNumber', 'licenseCategory', 'licenseExpiryDate', 'contactNumber', 'safetyScore', 'status']

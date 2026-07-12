from .models import *
from rest_framework import serializers

class FuelSerializer(serializers.ModelSerializer):
    class Meta:
        model=FuelLog
        fields="__all__"


from .models import User
from rest_framework import serializers

class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields="__all__"

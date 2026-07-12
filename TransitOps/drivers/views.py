from django.shortcuts import render
from rest_framework import generics
from drivers.serializer import DriverSerializer
from .models import Driver

# Create your views here.
class DriversApi(generics.ListCreateAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

class DriverUpdateApi(generics.RetrieveUpdateDestroyAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
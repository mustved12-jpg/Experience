from django.shortcuts import render
from .models import *
from .serializer import *
from rest_framework import generics
from .serializer import *

# Create your views here.
class VehicleApi(generics.ListCreateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class VehicleUpdateApi(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
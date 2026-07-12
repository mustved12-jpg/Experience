from django.shortcuts import render
from rest_framework import generics
from .serializer import *
from fuel.models import FuelLog
# Create your views here.
class FuelApi(generics.ListCreateAPIView):
    queryset = FuelLog.objects.all()
    serializer_class = FuelSerializer

class FuelUpdateApi(generics.RetrieveUpdateDestroyAPIView):
    queryset = FuelLog.objects.all()
    serializer_class = FuelSerializer

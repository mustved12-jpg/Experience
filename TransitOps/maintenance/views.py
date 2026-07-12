from django.shortcuts import render
from rest_framework import generics
from .serializer import *
from maintenance.models import MaintenanceLog
# Create your views here.
class MaintenanceApi(generics.ListCreateAPIView):
    queryset = MaintenanceLog.objects.all()
    serializer_class = MaintenanceSerializer

class MaintenanceUpdateApi(generics.RetrieveUpdateDestroyAPIView):
    queryset = MaintenanceLog.objects.all()
    serializer_class = MaintenanceSerializer
from django.shortcuts import render
from rest_framework import generics
from .serializer import *
from trips.models import Trip
# Create your views here.
class TripsApi(generics.ListCreateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

class TripUpdateApi(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
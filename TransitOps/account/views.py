from django.shortcuts import render
from rest_framework.views import APIView, Response
from .serializer import *
from .models import User
from rest_framework import generics, permissions, status

# Create your views here
class AccountApi(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = DashboardSerializer
    # def get(self,request,pk=None):
    #     if pk:
    #         try:
    #             user = User.objects.get(pk=pk)
    #             serializer = AccountSerializer(user)
    #             return Response(serializer.data)
    #         except User.DoesNotExist:
    #             return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    #     else:
    #         users = User.objects.all()
    #         serializer = AccountSerializer(users, many=True)
    #         return Response(serializer.data)
    # permission_classes = [permissions.IsAuthenticated]

    # def get(self, request, *args, **kwargs):
    #     return self.list(request, *args, **kwargs)

    # def post(self, request, *args, **kwargs):
    #     return self.create(request, *args, **kwargs)

class AccountUpdateApi(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = DashboardSerializer
    # permission_classes = [permissions.IsAuthenticated]

    # def get(self, request, *args, **kwargs):
    #     return self.retrieve(request, *args, **kwargs)

    # def put(self, request, *args, **kwargs):
    #     return self.update(request, *args, **kwargs)

    # def delete(self, request, *args, **kwargs):
    #     return self.destroy(request, *args, **kwargs)


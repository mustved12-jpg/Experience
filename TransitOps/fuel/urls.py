from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FuelViewSet

router = DefaultRouter()
router.register(r'fuel', FuelViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

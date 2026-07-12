from django.db import models
import uuid

# Create your models here.

class Vehicle(models.Model):    
    STATUS_CHOICES  = [
        ('Available','Available'),
        ('On_Trip','On Trip'),
        ('In_Shop','In Shop'),
        ('Retired','Retired')
    ]
    public_id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )
    registration_number = models.CharField(max_length=20,unique=True)
    vehicle_model = models.CharField(max_length=50)
    vehicle_type = models.CharField(max_length=50)
    capacity = models.DecimalField(max_digits=8,decimal_places=2)
    odometer = models.PositiveIntegerField()  
    acquisition_cost = models.DecimalField(max_digits=13,decimal_places=2)  # vehicale byuing  price 
    status = models.CharField(default='Available',choices=STATUS_CHOICES )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.registration_number
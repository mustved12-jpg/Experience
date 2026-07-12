from pyexpat import model
from random import choices
from django.db import models
import uuid

# Create your models here.
class Driver(models.Model):
    STATUS =[
        ('Available','Available'),
        ('On_Trip','On Trip'),
        ('Off_Duty','Off Duty'),
        ('Suspended','Suspended')
    ]
    public_id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )

    name = models.CharField(max_length=50)
    license_number = models.CharField(max_length=15)
    license_category = models.CharField(max_length=50)
    license_expiry = models.DateField()
    phone = models.PositiveBigIntegerField()
    safety_score = models.PositiveIntegerField()
    status = models.CharField(choices=STATUS)

    def __str__(self):
        return self.name
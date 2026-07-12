from email.policy import default
from random import choice, choices
from django.db import models
import uuid

# Create your models here.

class User(models.Model):
    ROLE  = [
        ('Fleet_Manager','Fleet Manager'),
        ('Dispatcher','Dispatcher'),
        ('Safety_Officer','Safety Officer'),
        ('Financial_Analyst','Financial Analyst')
    ]
    public_id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )

    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=50)
    password = models.CharField(max_length=10)
    role = models.CharField(choices=ROLE )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


from django.db import models

class Usuario(models.Model):
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True, default="example@example.com")
    password = models.CharField(max_length=100)

class Parada(models.Model):
    parada = models.IntegerField()

class Favorito(models.Model):
    username = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    parada = models.ForeignKey(Parada, on_delete=models.CASCADE)

class Consultas(models.Model):
    username = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    parada = models.ForeignKey(Parada, on_delete=models.CASCADE)
    tiempo = models.DateTimeField(auto_now_add=True)

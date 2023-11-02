from rest_framework import serializers
from .models import Usuario, Parada, Favorito, Consultas


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password']

class ParadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parada
        fields = ['parada']

class FavoritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorito
        fields = ['username', 'parada']

class ConsultasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultas
        fields = ['username', 'parada', 'tiempo']
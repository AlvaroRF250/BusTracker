from django.urls import path

from . import views

urlpatterns = [
    path('tiempo_espera/<str:idStop>/', views.tiempo_espera_view, name="datos"),
    path('lineas/', views.all_lineas, name="lineas"),
    path('registro/', views.registro, name="registro"),
    path('iniciar_sesion/', views.iniciar_sesion, name="iniciar_sesion"),
    path('agregar_favorito/', views.agregar_favorito, name="favorito"),
    path('eliminar_favorito/', views.eliminar_favorito, name="favorito"),
    path('comprobar_favorito/', views.comprobar_favorito, name="comprobar_favorito"),
    path('favoritos/<str:username>/', views.favoritos, name='obtener_favoritos'),
    path('agregar_consulta/', views.agregar_consulta, name='obtener_consultas'),
    path('consultas/<str:username>/', views.consultas, name='ultimas_consultas'),
    path('cambiar_username/', views.cambiar_username, name='cambiar_username'),
    path('cambiar_contrasena/', views.cambiar_contrasena, name='cambiar_contrasena'),
    path('eliminar_cuenta/', views.eliminar_cuenta, name='eliminar_cuenta'),
    path('paradas/', views.obtener_paradas, name="paradas")

]

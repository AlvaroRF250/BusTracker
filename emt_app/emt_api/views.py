import requests
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import json
from .models import Usuario, Parada, Favorito, Consultas

token = "f09d0f78-0689-4165-9d68-4fb91f14627d"

@api_view(['GET'])
def tiempo_espera_view(request, idStop):

    # URL de la API de la EMT para consultar la información de las llegadas
    url = f"https://openapi.emtmadrid.es/v1/transport/busemtmad/stops/{idStop}/arrives/"

    # Encabezados de la solicitud, incluyendo el token de acceso
    headers = {
        "Accept": "application/json",
        "accessToken": token,
    }

    data = {
        'Text_StopRequired_YN': 'Y',
        'Text_EstimationsRequired_YN': 'Y',
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))

    json_data = json.loads(response.text)

    estimate_arrive = {}
    for arrive in json_data['data'][0]['Arrive']:
        line = arrive['line']
        estimate = arrive['estimateArrive']
        if line in estimate_arrive:
            continue
        estimate_arrive[line] = estimate

    destinations = {}
    for destination in json_data['data'][0]['Arrive']:
        line = destination['line']
        finish = destination['destination']
        destinations[line] = finish

    id_Stop = json_data['data'][0]['StopInfo'][0]['label']
    direction = json_data['data'][0]['StopInfo'][0]['Description']
    nombre = json_data['data'][0]['StopInfo'][0]['Direction']
    coordenadas = json_data['data'][0]['StopInfo'][0]['geometry']['coordinates']
    longitud = coordenadas[0]
    latitud = coordenadas[1]

    data = {
        'id_Stop': id_Stop,
        'destination': destinations,
        'estimateArrive': estimate_arrive,
        'direction': direction,
        'nombre': nombre,
        'longitud': longitud,
        'latitud': latitud
    }

    # Si funciona, devolvemos los datos en formato JSON
    if response.status_code == 200:
        return JsonResponse(data)

    # Si falla, devolvemos un mensaje de error
    else:
        return JsonResponse({'error': 'Fallo'}, status=response.status_code)


@api_view(['GET'])
def all_lineas(request):

    url = "https://openapi.emtmadrid.es/v2/transport/busemtmad/lines/info/"

    headers = {
        "Accept": "application/json",
        "accessToken": token,
    }

    response = requests.get(url, headers=headers)

    json_data = json.loads(response.text)

    lineas = []
    for linea in json_data['data']:
        label = linea['label']
        line = linea['line']
        nameA = linea['nameA']
        nameB = linea['nameB']
        lineas.append({
            'line': line,
            'label': label,
            'nameA': nameA,
            'nameB': nameB,
        })

    data = {
        'lineas': lineas,
    }
    if response.status_code == 200:
        return JsonResponse(data)

    else:
        return {'error': 'Fallo', 'status_code': response.status_code}

@api_view(['GET'])
def obtener_paradas(request):
    url = "https://openapi.emtmadrid.es/v1/transport/busemtmad/stops/list/"
    headers = {
        "Content-Type": "application/json",
        "accessToken": token,
    }

    response = requests.post(url, headers=headers)

    if response.status_code == 200:
        json_data = response.json()
        paradas = []

        for parada in json_data['data']:
            numero_parada = parada['node']
            direccion = parada['name']
            coordenadas = parada['geometry']['coordinates']
            longitud, latitud = coordenadas  # Dividir las coordenadas en longitud y latitud
            paradas.append({
                'numero_parada': numero_parada,
                'direccion': direccion,
                'longitud': longitud,
                'latitud': latitud
            })


        return JsonResponse(paradas, safe=False)

    else:
        return JsonResponse({'error': 'Fallo'}, status=response.status_code)



@csrf_exempt
def registro(request):

    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if not username or not email or not password:
            return JsonResponse({'error': 'Rellena todos los campos'}, status=400)

        try:
            Usuario.objects.get(Q(username=username) | Q(email=email))
            return JsonResponse({'error': 'El usuario o el email ya están registrados'},
                                status=400)
        except ObjectDoesNotExist:
            Usuario.objects.create(username=username, email=email, password=password)

            return JsonResponse({'message': 'Usuario registrado exitosamente'})
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)


@csrf_exempt
def iniciar_sesion(request):
    session = request.session

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        try:
            user = Usuario.objects.get(username=username)
            if user.password == password:
                session['is_logged_in'] = True
                session['username'] = username
                session.save()
                return JsonResponse({'message': 'Inicio de sesión exitoso'})
            else:
                return JsonResponse({'error': 'El usuario os la contraseña no son correctos'}, status=400)
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'El usuario os la contraseña no son correctos'}, status=400)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)


@csrf_exempt
def agregar_favorito(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        id_Stop = request.POST.get('id_Stop')

        if not username or not id_Stop:
            return JsonResponse({'error': 'El nombre de usuario y el ID de la parada son requeridos'}, status=400)

        try:
            usuario = Usuario.objects.get(username=username)
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'El usuario no existe'}, status=400)

        try:
            parada = Parada.objects.get(parada=id_Stop)
        except Parada.DoesNotExist:
            parada = Parada.objects.create(parada=id_Stop)

        favorito_exists = Favorito.objects.filter(username=usuario, parada=parada).exists()
        if favorito_exists:
            return JsonResponse({'error': 'La parada ya está agregada como favorita'}, status=400)

        favorito = Favorito.objects.create(username=usuario, parada=parada)
        favorito.save()

        return JsonResponse({'message': 'Parada agregada a favoritos correctamente'})
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def comprobar_favorito(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        id_Stop = request.POST.get('id_Stop')

        if not username or not id_Stop:
            return JsonResponse({'error': 'El nombre de usuario y el ID de la parada son requeridos'}, status=400)

        try:
            usuario = Usuario.objects.get(username=username)
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'El usuario no existe'}, status=400)

        try:
            parada = Parada.objects.get(parada=id_Stop)
        except Parada.DoesNotExist:
            parada = None

        is_favorite = Favorito.objects.filter(username=usuario, parada=parada).exists()
        return JsonResponse({'is_favorite': is_favorite}, status=200)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def eliminar_favorito(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        id_Stop = request.POST.get('id_Stop')

        if not username or not id_Stop:
            return JsonResponse({'error': 'El nombre de usuario y el ID de la parada son requeridos'}, status=400)

        try:
            usuario = Usuario.objects.get(username=username)
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'El usuario no existe'}, status=400)

        try:
            parada = Parada.objects.get(parada=id_Stop)
        except Parada.DoesNotExist:
            return JsonResponse({'error': 'La parada no existe'}, status=400)

        favorito = Favorito.objects.filter(username=usuario, parada=parada)
        if not favorito.exists():
            return JsonResponse({'error': 'La parada no está agregada como favorita'}, status=400)

        favorito.delete()

        return JsonResponse({'message': 'Parada eliminada de favoritos correctamente'})
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def favoritos(request, username):

    try:
        usuario = Usuario.objects.get(username=username)
        favoritos = Favorito.objects.filter(username=usuario)

        favoritos_data = []
        for favorito in favoritos:
            favoritos_data.append({
                'parada': favorito.parada.parada,
            })

        return JsonResponse({'favoritos': favoritos_data})
    except Usuario.DoesNotExist:
        return JsonResponse({'error': 'El usuario no existe'}, status=400)

@csrf_exempt
def agregar_consulta(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        id_Stop = request.POST.get('id_Stop')

        if not username or not id_Stop:
            return JsonResponse({'error': 'El nombre de usuario y el ID de la parada son requeridos'}, status=400)

        try:
            usuario = Usuario.objects.get(username=username)
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'El usuario no existe'}, status=400)

        try:
            parada = Parada.objects.get(parada=id_Stop)
        except Parada.DoesNotExist:
            parada = Parada.objects.create(parada=id_Stop)

        try:
            consulta = Consultas.objects.create(username=usuario, parada=parada)
            consulta.save()
        except IndexError:
            return JsonResponse({'error': 'La parada no existe'}, status=400)

        return JsonResponse({'message': 'Consulta agregada correctamente'})
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)


@csrf_exempt
def consultas(request, username):

    try:
        usuario = Usuario.objects.get(username=username)
        consultas = Consultas.objects.filter(username=usuario)

        consultas_data = []
        for consulta in consultas:
            consultas_data.append({
                'parada': consulta.parada.parada,
            })

        return JsonResponse({'consultas': consultas_data})
    except Usuario.DoesNotExist:
        return JsonResponse({'error': 'El usuario no existe'}, status=400)
@csrf_exempt
def cambiar_username(request):
    if request.method == 'POST':
        new_username = request.POST.get('new_username')
        username = request.POST.get('username')

        try:
            user = Usuario.objects.get(username=username)
            user.username = new_username
            user.save()
            return JsonResponse({'success': True})
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'User not found'})
    else:
        return JsonResponse({'error': 'Invalid request method'})


@csrf_exempt
def cambiar_contrasena(request):
    if request.method == 'POST':
        old_password = request.POST.get('old_password')
        new_password = request.POST.get('new_password')
        username = request.POST.get('username')

        try:
            user = Usuario.objects.get(username=username)

            if user.password == old_password:
                user.password = new_password
                user.save()
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'error': 'La contraseña antigua no coincide'})
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'})
    else:
        return JsonResponse({'error': 'Método no permitido'})


@csrf_exempt
def eliminar_cuenta(request):
    if request.method == 'POST':

        username = request.POST.get('username')
        try:
            user = Usuario.objects.get(username=username)
            user.delete()
            return JsonResponse({'success': True})
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'User not found'})
    else:
        return JsonResponse({'error': 'Invalid request method'})
from django.shortcuts import render


def chat(request):
    return render(request, 'index.html', {'text': 'Hello WebSocket'})


def room(request, room_name):
    return render(request, 'room.html', {'room_name': room_name})

from django.shortcuts import render
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.cache import cache

from rest_framework import viewsets

from .serializers import CharacterSerializer
from .models import Character

from dotenv import load_dotenv
import os
import openai

load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')
const_str = "Этот вопрос касается игры Майнкрафт: "

def index(request):
    return render(request, 'index.html')


def admin(request):
    return render(request, 'admin.html')


class CharacterViewSet(viewsets.ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer

    @method_decorator(cache_page(30))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(30))
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def perform_create(self, serializer):
        response = serializer.save()
        cache.clear()
        print("Кэш очищен")
        return response

    def perform_update(self, serializer):
        response = serializer.save()
        cache.clear()
        print("Кэш очищен")
        return response

    def perform_destroy(self, instance):
        instance.delete()
        cache.clear()
        print("Кэш очищен")




def generate_ai_response(request):
    prompt = request.GET.get('prompt')
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": const_str + prompt}
        ]
    )

    return JsonResponse({"response":response['choices'][0]['message']['content']})
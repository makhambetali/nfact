
from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'characters', views.CharacterViewSet, basename='character')

urlpatterns = [
    path('', views.index, name='client-page'),
    path('admin-page/', views.admin, name='admin-page'),
    path('api/v1/', include(router.urls)),
    path('api/v1/ask_ai/', views.generate_ai_response)
]

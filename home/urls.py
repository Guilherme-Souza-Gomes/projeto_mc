from django.urls import path
from . import views


urlpatterns = [
    path('', views.home_render, name="home"),
    path('primeiroacess/', views.primeiroacess_render, name="primeiroacess"),
    path('api/timeline/', views.get_timeline_items, name="get_timeline_items"),
    path('api/timeline/add/', views.add_timeline_item, name="add_timeline_item"),
    path('api/mural/', views.get_messages, name="get_messages"),
    path('api/mural/add/', views.add_message, name="add_message"),
]
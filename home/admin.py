from django.contrib import admin
from .models import TimelineItem, Message


@admin.register(TimelineItem)
class TimelineItemAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'data', 'criado_em')
    list_filter = ('data', 'criado_em')
    search_fields = ('titulo', 'descricao')
    ordering = ('-data',)
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('titulo', 'descricao')
        }),
        ('Mídia', {
            'fields': ('imagem',)
        }),
        ('Data', {
            'fields': ('data',)
        }),
    )


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('nome', 'criado_em')
    list_filter = ('criado_em',)
    search_fields = ('nome', 'texto')
    ordering = ('-criado_em',)
    
    fieldsets = (
        ('Informações', {
            'fields': ('nome', 'texto')
        }),
        ('Meta', {
            'fields': ('criado_em',)
        }),
    )
    readonly_fields = ('criado_em',)

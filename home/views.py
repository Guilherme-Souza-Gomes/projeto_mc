from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import TimelineItem, Message
from .forms import TimelineItemForm, MessageForm

def home_render(request):
    return render(request, 'home/index.html', {'show_slides': False})


def primeiroacess_render(request):
    return render(request, 'home/index.html', {'show_slides': True})


@require_http_methods(["GET"])
def get_timeline_items(request):
    """Retorna todos os itens de timeline em JSON"""
    items = TimelineItem.objects.all().order_by('-data')
    data = []
    
    for item in items:
        data.append({
            'id': item.id,
            'titulo': item.titulo,
            'descricao': item.descricao,
            'imagem': item.imagem.url if item.imagem else '',
            'data': item.data.strftime('%d de %B de %Y').replace(
                'January', 'Janeiro'
            ).replace('February', 'Fevereiro'
            ).replace('March', 'Março'
            ).replace('April', 'Abril'
            ).replace('May', 'Maio'
            ).replace('June', 'Junho'
            ).replace('July', 'Julho'
            ).replace('August', 'Agosto'
            ).replace('September', 'Setembro'
            ).replace('October', 'Outubro'
            ).replace('November', 'Novembro'
            ).replace('December', 'Dezembro'),
        })
    
    return JsonResponse({'items': data})


@require_http_methods(["POST"])
def add_timeline_item(request):
    """Adiciona um novo item de timeline"""
    form = TimelineItemForm(request.POST, request.FILES)
    
    if form.is_valid():
        item = form.save()
        return JsonResponse({
            'success': True,
            'message': 'Momento adicionado com sucesso!',
            'item': {
                'id': item.id,
                'titulo': item.titulo,
                'descricao': item.descricao,
                'imagem': item.imagem.url,
                'data': item.data.strftime('%d de %B de %Y'),
            }
        })
    else:
        return JsonResponse({
            'success': False,
            'errors': form.errors
        }, status=400)


@require_http_methods(["GET"])
def get_messages(request):
    items = Message.objects.all().order_by('-criado_em')
    data = []

    for item in items:
        data.append({
            'id': item.id,
            'nome': item.nome,
            'texto': item.texto,
            'data': item.criado_em.strftime('%d de %B de %Y %H:%M').replace(
                'January', 'Janeiro'
            ).replace('February', 'Fevereiro'
            ).replace('March', 'Março'
            ).replace('April', 'Abril'
            ).replace('May', 'Maio'
            ).replace('June', 'Junho'
            ).replace('July', 'Julho'
            ).replace('August', 'Agosto'
            ).replace('September', 'Setembro'
            ).replace('October', 'Outubro'
            ).replace('November', 'Novembro'
            ).replace('December', 'Dezembro'),
        })

    return JsonResponse({'items': data})


@require_http_methods(["POST"])
def add_message(request):
    form = MessageForm(request.POST)
    if form.is_valid():
        item = form.save()
        return JsonResponse({
            'success': True,
            'message': 'Mensagem adicionada com sucesso!',
            'item': {
                'id': item.id,
                'nome': item.nome,
                'texto': item.texto,
                'data': item.criado_em.strftime('%d de %B de %Y %H:%M'),
            }
        })
    else:
        return JsonResponse({
            'success': False,
            'errors': form.errors
        }, status=400)
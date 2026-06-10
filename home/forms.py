from django import forms
from .models import TimelineItem, Message


class TimelineItemForm(forms.ModelForm):
    class Meta:
        model = TimelineItem
        fields = ['titulo', 'descricao', 'imagem', 'data']
        widgets = {
            'titulo': forms.TextInput(attrs={
                'class': 'input-estilizado',
                'placeholder': 'Título do momento',
                'required': True
            }),
            'descricao': forms.Textarea(attrs={
                'class': 'input-estilizado',
                'placeholder': 'Descreva este momento especial...',
                'rows': 3
            }),
            'imagem': forms.FileInput(attrs={
                'class': 'input-arquivo',
                'accept': 'image/*'
            }),
            'data': forms.DateInput(attrs={
                'class': 'input-estilizado',
                'type': 'date'
            }),
        }


class MessageForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = ['nome', 'texto']
        widgets = {
            'nome': forms.TextInput(attrs={
                'class': 'input-estilizado',
                'placeholder': 'Seu nome',
                'required': True
            }),
            'texto': forms.Textarea(attrs={
                'class': 'input-estilizado',
                'placeholder': 'Escreva algo lindo aqui...',
                'rows': 4,
                'required': True
            }),
        }

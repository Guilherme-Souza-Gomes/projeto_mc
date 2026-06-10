from django.db import models
from django.utils import timezone

class TimelineItem(models.Model):
    titulo = models.CharField(max_length=255, verbose_name="Título")
    descricao = models.TextField(verbose_name="Descrição/Legenda", blank=True)
    imagem = models.ImageField(upload_to='timeline/', verbose_name="Imagem")
    data = models.DateField(verbose_name="Data do evento", default=timezone.now)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-data']
        verbose_name = "Item de Timeline"
        verbose_name_plural = "Itens de Timeline"
    
    def __str__(self):
        return f"{self.titulo} - {self.data.strftime('%d/%m/%Y')}"


class Message(models.Model):
    nome = models.CharField(max_length=100, verbose_name="Nome")
    texto = models.TextField(verbose_name="Mensagem")
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-criado_em']
        verbose_name = "Mensagem"
        verbose_name_plural = "Mensagens"

    def __str__(self):
        return f"{self.nome} - {self.criado_em.strftime('%d/%m/%Y %H:%M')}"
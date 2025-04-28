from django.db import models

class Character(models.Model):

    CLASSIFICATION_CHOICES = [
        ('animals', 'Животные'),
        ('hostile', 'Враждебные мобы'),
        ('neutral', 'Нейтральные мобы'),
        ('npc', 'Мирные NPC'),
        ('main', 'Главный персонаж'),
        ('boss', 'Босс-мобы'),
    ]
    
    name = models.CharField(max_length=20)
    classification = models.CharField(
        max_length=20,
        choices=CLASSIFICATION_CHOICES, 
        default='neutral',
    )
    description = models.TextField()
    image = models.ImageField(upload_to='media/', blank=True, null=True)
    special_information = models.TextField()

    def __str__(self):
        return self.name

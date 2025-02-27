# backend/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import ProdutoViewSet
from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()
router.register(r'produtos', ProdutoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # As rotas da API
    # Não precisa do 'produtos.urls' aqui, já que você não tem esse arquivo
]

# Serve arquivos de mídia (imagens, etc.) durante o desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

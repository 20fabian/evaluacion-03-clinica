from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'especialidades', views.EspecialidadViewSet, basename='especialidad')
router.register(r'medicos', views.MedicoViewSet, basename='medico')
router.register(r'pacientes', views.PacienteViewSet, basename='paciente')
router.register(r'estados', views.EstadoCitaViewSet, basename='estado')
router.register(r'citas', views.CitaViewSet, basename='cita')
router.register(r'historias', views.HistoriaClinicaViewSet, basename='historia')

urlpatterns = [
    path('', include(router.urls)),
]

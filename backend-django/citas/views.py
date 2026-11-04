from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Especialidad, Medico, Paciente, EstadoCita, Cita, HistoriaClinica,
)
from .serializers import (
    EspecialidadSerializer, MedicoSerializer, PacienteSerializer,
    EstadoCitaSerializer, CitaSerializer, HistoriaClinicaSerializer,
)


class EspecialidadViewSet(viewsets.ModelViewSet):
    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer


class MedicoViewSet(viewsets.ModelViewSet):
    queryset = Medico.objects.all().select_related('especialidad')
    serializer_class = MedicoSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        especialidad = self.request.query_params.get('especialidad')
        if especialidad:
            qs = qs.filter(especialidad_id=especialidad)
        return qs


class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer


class EstadoCitaViewSet(viewsets.ModelViewSet):
    queryset = EstadoCita.objects.all()
    serializer_class = EstadoCitaSerializer


class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all().select_related(
        'paciente', 'medico', 'medico__especialidad', 'estado'
    )
    serializer_class = CitaSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        fecha = self.request.query_params.get('fecha')
        if fecha:
            qs = qs.filter(fecha=fecha)
        return qs

    @action(detail=False, methods=['get'], url_path='estados')
    def estados(self, request):
        """Endpoint /api/citas/estados/ que devuelve los estados de cita."""
        estados = EstadoCita.objects.all()
        serializer = EstadoCitaSerializer(estados, many=True)
        return Response(serializer.data)


class HistoriaClinicaViewSet(viewsets.ModelViewSet):
    queryset = HistoriaClinica.objects.all().select_related('paciente')
    serializer_class = HistoriaClinicaSerializer

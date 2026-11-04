from rest_framework import serializers
from django.utils import timezone
from .models import (
    Especialidad, Medico, Paciente, EstadoCita, Cita, HistoriaClinica,
)


class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = '__all__'


class MedicoSerializer(serializers.ModelSerializer):
    especialidad_nombre = serializers.CharField(
        source='especialidad.nombre', read_only=True
    )

    class Meta:
        model = Medico
        fields = ['id', 'nombres', 'cmp', 'especialidad', 'especialidad_nombre',
                  'telefono', 'correo']


class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = '__all__'


class EstadoCitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoCita
        fields = '__all__'


class CitaSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.CharField(
        source='paciente.nombres', read_only=True
    )
    medico_nombre = serializers.CharField(
        source='medico.nombres', read_only=True
    )
    especialidad = serializers.CharField(
        source='medico.especialidad.nombre', read_only=True
    )
    estado_nombre = serializers.CharField(
        source='estado.nombre', read_only=True
    )

    class Meta:
        model = Cita
        fields = [
            'id', 'paciente', 'paciente_nombre', 'medico', 'medico_nombre',
            'especialidad', 'fecha', 'hora', 'motivo', 'estado', 'estado_nombre',
        ]

    def validate(self, data):
        # Rechazar fecha pasada
        fecha = data.get('fecha')
        hoy = timezone.localdate()
        if fecha and fecha < hoy:
            raise serializers.ValidationError(
                {'fecha': 'La fecha de la cita no puede ser anterior a hoy.'}
            )

        # Rechazar si el medico ya tiene cita en esa fecha y hora
        medico = data.get('medico')
        hora = data.get('hora')
        if medico and fecha and hora:
            qs = Cita.objects.filter(medico=medico, fecha=fecha, hora=hora)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    {'non_field_errors': [
                        'El m�dico ya tiene una cita en esa fecha y hora.'
                    ]}
                )

        return data


class HistoriaClinicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoriaClinica
        fields = '__all__'

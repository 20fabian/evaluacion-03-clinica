from django.db import models


class Especialidad(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre


class Medico(models.Model):
    nombres = models.CharField(max_length=150)
    cmp = models.CharField(max_length=20, unique=True)  # n�mero de colegiatura
    especialidad = models.ForeignKey(
        Especialidad, on_delete=models.PROTECT, related_name='medicos'
    )
    telefono = models.CharField(max_length=20, blank=True)
    correo = models.EmailField(blank=True)

    def __str__(self):
        return f"{self.nombres} ({self.especialidad})"


class Paciente(models.Model):
    dni = models.CharField(max_length=8, unique=True)  # 8 d�gitos
    nombres = models.CharField(max_length=150)
    fecha_nacimiento = models.DateField()
    telefono = models.CharField(max_length=20, blank=True)
    correo = models.EmailField(blank=True)

    def __str__(self):
        return f"{self.nombres} (DNI {self.dni})"


class EstadoCita(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    es_final = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre


class Cita(models.Model):
    paciente = models.ForeignKey(
        Paciente, on_delete=models.PROTECT, related_name='citas'
    )
    medico = models.ForeignKey(
        Medico, on_delete=models.PROTECT, related_name='citas'
    )
    fecha = models.DateField()
    hora = models.TimeField()
    motivo = models.TextField(blank=True)
    estado = models.ForeignKey(
        EstadoCita, on_delete=models.PROTECT, related_name='citas'
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['medico', 'fecha', 'hora'],
                name='unique_medico_fecha_hora',
            )
        ]

    def __str__(self):
        return f"Cita {self.pk} - {self.paciente} con {self.medico} ({self.fecha} {self.hora})"


class HistoriaClinica(models.Model):
    paciente = models.OneToOneField(
        Paciente, on_delete=models.CASCADE, related_name='historia'
    )
    grupo_sanguineo = models.CharField(max_length=5, blank=True)
    alergias = models.TextField(blank=True)
    antecedentes = models.TextField(blank=True)

    def __str__(self):
        return f"Historia de {self.paciente}"

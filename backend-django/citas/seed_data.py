from django.utils import timezone
from citas.models import (
    Especialidad, Medico, Paciente, EstadoCita, Cita,
)

def run():
    # Especialidades
    esp_data = [
        ('Medicina General', 'Atenci�n primaria y prevenci�n'),
        ('Pediatria', 'Salud de ni�os y adolescentes'),
        ('Cardiologia', 'Coraz�n y circulaci�n'),
        ('Dermatologia', 'Piel, cabello y unas'),
        ('Traumatologia', 'Huesos y articulaciones'),
        ('Odontologia', 'Salud bucal y dental'),
    ]
    especialidades = []
    for nombre, desc in esp_data:
        e, _ = Especialidad.objects.get_or_create(nombre=nombre, defaults={'descripcion': desc})
        especialidades.append(e)

    # Estados de cita
    estados_data = [
        ('pendiente', False),
        ('confirmada', False),
        ('atendida', True),
        ('cancelada', True),
    ]
    estados = {}
    for nombre, es_final in estados_data:
        est, _ = EstadoCita.objects.get_or_create(nombre=nombre, defaults={'es_final': es_final})
        estados[nombre] = est

    # M�nicos (al menos 4)
    medicos_data = [
        ('Dra. Rosa Quispe', 'CMP-1001', especialidades[0], '987654321', 'rosa.quispe@clinica.pe'),
        ('Dr. Juan Perez', 'CMP-1002', especialidades[0], '987654322', 'juan.perez@clinica.pe'),
        ('Dra. Maria Torres', 'CMP-1003', especialidades[1], '987654323', 'maria.torres@clinica.pe'),
        ('Dr. Luis Ramos', 'CMP-1004', especialidades[2], '987654324', 'luis.ramos@clinica.pe'),
        ('Dra. Ana Flores', 'CMP-1005', especialidades[2], '987654325', 'ana.flores@clinica.pe'),
        ('Dr. Pedro Suarez', 'CMP-1006', especialidades[4], '987654326', 'pedro.suarez@clinica.pe'),
    ]
    for nombres, cmp_, esp, tel, correo in medicos_data:
        Medico.objects.get_or_create(
            cmp=cmp_,
            defaults={'nombres': nombres, 'especialidad': esp, 'telefono': tel, 'correo': correo},
        )

    # Pacientes (al menos 5)
    pacientes_data = [
        ('45678912', 'Carlos Mamani', '1990-05-12', '912345678', 'carlos.mamani@mail.pe'),
        ('78945612', 'Lucia Fernandez', '1985-03-04', '923456789', 'lucia.fernandez@mail.pe'),
        ('12345678', 'Jorge Medina', '1978-11-30', '934567890', 'jorge.medina@mail.pe'),
        ('87654321', 'Elena Vargas', '1995-07-21', '945678901', 'elena.vargas@mail.pe'),
        ('10293847', 'Pedro Rojas', '2001-01-15', '956789012', 'pedro.rojas@mail.pe'),
    ]
    for dni, nombres, fec, tel, correo in pacientes_data:
        Paciente.objects.get_or_create(
            dni=dni,
            defaults={'nombres': nombres, 'fecha_nacimiento': fec, 'telefono': tel, 'correo': correo},
        )

    # Citas de ejemplo
    hoy = timezone.localdate()
    medico1 = Medico.objects.filter(cmp='CMP-1001').first()
    medico3 = Medico.objects.filter(cmp='CMP-1003').first()
    medico4 = Medico.objects.filter(cmp='CMP-1004').first()
    p1 = Paciente.objects.filter(dni='45678912').first()
    p2 = Paciente.objects.filter(dni='78945612').first()
    p3 = Paciente.objects.filter(dni='12345678').first()
    est_pendiente = estados['pendiente']
    est_confirmada = estados['confirmada']

    citas_data = [
        (p1, medico1, hoy, '09:00', 'Control anual', est_pendiente),
        (p2, medico3, hoy, '10:30', 'Vacunaci�n', est_confirmada),
        (p3, medico4, hoy, '11:00', 'Electrocardiograma', est_pendiente),
    ]
    for paciente, medico, fecha, hora, motivo, estado in citas_data:
        Cita.objects.get_or_create(
            medico=medico, fecha=fecha, hora=hora,
            defaults={'paciente': paciente, 'motivo': motivo, 'estado': estado},
        )

    print('Datos de prueba creados correctamente.')
    print(f'Especialidades: {Especialidad.objects.count()}')
    print(f'M�dicos: {Medico.objects.count()}')
    print(f'Pacientes: {Paciente.objects.count()}')
    print(f'Estados: {EstadoCita.objects.count()}')
    print(f'Citas: {Cita.objects.count()}')

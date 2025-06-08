# 📄 Modelo de Datos - Reunión360

Este documento describe el modelo de datos utilizado en la base de datos Firebase Firestore para el proyecto Reunión360. A continuación se detallan las colecciones principales, los campos de cada documento y las relaciones entre ellos, adaptado al estilo NoSQL.

---

## 🟪 Usuario

Representa a los usuarios registrados en el sistema.

Atributos:
- id: string
- nombre: string
- email: string
- rol: string (referencia a /roles/id)
- empresaId: string (referencia a /empresas/id)

Métodos:
- registrarUsuario()
- iniciarSesion()
- actualizarPerfil()
- asignarRol(rol: string)
- verEventosInscritos()

Subcolecciones:
- accesos
- historial_eventos

---

## 🟪 Empresa

Entidad que agrupa a usuarios según su organización.

Atributos:
- id: string
- nombre: string
- rut: string
- direccion: string
- rubro: string

Métodos:
- registrarEmpresa()
- actualizarEmpresa()
- listarEmpleados()

---

## 🟪 Evento

Reunión virtual o presencial creada por un organizador.

Atributos:
- id: string
- nombre: string
- descripcion: string
- fecha: timestamp
- linkVideollamada: string
- organizadorId: string (referencia a /usuarios/id)

Métodos:
- crearEvento()
- actualizarEvento()
- eliminarEvento()
- agregarAsistente(usuarioId: string)
- enviarInvitaciones()

Subcolecciones:
- asistentes

---

## 🟪 AsistenteEvento (Subcolección de /eventos)

Documento que representa la participación de un usuario en un evento específico.

Atributos:
- usuarioId: string (referencia a /usuarios/id)
- confirmado: boolean
- horaIngreso: timestamp
- horaSalida: timestamp

Métodos:
- registrarAsistencia()
- confirmarAsistencia()
- marcarSalida()

---

## 🟪 Rol

Define tipos de usuario y permisos disponibles en el sistema.

Atributos:
- id: string
- nombre: string (admin, organizador, asistente, etc.)
- permisos: string[]

Métodos:
- crearRol()
- asignarPermiso(permiso: string)
- revocarPermiso(permiso: string)

---

## 🟪 Notificación

Mensajes enviados a los usuarios por parte del sistema.

Atributos:
- id: string
- usuarioId: string (referencia a /usuarios/id)
- mensaje: string
- leido: boolean
- fecha: timestamp

Métodos:
- enviarNotificacion()
- marcarComoLeida()
- eliminarNotificacion()

---

## 🔄 Relaciones Principales

- Usuario → Empresa (usuario.empresaId)
- Usuario → Rol (usuario.rol)
- Evento → Usuario (organizadorId)
- Evento → asistentes → Usuario (usuarioId)
- Notificación → Usuario (usuarioId)

---
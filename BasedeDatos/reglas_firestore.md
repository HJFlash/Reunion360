
# 🔐 Reglas de Seguridad Firestore - Reunión360

Este archivo documenta las reglas de seguridad utilizadas en Firebase Firestore para el proyecto Reunión360. Estas reglas controlan el acceso a la base de datos según el rol del usuario, garantizando que cada persona solo pueda acceder a lo que le corresponde.

Las reglas están organizadas por colección y subcolección. Se utiliza request.auth.uid para verificar que el usuario esté autenticado y tenga permisos válidos.

---


rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /empresas/{empresaId} {
      allow read, write: if request.auth.token.role == 'admin';
    }

    match /roles/{rolId} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    match /eventos/{eventoId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'organizador' || request.auth.token.role == 'admin';
    }

    match /eventos/{eventoId}/asistentes/{asistenteId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == asistenteId || request.auth.token.role == 'organizador';
    }

    match /notificaciones/{notificacionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.usuarioId;
    }
  }
}

# Especificaciones del Sistema (SPECIFICATIONS)

Este documento describe las reglas del negocio, el modelo de datos bajo el Diseño Guiado por Dominio (DDD), y cómo se mapean los tipos de datos en la base de datos Redis.

## 1. Domain-Driven Design (DDD)

El dominio central de esta aplicación es la **Comunicación Síncrona en Tiempo Real (Chat)**.

### Subdominios y Agregados
- **Agregado User (Usuario):** Responsable de mantener el estado de los participantes en la sala de chat.
  - Entidad Raíz: `User`
- **Agregado Message (Mensaje):** Responsable de almacenar el historial y contenido de los mensajes intercambiados.
  - Entidad Raíz: `Message`

### Reglas de Negocio
1. **Unicidad de Usuarios:** Un nombre de usuario (`username`) debe ser único en la sesión activa.
2. **Respuesta Automática del Bot:** Cuando un usuario envía un mensaje, el sistema disparará un evento global. El `Chat Bot` debe reaccionar a este evento en un máximo de 3 segundos enviando una respuesta.
3. **Persistencia:** Todos los mensajes deben quedar guardados en una lista o estructura en Redis, de forma que los usuarios nuevos puedan ver el historial reciente al conectarse.

## 2. Modelo de Datos y Tipos (Persistencia en Redis)

Para cumplir con el requerimiento de la rúbrica (15 tipos de datos persistentes), hemos diseñado la siguiente estructura de *Hashes* (HSET) y *Listas* (LPUSH/RPUSH) en Redis.

### Estructura del Usuario (`User`)
Almacenado como un *Hash* en la llave: `user:<id_usuario>`

| Campo Redis | Tipo Lógico | Descripción |
| :--- | :--- | :--- |
| `id` | **String / UUID** | Identificador único del usuario. |
| `username` | **String (Cadena)** | Nombre visible en el chat. |
| `is_bot` | **Boolean** | Define si el usuario es un bot (`true` o `false`). |
| `created_at` | **Timestamp / Fecha** | Fecha y hora de creación (ej. `1716383210`). |
| `status_code` | **Integer (Entero)** | Código de estado (ej. `1`=online, `0`=offline). |
| `ip_address` | **String (IP)** | Dirección IP desde donde se conectó. |
| `avatar_color` | **String (Hex)** | Color hexadecimal para su icono de usuario. |
| `score` | **Float (Decimal)** | Nivel de actividad del usuario (ej. `10.5`). |

### Estructura del Mensaje (`Message`)
Almacenado como JSON/String dentro de una *Lista* en la llave: `chat:messages` o como un *Hash* individual `message:<id_mensaje>`.

| Campo Redis | Tipo Lógico | Descripción |
| :--- | :--- | :--- |
| `msg_id` | **String / UUID** | Identificador único del mensaje. |
| `sender_id` | **String / UUID** | Relación al `id` del usuario que lo envió. |
| `content` | **Text (Texto largo)** | El texto del mensaje. |
| `sent_at` | **Datetime (Fecha/Hora)** | Momento exacto de envío en formato ISO. |
| `read_by_bot` | **Boolean** | Marca si el bot ya procesó el mensaje (`true` o `false`). |
| `attachments_count` | **Integer (Entero)** | Cantidad de archivos adjuntos (siempre 0 para esta MVP). |
| `priority` | **Char (Carácter)** | Prioridad del mensaje ('A' Alta, 'N' Normal, 'B' Baja). |

*(Total de datos mapeados: 8 en User + 7 en Message = 15 datos distintos con tipos variados).*

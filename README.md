# Laboratorio de Chat Contenerizado (Podman / Docker)

Este proyecto cumple con los requisitos de la rúbrica de la Actividad Sumativa (Unidad 2). Despliega una aplicación de chat usando contenedores, un Bot autónomo, y Redis como almacenamiento persistente (implementando un modelo de Diseño Guiado por Dominio - DDD, con más de 15 datos únicos).

## Requisitos
- [Podman Desktop](https://podman-desktop.io/) o Docker Desktop instalados en macOS.
- En caso de usar Podman desde terminal, asegurar alias: `alias docker=podman`

## Arquitectura de la Solución
- **Redis (`chat_redis`)**: Base de datos para usuarios y mensajes. Maneja también el sistema Pub/Sub.
- **Chat Server (`chat_server`)**: Aplicación Node.js que provee la Web UI e interactúa con Redis y WebSockets. Genera salas privadas para cada conexión.
- **Chat Bot (`chat_bot`)**: Aplicación Node.js autónoma que responde automáticamente de manera privada a los mensajes enviados por el usuario.
- **Admin App (`admin_app`)**: Aplicación Node.js para administradores. Muestra usuarios conectados en tiempo real y permite emitir alertas globales a todas las salas de chat usando Pub/Sub.

## Comandos Docker / Podman (30 comandos solicitados)
Aquí se muestra una guía detallada de más de 30 comandos útiles de Podman/Docker. Para el video de la evaluación, puedes utilizar esta lista como referencia.

### 1. Gestión del Sistema e Información
1. `podman version` - Muestra la versión instalada.
2. `podman info` - Muestra información detallada del sistema y contenedores.
3. `podman system df` - Muestra el uso de disco de Podman.
4. `podman system prune -a` - Limpia todo el sistema (imágenes, contenedores y redes sin uso).

### 2. Gestión de Imágenes
5. `podman search redis` - Busca una imagen en los repositorios.
6. `podman pull redis:7-alpine` - Descarga una imagen específica.
7. `podman images` - Lista las imágenes locales.
8. `podman image inspect redis:7-alpine` - Muestra metadatos de la imagen.
9. `podman tag redis:7-alpine mi-redis:local` - Etiqueta una imagen con un nuevo nombre.
10. `podman rmi mi-redis:local` - Elimina una imagen.
11. `podman build -t chat-server:1.0 ./chat-server` - Construye una imagen a partir del Dockerfile.
12. `podman history redis:7-alpine` - Muestra el historial de construcción de una imagen.

### 3. Gestión de Contenedores
13. `podman run -d --name test_redis redis:7-alpine` - Crea y corre un contenedor en background.
14. `podman ps` - Lista contenedores en ejecución.
15. `podman ps -a` - Lista todos los contenedores (activos e inactivos).
16. `podman stop test_redis` - Detiene un contenedor en ejecución.
17. `podman start test_redis` - Inicia un contenedor detenido.
18. `podman restart test_redis` - Reinicia un contenedor.
19. `podman pause test_redis` - Pausa todos los procesos en un contenedor.
20. `podman unpause test_redis` - Reanuda procesos en un contenedor.
21. `podman rm test_redis` - Elimina un contenedor detenido.
22. `podman rm -f test_redis` - Fuerza la eliminación de un contenedor en ejecución.

### 4. Interacción con Contenedores
23. `podman logs chat_server` - Muestra los logs de la aplicación.
24. `podman logs -f chat_bot` - Muestra los logs en tiempo real.
25. `podman exec -it chat_redis redis-cli` - Entra al contenedor interactivo para explorar la DB.
26. `podman top chat_server` - Muestra los procesos ejecutándose dentro del contenedor.
27. `podman inspect chat_bot` - Muestra la configuración completa del contenedor en JSON.
28. `podman cp archivo.txt test_redis:/data/` - Copia un archivo local hacia el contenedor (y viceversa).

### 5. Redes y Volúmenes
29. `podman network ls` - Lista las redes virtuales.
30. `podman volume ls` - Lista los volúmenes persistentes creados.
31. `podman network inspect chat_network` - Revisa las IPs asignadas a los contenedores en la red.

---

## Instrucciones Paso a Paso para Desplegar el Laboratorio

### 1. Construir y Levantar el Entorno
Ejecuta el siguiente comando en la raíz del repositorio (donde está `docker-compose.yml`):
```bash
# Si usas docker:
docker-compose up -d --build

# Si usas podman:
podman-compose up -d --build
```
Esto construirá las imágenes del servidor web, bot y el panel de administración, descargará Redis, y levantará los 4 servicios.

### 2. Uso de la Aplicación
1. **Chat de Usuario:** Abre tu navegador y dirígete a: [http://localhost:3000](http://localhost:3000)
   - Ingresa un nombre de usuario y chatea. Tendrás un chat 1-a-1 privado con el bot.
2. **Panel de Administración:** Dirígete a [http://localhost:4000](http://localhost:4000)
   - Podrás ver una tabla con los usuarios actualmente conectados.
   - Envía un mensaje en la caja superior. Éste aparecerá inmediatamente resaltado en la pantalla de chat de todos los usuarios usando Redis Pub/Sub.

### 3. Verificar los Datos en la Base de Datos Redis como Administrador
Para validar cómo se están grabando los datos en tiempo real (y cumplir con los requerimientos de validación):

1. **Entra a la terminal del contenedor de Redis:**
   ```bash
   podman exec -it chat_redis redis-cli
   ```
   *(Si usas docker, cambia `podman` por `docker`).*

2. **Ver a todos los usuarios que han iniciado sesión (Activos):**
   ```bash
   SMEMBERS active_users
   ```
   *Esto listará los UUID de los usuarios actualmente conectados.*

3. **Ver la información completa de un usuario:**
   Busca las llaves de usuarios creadas:
   ```bash
   KEYS user:*
   ```
   Copia un ID de usuario de esa lista e inspecciona sus 7 datos almacenados (incluye IP, fecha, nombre de usuario):
   ```bash
   HGETALL "user:<PEGA_EL_ID_AQUI>"
   ```

4. **Ver el chat privado de un usuario (Historial de Mensajes):**
   Busca las llaves de las salas de chat:
   ```bash
   KEYS chat:messages:*
   ```
   Lee los últimos mensajes enviados en la sala privada de ese usuario (donde se almacena JSON con remitente, hora, etc):
   ```bash
   LRANGE "chat:messages:<PEGA_EL_ID_AQUI>" 0 -1
   ```
   
Con estos comandos podrás demostrar en tu video que estás consultando la base de datos subyacente y verás los registros reales ingresados a través de las dos aplicaciones web.

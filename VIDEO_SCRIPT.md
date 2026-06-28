# Guion para Presentación en Video del Laboratorio

Este documento contiene el orden sugerido y los comandos a ejecutar durante la grabación del video de sustentación de la Actividad Sumativa, asegurando que muestras todos los componentes, la arquitectura y los comandos de Podman/Docker exigidos.

## 1. Presentación Inicial
- Abre tu cámara/micrófono y preséntate:
  > "Hola, mi nombre es Jhon Edison Hincapié García, código 100097437, estudiante de la Maestría en Arquitectura de Software del Politécnico Grancolombiano. Hoy presentaré mi laboratorio de contenedores basado en microservicios, utilizando Redis y Node.js orquestados con Podman."
- Muestra brevemente la *Landing Page* estática donde está el diagrama de la arquitectura, para dar contexto.

## 2. Mostrando la Instalación y el Entorno
- Abre la terminal (o la interfaz de Podman Desktop).
- Demuestra que tienes la herramienta instalada:
  ```bash
  podman version
  podman info
  ```
- Revisa si tienes contenedores o redes previas:
  ```bash
  podman ps -a
  podman network ls
  podman system df
  ```

## 3. Despliegue de la Arquitectura (Orquestación)
- Explica que usarás `docker-compose.yml` (o `podman-compose`) para desplegar 4 contenedores (Base de datos, Servidor Chat, Bot, y Servidor Admin).
- Navega a la ruta del proyecto en tu terminal y ejecuta:
  ```bash
  # Si usas docker
  docker-compose up -d --build
  
  # Si usas podman
  podman-compose up -d --build
  ```
- Muestra cómo se descargan las imágenes (como Redis) y se construyen las locales.
- Verifica que las imágenes se crearon:
  ```bash
  podman images
  ```
- Verifica que los 4 contenedores están corriendo:
  ```bash
  podman ps
  ```
- Muestra el consumo de recursos de los contenedores en tiempo real (déjalo correr 5 segundos y ciérralo con Ctrl+C):
  ```bash
  podman stats
  ```

## 4. Prueba Funcional (Frontend y Backend)
- Abre el navegador y acomoda dos ventanas (una al lado de la otra).
- **Ventana 1:** Ingresa a `http://localhost:3000`. Pon un nombre de usuario (ej. "Jhon") y envía un mensaje. Observa cómo el "AutoBot 🤖" te responde de forma privada.
- **Ventana 2:** Ingresa a la app de administración en `http://localhost:4000`. 
  - Muestra la tabla de usuarios conectados, que carga dinámicamente desde Redis.
  - Usa la caja de texto para enviar un mensaje Broadcast (ej. "¡Hola a todos!").
- Vuelve a la Ventana 1 y muestra cómo apareció la alerta global en color rojo, validando el sistema Pub/Sub.

## 5. Inspección de Contenedores y Logs
- En la terminal, revisa los logs del servidor para mostrar cómo registra las conexiones:
  ```bash
  podman logs chat_server
  ```
- Sigue los logs del bot en tiempo real:
  ```bash
  podman logs -f chat_bot
  # Presiona Ctrl+C para salir
  ```
- Inspecciona la red virtual creada:
  ```bash
  podman network inspect chat_network
  ```

## 6. Verificación de Persistencia y Estructura en Base de Datos (DDD)
- Explica que para cumplir la rúbrica sobre tipos de datos, los registros se mapean en Redis.
- Entra al contenedor de Redis:
  ```bash
  podman exec -it chat_redis redis-cli
  ```
- Lista todos los usuarios activos:
  ```bash
  SMEMBERS active_users
  ```
- Copia uno de los IDs arrojados en el comando anterior, y revisa sus datos (Muestra los diferentes tipos: string, fecha, bool, float):
  ```bash
  HGETALL user:<ID_COPIADO>
  ```
- Revisa los mensajes guardados de ese usuario:
  ```bash
  LRANGE chat:messages:<ID_COPIADO> 0 -1
  ```
- Sal de Redis:
  ```bash
  exit
  ```

## 7. Limpieza y Cierre
- Explica cómo detener el laboratorio limpiamente:
  ```bash
  docker-compose down
  ```
- (Opcional) Demuestra cómo limpiar imágenes sobrantes:
  ```bash
  podman system prune -f
  ```
- Despídete agradeciendo la atención.

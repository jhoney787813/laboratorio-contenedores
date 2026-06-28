# Guion de Sustentación en Video 🎤

Este documento es el guion oficial que utilizarás para grabar el video de sustentación de la práctica. Sigue este paso a paso para cubrir todos los puntos evaluados por el profesor en la rúbrica, incluyendo los objetivos, justificación de arquitectura y el demo.

---

## 1. Presentación y Objetivo (0:00 - 1:00)

**(Muestra en pantalla la Landing Page del proyecto)**

**Tú (Hablando):**
> "Hola a todos, mi nombre es Jhon Edison Hincapié García, estudiante de la Maestría en Arquitectura de Software del Politécnico Grancolombiano. Hoy presento la sustentación de la Actividad Sumativa, la cual consiste en un laboratorio de contenedores basado en microservicios, desplegado en mi máquina Mac."
> 
> "El objetivo de esta práctica es demostrar la correcta orquestación de servicios contenerizados usando Podman/Docker, logrando que dos aplicaciones independientes (un servidor de chat y un panel de control) se comuniquen asíncronamente con un Bot y compartan estados mediante una base de datos Redis como 'Single Source of Truth', bajo los principios de DDD (Domain-Driven Design)."

---

## 2. Justificación Arquitectónica: Microservicios y DDD (1:00 - 2:00)

**(Muestra el diagrama interactivo de la Landing Page)**

**Tú (Hablando):**
> "Como podemos observar en la arquitectura, la solución se distribuye en 4 contenedores aislados. Cada uno maneja una única responsabilidad. Para cumplir con el desacoplamiento de los estándares actuales, la comunicación entre ellos no es de punto a punto (HTTP clásico), sino asíncrona mediante WebSockets y el sistema Publish/Subscribe de Redis."
> 
> "He adoptado un enfoque **DDD (Domain-Driven Design)**. Esta es la práctica recomendada hoy en día para el diseño de sistemas multi-agentes. Al abstraer nuestro negocio en 'Dominios' y 'Eventos', logramos que la lógica de las interacciones entre los usuarios y el bot esté completamente desvinculada de la infraestructura de almacenamiento. Esta separación de dominios garantiza que la solución pueda escalar a la nube de manera mucho más fluida."

---

## 3. Demostración Práctica (2:00 - 4:00)

**(Abre una ventana de terminal y ejecuta `docker-compose up -d`)**

**Tú (Hablando):**
> "Procedemos a levantar el ecosistema orquestado. Aquí vemos cómo los contenedores se encienden en el orden correcto de dependencias."

**(Abre dos ventanas del navegador lado a lado. Ventana Izquierda: Chat (localhost:3000), Ventana Derecha: Admin (localhost:4000))**

**Tú (Hablando):**
> "A la izquierda tengo mi aplicación de Chat. A la derecha, mi Panel de Administración.
> Voy a iniciar sesión en el chat y enviar un mensaje al Bot. Es importante aclarar que este bot es estático y fue construido con fines estrictamente académicos para validar la conectividad. Por tanto, está limitado a reglas predefinidas. Si yo le digo **'hola'**, o **'docker'**, él me responderá correctamente. 
> 
> En un escenario empresarial moderno de arquitectura multi-agente, la práctica correcta sería conectar la capa de eventos de nuestro DDD hacia modelos de IA avanzados (LLMs) para que interpreten el contexto semántico de forma natural."

**(Muestra cómo funciona el chat 1-a-1)**
**(Ve al panel admin y envía una alerta global)**

**Tú (Hablando):**
> "Como pueden ver a la derecha, el Panel Admin detectó la conexión. Al enviar un mensaje de alerta global desde el admin, vemos cómo la alerta se renderiza inmediatamente en la ventana izquierda del usuario gracias al ecosistema de eventos Pub/Sub de Redis."

---

## 4. Validación de la Base de Datos (4:00 - 5:00)

**(Regresa a la consola / terminal)**

**Tú (Hablando):**
> "Para finalizar y cumplir con las rúbricas de verificación, ingresaré a la consola del contenedor Redis."

**(Ejecuta en consola: `podman exec -it chat_redis redis-cli` o `docker exec -it chat_redis redis-cli`)**

**Tú (Hablando):**
> "Aquí ejecuto el comando `SMEMBERS active_users` para ver los registros del set en memoria. Y al ejecutar `HGETALL` sobre el UUID del usuario, puedo constatar que el contenedor está guardando correctamente las estructuras de datos heterogéneas, persistiendo la información de nuestra arquitectura DDD en tiempo real."
> 
> "Con esto concluye la presentación, muchas gracias."

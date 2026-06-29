<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Logo_Politecnico_Grancolombiano.svg/1200px-Logo_Politecnico_Grancolombiano.svg.png" alt="Politécnico Grancolombiano" width="300">
  <br><br>
  <h1>Maestría en Arquitectura de Software</h1>
  <h2>Consolidado Final: Laboratorio de Contenedores</h2>
  
  <p>
    <strong>Autor:</strong> Jhon Edison Hincapié García<br>
    <strong>Código:</strong> 100097437<br>
    <strong>Institución:</strong> Politécnico Grancolombiano<br>
    <strong>Fecha:</strong> Junio de 2024
  </p>
</div>

<hr>

## 🔗 Enlaces Oficiales de la Entrega

- **Landing Page (Arquitectura, Código y Documentación):** 
  [https://jhoney787813.github.io/laboratorio-contenedores/](https://jhoney787813.github.io/laboratorio-contenedores/)
- **Video de Sustentación (YouTube):** 
  [https://youtu.be/AIi_mLhyJ-Y](https://youtu.be/AIi_mLhyJ-Y)

---

## 🏆 Resumen de Logros de la Entrega

1. **Diseño Guiado por Dominio (DDD):** 
   Se logró abstraer y separar la lógica de negocio de la infraestructura tecnológica, evidenciando un diseño escalable orientado a ecosistemas multi-agentes.
   
2. **Despliegue y Orquestación:** 
   Implementación exitosa de 4 microservicios aislados (Chat Server, Admin App, Chat Bot, Redis) levantados sincronizadamente mediante `docker-compose` (Podman) bajo una única red virtual.

3. **Arquitectura Desacoplada (Pub/Sub):** 
   Se implementó el patrón *Publish/Subscribe* nativo de Redis para asegurar que el panel administrador pueda emitir alertas globales o selectivas sin necesidad de acoplamiento directo HTTP con los clientes web.

4. **Persistencia Avanzada en Memoria:** 
   Demostración práctica del uso de una base de datos NoSQL ultrarrápida como *Single Source of Truth* (SSOT), mapeando más de 15 tipos de datos en la memoria a través de conjuntos (`SET`), diccionarios (`HASH`) y listas (`LIST`), auditable visualmente con RedisInsight.

5. **Comunicación en Tiempo Real:** 
   Configuración óptima de WebSockets (Socket.io) para establecer túneles bidireccionales persistentes, habilitando conversaciones de baja latencia entre los clientes y el agente (Bot) autónomo.

---
<div align="center">
  <p><i>Documento generado automáticamente como comprobante de entrega de la Actividad Sumativa.</i></p>
</div>

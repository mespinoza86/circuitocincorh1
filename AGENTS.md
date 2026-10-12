# Continuidad del proyecto

Estas instrucciones responden a la petición del usuario de conservar la conversación y el contexto del trabajo entre sesiones.

## Antes de trabajar

1. Leer `proyecto.md` completo para conocer el estado, las reglas acordadas, las verificaciones y los pendientes.
2. Leer `conversacion.md` para recuperar las solicitudes del usuario y las respuestas visibles del asistente. Si crece demasiado para una lectura, recorrerlo por partes, conservando el orden; no asumir que solo el último mensaje representa todo el alcance.
3. Consultar `README.md` y los archivos afectados antes de implementar. Verificar el estado real cuando importe: la memoria documentada describe la última comprobación, no garantiza que los procesos o datos sigan iguales.

## Mantener la memoria

- Agregar a `conversacion.md` cada nuevo mensaje del usuario y cada respuesta visible del asistente, incluidas las actualizaciones de progreso y la respuesta final. Mantener el texto original y el orden; no sustituir mensajes antiguos por resúmenes. Si hay anotaciones, conservar su selección y comentario.
- Antes de cerrar cada turno, guardar también la respuesta final que se va a entregar, para que el archivo incluya el cierre de ese turno.
- Actualizar `proyecto.md` durante el trabajo y antes del cierre: decisiones, cambios concretos, archivos afectados, comandos y resultados relevantes, pruebas ejecutadas, límites, pendientes y próximo punto de continuación.
- Mantener un resumen de estado al comienzo y una bitácora acumulativa al final de `proyecto.md`. No borrar el historial para actualizar el resumen.
- Distinguir requisitos confirmados por el usuario, decisiones de implementación y propuestas pendientes. No presentar una propuesta como funcionalidad terminada.
- Registrar errores relevantes y su resolución. Si queda un bloqueo, indicar qué se intentó, qué se conoce y qué falta.
- No inventar mensajes, fechas precisas, resultados de pruebas o estados de la base de datos. Identificar cualquier parte que no esté disponible en el contexto.
- No copiar contraseñas, tokens, cookies, conexiones con contraseña ni contenido de `.env` a estos documentos. Si el usuario comunica una credencial, conservar el resto del mensaje y sustituir el secreto por `[CREDENCIAL OMITIDA]`, dejando constancia de la omisión.
- Escribir Markdown en español y UTF-8, preservando tildes y caracteres.

## Alcance y operación

- El proyecto es local, para una empresa de Costa Rica. No publicar ni desplegar en servicios externos por inferencia.
- La configuración PostgreSQL del proyecto está separada del servicio PostgreSQL existente. No modificar ese servicio ni otras bases.
- Los datos de la empresa están en PostgreSQL; los documentos de memoria no reemplazan respaldos.
- Ante instrucciones nuevas del usuario, actualizar las decisiones y continuar con el alcance autorizado.
- No crear subagentes salvo petición expresa del usuario o instrucciones aplicables que lo requieran.

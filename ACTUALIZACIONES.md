# Desarrollo y actualizaciones sin reemplazar la base de producción

Acuerdo confirmado por el usuario el 2026-10-12: esta computadora es de desarrollo/validación. El servidor nuevo de la LAN tiene la base oficial de la empresa. El traslado inicial ya se realizó según el usuario.

## Qué se actualiza

Se transfieren código, recursos gráficos, dependencias declaradas y nuevas migraciones SQL. Se mantienen en cada equipo su `.env`, directorio `.local/` y respaldos. Los datos ficticios de desarrollo no se transfieren al servidor.

La revisión local confirmó que `.env`, `.local/` y `backups/` están ignorados y no son archivos versionados. En producción hay que conservar esa separación y no forzar su inclusión en Git. [Funcionamiento de gitignore](https://git-scm.com/docs/gitignore).

No sobrescribir la carpeta completa del servidor con una copia del proyecto local, no reemplazar su `.env`, no volver a restaurar un `.dump` de pruebas y no borrar o reinicializar su clúster. Tampoco usar comandos de limpieza que eliminen archivos ignorados.

## Desarrollo y validación

1. Implementar la mejora en el equipo de desarrollo y con su configuración local.
2. Probar las reglas afectadas y el flujo de usuario.
3. Si cambia el esquema, crear una nueva migración numerada en `db/`, por ejemplo `003-nombre-del-cambio.sql`. No editar `001-initial.sql` o `002-employee-codes.sql` para modificar instalaciones ya migradas.
4. Validar la migración con registros ficticios creados antes del cambio: empleados, movimientos, nóminas cerradas y demás datos afectados. Una base vacía por sí sola no comprueba conservación de información.
5. Revisar el alcance de los cambios y las operaciones SQL. Las eliminaciones o conversiones de campos necesitan un tratamiento explícito; agregar campos no implica recrear tablas.
6. Guardar y subir al repositorio únicamente la versión validada, registrando qué commit se entregará al servidor.

## Actualización ordinaria del servidor Windows

Hacerlo en un momento acordado sin operaciones en curso. Detener Node.js con Ctrl+C en su terminal, manteniendo PostgreSQL activo. Si la instalación después utiliza un servicio, se debe detener ese servicio en lugar de asumir una terminal manual.

Desde la carpeta del proyecto del servidor, comprobar primero:

```powershell
git status --short
git rev-parse HEAD
```

Conservar el identificador de la versión anterior. Si hay modificaciones locales inesperadas, revisarlas antes de continuar; no eliminarlas por fuerza.

Ejecutar **uno por uno**, continuando solamente si el paso anterior terminó correctamente:

```powershell
npm.cmd run backup
git pull --ff-only
npm.cmd ci
npm.cmd run db:migrate
npm.cmd start
```

Confirmar que el respaldo informó un archivo guardado y conservar otra copia protegida fuera del disco principal. El `--ff-only` rechaza historias divergentes; no usar una actualización forzada para eludir el error. [Documentación de Git pull](https://git-scm.com/docs/git-pull).

El ejecutor actual de migraciones guarda los nombres aplicados en `schema_migrations` y aplica solamente archivos nuevos dentro de una transacción. Las migraciones iniciales ya aplicadas no se repiten. Además, el arranque de Node.js llama al mismo ejecutor; la aplicación explícita previa sirve para verificar la fase de base antes de arrancar.

Una transacción revierte los cambios SQL si la migración falla, pero no garantiza que una instrucción equivocada que sí termine sea inocua. Por eso es necesario diseñar y probar los cambios antes, y tener respaldo. No prometer que cualquier cambio de estructura conserve todos los datos automáticamente.

Después del inicio, consultar el sistema y revisar los empleados, saldos, movimientos y nóminas afectadas. Confirmar la versión entregada y permitir nuevamente las operaciones del equipo.

Si falla respaldo, Git, instalación o migración, detenerse y conservar el mensaje de error. Revisar compatibilidad de código/esquema antes de volver a una versión anterior. Si ya hubo operaciones después de actualizar, restaurar un respaldo anterior puede eliminar esos registros nuevos; no hacerlo automáticamente.

## Ejemplos

- Colores, botones o presentación: se actualizan archivos de interfaz, sin trasladar datos.
- Agregar un teléfono adicional: una nueva migración agrega el campo con un tratamiento compatible para empleados existentes.
- Modificar una regla de vacaciones: además de conservar filas, revisar el efecto sobre saldos y movimientos históricos. Las colillas cerradas deben conservar sus instantáneas.

Esta guía no ejecuta una actualización real. El servidor no fue inspeccionado ni modificado desde esta computadora. HTTPS, arranque automático y respaldo programado siguen siendo los pendientes ya documentados.

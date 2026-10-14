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

## Entrega de deducciones después de aguinaldo

Octubre 2026 queda como comparación de prueba y noviembre como inicio oficial, habilitado mediante la configuración del servidor. El código de deducciones está en desarrollo, todavía sin commit/push de esta mejora. Lea [DEDUCCIONES.md](DEDUCCIONES.md).

1. Entregar/verificar aguinaldo del commit 2e3acad antes de publicar la segunda versión, cuando sea posible.
2. Guardar y subir la versión validada de deducciones. La nueva migración 004-deductions.sql agrega reglas, control y ajustes y columnas compatibles en nómina; no sustituye tablas ni modifica importes anteriores.
3. En producción, detener Node, conservar PostgreSQL, comprobar Git y respaldar con resultado verificado. Descargar, npm.cmd ci, npm.cmd run db:migrate y arrancar, uno por uno.
4. Comprobar empleados y colillas previas, el menú Aportes y renta y el modo manual de periodos anteriores. La configuración inicia deshabilitada; ingresar porcentajes/tramos reales y habilitarla allí. Los valores guardados en la base de desarrollo no viajan por Git.
5. Comparar octubre sin aplicar. Revisar nóminas oficiales desde noviembre con tasas guardadas. Si ya hay un borrador manual, activarlo expresamente; si el mes tiene una quincena manual cerrada, conservar el mes y no mezclar modos.

Si el servidor descarga ambas mejoras juntas, el ejecutor aplica 003 y después 004 en la misma operación transaccional de migraciones, omitiendo lo ya registrado. No es necesario ejecutar cada SQL manualmente ni restaurar una base de pruebas. Si falla un comando, detenerse y revisar el error; conservar .env/.local y el respaldo.

## Actualización de aguinaldo (commit 2e3acad)

El commit «Agregar aguinaldo e historial salarial mensual» debe subirse primero al remoto con git push desde desarrollo. La instrucción dada al usuario es actualizar el clon existente del servidor Windows, con las operaciones detenidas y PostgreSQL activo, conservando su configuración.

1. Detener Node.js con Ctrl+C; conservar la terminal original si allí se definieron HOST, PORT y APP_ORIGIN.
2. Desde la carpeta del proyecto del servidor, ejecutar git status --short (debe estar limpio), git branch --show-current (main) y git rev-parse HEAD (guardar versión previa). Revisar cualquier cambio inesperado antes de actualizar.
3. Ejecutar npm.cmd run backup y comprobar el mensaje Copia guardada. Conservar una copia protegida del .dump fuera del disco del servidor.
4. Ejecutar git pull --ff-only. Comprobar la versión con git log -1 --oneline y que Test-Path ".\db\003-aguinaldo.sql" devuelva True. La versión esperada es 2e3acad o una posterior que la contenga. Si Git dice que ya está actualizado pero falta la migración, revisar push, rama y repositorio antes de seguir.
5. Ejecutar npm.cmd ci y esperar a que termine sin errores.
6. Ejecutar npm.cmd run db:migrate. El mensaje esperado es Base de datos actualizada. La migración 003-aguinaldo.sql agrega salary_history: no borra, recrea ni cambia empleados o nóminas existentes. Las migraciones ya registradas no se repiten.
7. Volver a iniciar con npm.cmd start, usando la terminal/configuración de red que ya funcionaba. Mantener la ventana abierta.
8. Abrir la dirección habitual del servidor y recargar con Ctrl+F5. Revisar perfiles y nóminas anteriores, la nueva sección Aguinaldo y sus detalles/pendientes antes de reanudar operaciones.

Ejecutar cada paso por separado y detenerse si falla. No usar setup:local, restaurar una base de desarrollo, reemplazar .env/.local o crear las tablas manualmente para esta actualización. No se requiere reinstalar Node.js/PostgreSQL si la instalación existente funciona.

Las nóminas guardadas cuentan cuando están cerradas y su periodo terminó al corte, según la preferencia confirmada. Cargar ingresos anteriores mediante Aguinaldo → Registrar salario histórico: bruto mensual real con referencia, solo en meses que no tengan nómina del empleado. Una quincena faltante de un mes con nómina se completa en Nómina, sin añadir un histórico encima. La tabla se crea vacía: no inventa salarios pasados.

Estas son instrucciones; no se ejecutaron pasos en el servidor ni se comprobó la publicación del commit en el remoto.

Esta guía no ejecuta una actualización real. El servidor no fue inspeccionado ni modificado desde esta computadora. HTTPS, arranque automático y respaldo programado siguen siendo los pendientes ya documentados.

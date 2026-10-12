# Traslado a una computadora servidor de la red local

Guía preparada el 2026-10-11. Se supone que la computadora destino utiliza Windows y que los clientes estarán en la misma red local, según la última indicación del usuario.

El código se descarga de Git. Los datos se trasladan mediante un respaldo PostgreSQL. Solo el servidor ejecuta Node.js y PostgreSQL; los demás equipos acceden mediante su navegador.

## 1. Respaldo final en la computadora actual

Termine las operaciones pendientes y detenga la aplicación con Ctrl+C en la terminal de Node.js. Durante el traslado no registre nuevos datos en la instalación antigua.

Desde la carpeta actual del proyecto:

```powershell
cd "C:\Users\makin\Documents\proyectos_Marco\CircuitoDashboard"
npm.cmd run db:start
npm.cmd run backup
```

Confirme que el comando informó una copia guardada. Conserve el archivo `.dump` más reciente de `backups/` y trasládelo a la nueva computadora mediante un medio protegido. Conserve también una copia de recuperación. El respaldo contiene perfiles, vacaciones, nóminas, cuentas y el consecutivo CC; contiene información privada y no se sube a Git.

## 2. Instalar en el nuevo servidor

Instale:

- [Git para Windows](https://git-scm.com/install/windows).
- [Node.js 24 LTS con npm](https://nodejs.org/en/download).
- [PostgreSQL 18 para Windows](https://www.postgresql.org/download/windows/), incluyendo las herramientas de línea de comandos.

Esta guía usa la ruta de binarios `C:/Program Files/PostgreSQL/18/bin`. Si instala en otra ruta, defina `PG_BIN` con esa ubicación antes de ejecutar `setup:local`.

La contraseña que solicita el instalador PostgreSQL pertenece a su instalación general. El script del proyecto crea un clúster y un rol propios con una nueva contraseña; no confunda ambas.

Abra una nueva ventana de PowerShell después de instalar y compruebe:

```powershell
git --version
node --version
npm.cmd --version
```

## 3. Descargar el repositorio y crear la base vacía

En una carpeta donde tenga permisos de escritura, ejecute lo siguiente, sustituyendo la URL por la de su repositorio:

```powershell
git clone "URL_DE_TU_REPOSITORIO" CircuitoDashboard
cd CircuitoDashboard
npm.cmd ci
npm.cmd run setup:local
```

Complete la autenticación del proveedor Git si el repositorio es privado. Si ya había clonado el proyecto, entre en su carpeta en vez de volver a clonarlo encima.

`setup:local` crea `.local/postgres`, el rol `circuito_app`, una base **vacía** `circuito_rrhh` en `127.0.0.1:55432` y un `.env` nuevo con su contraseña. No modifique esa conexión para apuntar a la computadora anterior ni copie el `.env` antiguo encima.

**Todavía no ejecute `npm.cmd start`, `Iniciar.cmd` ni `npm.cmd run db:migrate`: la restauración debe hacerse primero en la base vacía.** Esos pasos crean las tablas y provocarían conflictos con una restauración completa.

## 4. Restaurar los datos

Cree la carpeta `backups` dentro del proyecto destino, copie allí el respaldo y renombre la copia como `traslado.dump`. Para crear la carpeta puede usar:

```powershell
New-Item -ItemType Directory -Path .\backups -Force
```

Desde la carpeta del proyecto, ejecute este comando en una sola línea:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\pg_restore.exe" --host=127.0.0.1 --port=55432 --username=circuito_app --dbname=circuito_rrhh --no-owner --no-privileges --single-transaction --password ".\backups\traslado.dump"
```

Cuando pida contraseña, use la del **`.env` nuevo**: en `DATABASE_URL` está entre `circuito_app:` y `@`. No es la contraseña de inicio de sesión de la aplicación ni la del instalador. Introduzca el valor en el aviso del programa, no como argumento de un comando.

`--single-transaction` hace que la restauración termine completamente o se revierta si falla. `--no-owner` y `--no-privileges` permiten que los objetos restaurados pertenezcan al rol de este nuevo servidor. [Documentación de pg_restore](https://www.postgresql.org/docs/18/app-pgrestore.html).

La guía presupone una base nueva vacía. Si ya hay tablas o registros en el destino, no fuerce una restauración encima ni utilice `--clean` para eliminarlos sin revisar el caso.

Si el comando terminó sin errores, aplique las migraciones del código descargado:

```powershell
npm.cmd run db:migrate
```

Las cuentas restauradas conservan sus contraseñas de la aplicación. No cree otro primer administrador si ya se restauraron las cuentas existentes. La configuración SMTP, si se había usado, se traslada por separado sin reemplazar `DATABASE_URL` del nuevo servidor.

## 5. Preparar la dirección de red

En el servidor ejecute:

```powershell
ipconfig
```

Identifique la IPv4 del adaptador conectado a la red de la empresa. **192.168.1.50 es solo el ejemplo de esta guía; sustitúyalo por la IP real del servidor.** Conviene reservar esa IP en el router para que los clientes no pierdan su dirección después de un reinicio.

Edite estas variables en el `.env` nuevo, dejando `DATABASE_URL` y `PG_BIN` como los creó el instalador:

```dotenv
HOST=0.0.0.0
PORT=3001
APP_ORIGIN=http://192.168.1.50:3001
COOKIE_SECURE=false
TRUST_PROXY=false
```

Es la configuración inicial para probar por HTTP dentro de la LAN. Ambos clientes y el propio servidor deben acceder por la misma dirección configurada en `APP_ORIGIN`, no por `127.0.0.1`, para que las operaciones pasen el control de origen.

Para el uso diario con contraseñas y nómina, preparar HTTPS con un proxy inverso, `APP_ORIGIN` con la URL HTTPS y `COOKIE_SECURE=true`. `TRUST_PROXY=true` solo corresponde si hay exactamente un proxy confiable. La configuración TLS no se ha implementado en esta guía inicial ni durante esta consulta. [Recomendaciones de Express sobre TLS](https://expressjs.com/en/advanced/best-practice-security/).

Abra una terminal nueva al iniciar después de editar `.env`, para evitar que variables PORT/APP_ORIGIN de una sesión anterior sobrescriban el archivo.

## 6. Permitir la aplicación en el firewall

En el **servidor**, abra otra ventana de PowerShell **como administrador** y ejecute:

```powershell
New-NetFirewallRule -DisplayName "Circuito RRHH LAN" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow -Profile Private,Domain -RemoteAddress LocalSubnet
```

La conexión de la empresa debe estar clasificada como red privada o de dominio para esta regla. La regla permite solo el puerto de la aplicación desde la subred local; no desactive el firewall completo. No necesita abrir el puerto PostgreSQL 55432: el servidor Node.js consulta la base internamente. [Referencia de Microsoft](https://learn.microsoft.com/en-us/powershell/module/netsecurity/new-netfirewallrule).

## 7. Iniciar y verificar

En una terminal normal, desde la carpeta del proyecto:

```powershell
npm.cmd run db:start
npm.cmd start
```

Mantenga abierta la ventana y evite que el equipo entre en suspensión mientras se usa el sistema. El arranque de esta instalación del proyecto es manual; no se configuró como servicio de Windows.

Abra desde el servidor y los clientes la URL correspondiente a la IP real, por ejemplo:

```text
http://192.168.1.50:3001
```

Verifique el acceso con una cuenta existente y revise empleados, saldos de vacaciones y nóminas históricas antes de reanudar el registro diario. Cada administrador debe usar su cuenta individual.

Los demás equipos solo necesitan un navegador y acceso a la misma LAN. No necesitan Git, Node.js, PostgreSQL ni otra copia de la base de datos.

## 8. Operación después del traslado

- Utilizar exclusivamente la instalación nueva para registrar cambios, evitando que dos copias independientes diverjan.
- Conservar el respaldo y la instalación antigua durante la comprobación; no se propone borrar la base anterior.
- Generar los próximos respaldos desde el nuevo servidor con `npm.cmd run backup` y mantener otra copia en almacenamiento separado y protegido.
- Configurar arranque automático de aplicación/clúster, HTTPS y respaldo programado antes de tratarlo como servidor definitivo de uso diario.
- Para actualizar el código, detener Node.js, obtener los cambios mediante `git pull`, ejecutar `npm.cmd ci` si cambiaron dependencias y volver a arrancar. Las migraciones se aplican al iniciar; respaldar antes de actualizaciones que modifiquen datos.

Esta guía describe lo que el usuario debe ejecutar en el destino. No se accedió a esa computadora, no se movieron datos reales y no se cambiaron puertos o firewall del equipo actual.

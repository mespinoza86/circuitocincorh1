# Circuito Cinco · Recursos humanos

Aplicación local en HTML, CSS y JavaScript, con servidor Node.js y persistencia en PostgreSQL. Interfaz en español para una empresa de Costa Rica: empleados, vacaciones, feriados, nómina quincenal, colillas PDF, correo y cuentas de administrador.

La identidad visual corresponde a [Circuito Cinco](https://www.circuitocinco.com/): logo gris y rojo, navegación blanca, tonos neutros y tipografía Montserrat. El logo y las fuentes se sirven desde `public/assets/`, sin conexiones externas necesarias para mostrarlos. La licencia de Montserrat está en `public/assets/fonts/OFL.txt`. Las colillas PDF incorporan el mismo logo y la paleta corporativa.

## Memoria y continuidad

La conversación se conserva en [conversacion.md](conversacion.md). El estado técnico, los acuerdos, cambios, verificaciones y pendientes están en [proyecto.md](proyecto.md). Las instrucciones para leerlos y mantenerlos entre sesiones están en [AGENTS.md](AGENTS.md).

## Abrir en esta computadora

La instalación inicial ya está preparada. Abra **Iniciar.cmd** dentro de esta carpeta y mantenga esa ventana abierta. Después visite:

**http://127.0.0.1:3000**

La primera pantalla permite crear la empresa y su primera cuenta de administrador. No se incluyen usuarios predeterminados ni trabajadores ficticios en la base de la empresa. Las capturas en `test-results/` utilizan datos de pruebas en bases separadas que se eliminan al terminar.

También puede iniciar desde PowerShell, en la carpeta del proyecto:

```powershell
npm run db:start
npm start
```

Para detener la aplicación, presione Ctrl+C en la ventana del servidor. Los datos se conservan. Puede detener el PostgreSQL exclusivo del proyecto con `npm run db:stop`.

Si el puerto 3000 está ocupado por otra aplicación, puede usar 3001 desde PowerShell:

```powershell
cd "C:\Users\makin\Documents\proyectos_Marco\CircuitoDashboard"
$env:HOST = "127.0.0.1"
$env:PORT = "3001"
$env:APP_ORIGIN = "http://127.0.0.1:3001"
npm run db:start
npm start
```

En ese caso, abra **http://127.0.0.1:3001**. Las variables afectan esa ventana de PowerShell y no modifican `.env`. Mantenga abierta la ventana mientras usa la aplicación.

## Instalar en otra computadora

Requisitos: Node.js 22 o posterior y PostgreSQL instalado. Para el instalador local de Windows, el directorio predeterminado de los ejecutables es `C:/Program Files/PostgreSQL/18/bin`; puede definir `PG_BIN` si es diferente.

```powershell
npm ci
npm run setup:local
npm run db:migrate
npm start
```

`setup:local` crea un clúster exclusivo en `.local/postgres`, limitado a `127.0.0.1:55432`, y una base `circuito_rrhh`. Genera una contraseña aleatoria y guarda la conexión en `.env`. No modifica el servicio PostgreSQL existente ni utiliza su contraseña. El rol de la aplicación no es superusuario; la instalación de desarrollo le permite crear bases para las pruebas.

Si utiliza un servidor PostgreSQL existente, copie `.env.example` a `.env`, configure `DATABASE_URL` con una base dedicada que pertenezca al rol de la aplicación y ejecute `npm run db:migrate`. No ejecute `setup:local` en ese caso.

Mantenga `.env`, `.local/` y las copias de seguridad fuera de Git y del directorio público. Los únicos archivos servidos al navegador están en `public/`.

## Primeros pasos

1. Cree el primer administrador desde la propia computadora del servidor.
2. Revise el nombre, cédula jurídica y correo de la empresa en Configuración.
3. Agregue los trabajadores: código, nombre, cédula, correo, ingreso, nacimiento y salario mensual.
4. Para cada trabajador, ingrese el total de días históricos utilizados, su fecha de corte y una referencia. Ese total incluye todos los días disfrutados hasta el corte inclusive.
5. Agregue los feriados de los años que utilizará antes de registrar vacaciones.
6. Prepare una quincena y revise los importes de cada trabajador antes de cerrarla.

Al abrir **Nuevo empleado**, el código interno se sugiere como `CC0001`, `CC0002` y así sucesivamente. Puede editarlo antes de guardar. La serie toma en cuenta códigos CC anteriores, incluso de empleados inactivos, y conserva el avance aunque después se cambie un código.

Consultar o cancelar el formulario no consume un número. Si dos administradores conservan la misma sugerencia, al guardar se asignan consecutivos distintos. Los códigos manuales CC de número mayor avanzan la serie; los de otros formatos no la avanzan. No se admite repetir un código ya utilizado por otro perfil. Los códigos existentes no se renumeran.

## Reglas de vacaciones

- 14 días por cada 12 meses completos desde el ingreso. No se acumula por días parciales del mes.
- Los aniversarios mensuales parten del día original de ingreso. Para ingresos el 29, 30 o 31, se usa el último día de un mes más corto y se recupera el día original en meses que lo tengan.
- Se aplica `meses completos × 14 ÷ 12` al total; la tasa mensual nunca se redondea. La pantalla muestra hasta dos decimales.
- No hay vencimiento ni límite de acumulación. La salida del trabajador detiene la acumulación en su fecha de salida.
- Ambos extremos de un rango de vacaciones están incluidos. Se excluyen sábados, domingos y feriados registrados con fecha exacta.
- Medio día requiere una sola fecha laboral. Se pueden registrar dos mitades en una fecha; no se puede superar un día por fecha.
- **Saldo actual:** acumulado menos histórico y días registrados hasta la fecha consultada.
- **Reservado:** días aprobados posteriores a la fecha consultada.
- **Disponible:** saldo actual menos reservado. No incluye acumulación futura estimada.
- Se permiten saldos negativos con confirmación expresa; se destacan en rojo y aparecen en el resumen.
- Los movimientos nuevos deben empezar después del corte histórico para evitar descuentos duplicados.
- Una cancelación conserva el movimiento, administrador, fecha y motivo, y devuelve los días.
- Un feriado que toca un movimiento aprobado no puede agregarse o eliminarse directamente. Primero se cancela ese movimiento y luego se registra con el calendario corregido. Esto conserva el conteo aprobado y su historial.

Los reportes muestran las fechas registradas durante el año y hasta la fecha seleccionada. El ajuste histórico no permite reconstruir fechas anteriores al corte. Los reportes recalculan con los datos actuales y movimientos vigentes; el historial registra las correcciones, pero no se ofrece todavía un reporte de cómo se veía la base antes de cada corrección.

## Nómina y colillas

- Salario base mensual guardado en el perfil. Primera quincena: 1–15; segunda: 16–último día del mes.
- Se utiliza el salario mensual actual del perfil al crear y revisar borradores; no se seleccionan salarios históricos automáticamente por fecha. Las colillas cerradas sí conservan su salario original.
- Cada quincena completa recibe la mitad del salario mensual. Si el salario contiene un céntimo impar, la primera recibe ese céntimo y la segunda la diferencia, de modo que ambas sumen exactamente el salario mensual.
- Comisiones, Caja, renta, préstamo y otras deducciones se escriben por quincena. Cada borrador inicia esos campos en cero y requiere revisión explícita.
- No se calculan tasas legales, ni se controla el capital de un préstamo en esta versión.
- Si hay ingreso o salida durante el periodo, el administrador escribe el importe salarial correspondiente y un motivo. Puede conservar la mitad normal dejando un motivo que explique su revisión.
- Las otras deducciones también requieren descripción. Se evita guardar un salario neto negativo.
- **Neto = salario quincenal revisado + comisiones − Caja − renta − préstamos − otras deducciones.**
- Se puede actualizar la plantilla de un borrador si se incorporan empleados o se corrigen fechas de relación laboral. Se conservan los importes de quienes permanecen en el periodo.
- Un cierre requiere que todos los trabajadores estén revisados y que sus perfiles no hayan cambiado desde su última revisión.
- Las nóminas cerradas conservan los datos del empleado, su correo, la empresa y los importes del periodo. No se reabren ni modifican en esta versión; los procedimientos de anulación y nómina correctiva quedan para una etapa posterior.
- Las colillas pueden consultarse en PDF desde un borrador, marcado como tal. El envío por correo requiere una nómina cerrada.
- Puede guardar el PDF desde el visor del navegador. El PDF utiliza la etiqueta CRC para la moneda.
- Puede exportar CSV de nómina y vacaciones; las celdas que podrían interpretarse como fórmulas se neutralizan.

## Cuentas

Cada administrador usa su propio correo de acceso y contraseña de al menos 12 caracteres. Las contraseñas se almacenan con scrypt y sal aleatoria. Las sesiones duran ocho horas, se guardan en PostgreSQL y usan cookies HttpOnly/SameSite y protección CSRF. El ingreso tiene límite de intentos.

Un administrador puede crear otras cuentas, desactivarlas y restablecer sus contraseñas. Las cuentas nuevas o restablecidas deben cambiar su contraseña temporal. Desactivar o restablecer una cuenta revoca sus sesiones. El administrador no puede desactivar su propia cuenta; para su contraseña usa «Mi contraseña».

Perfil y cuenta de acceso son entidades separadas. La estructura prevé cuentas vinculadas a empleados, pero su alta y portal no están habilitados todavía. Los endpoints de personal, nómina y PDF verifican el rol en el servidor y rechazan las cuentas de empleado.

El historial registra las modificaciones junto a la cuenta responsable. La interfaz muestra los últimos 100 eventos; los anteriores permanecen en PostgreSQL. No se eliminan perfiles de empleados: se registra su salida y se desactivan.

## Configurar el correo

El remitente confirmado es **contabilidad@circuitocinco.com**, mediante **Google Workspace**. Siga [CORREO_COLILLAS.md](CORREO_COLILLAS.md) para preparar la cuenta, actualizar el servidor y configurar solamente las variables SMTP de su `.env` existente:

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contabilidad@circuitocinco.com
SMTP_PASS=REEMPLAZAR_POR_CONTRASENA_DE_APLICACION
SMTP_FROM="Contabilidad Circuito Cinco <contabilidad@circuitocinco.com>"
```

Use una contraseña de aplicación si la cuenta y las políticas de Workspace lo permiten; requiere verificación en dos pasos. No use la contraseña normal de Gmail. [Ayuda de Google](https://support.google.com/accounts/answer/185833?hl=es). No comparta credenciales por chat ni Git.

Reinicie el servidor y recargue el navegador. En Nómina, **Enviar correo** permanece visible junto al **PDF** y abre la revisión del remitente, destinatario y adjunto. El envío exige una nómina cerrada y SMTP configurado. Se utiliza el **correo actual del perfil del empleado**, aunque haya cambiado después del cierre; el PDF conserva su instantánea original. El servidor rechaza un destinatario que haya cambiado después de abrir la confirmación.

Los envíos quedan registrados como en curso, aceptados por SMTP o fallidos. La aceptación del servidor no garantiza la llegada a la bandeja del trabajador. Un reenvío después de un envío aceptado requiere confirmación. No se envía automáticamente al cerrar una nómina.

Las pruebas de correo emplean un servidor SMTP simulado en esta computadora. No se han enviado correos a trabajadores ni a servicios externos.

## Copias de seguridad

```powershell
npm run backup
```

Crea un archivo PostgreSQL en `backups/`. Guarde una copia adicional en otra ubicación protegida y defina una frecuencia antes de cargar información real. El respaldo incluye los perfiles, nóminas y hashes de contraseñas; trátelo como información de la empresa. `.env` se respalda por separado en una ubicación protegida.

Para restaurar, cree una **base nueva y vacía** con PostgreSQL y ejecute `pg_restore --no-owner --no-privileges --exit-on-error --dbname=NUEVA_BASE RUTA_DEL_RESPALDO`, usando el usuario y conexión correspondientes. Después apunte `DATABASE_URL` a esa base y ejecute las migraciones. No restaure encima de la base activa. La prueba `npm run test:backup` verifica la recuperación en una base temporal.

## Traslado a una red o servidor

El usuario confirmó que el traslado ya se completó y que el servidor tiene la base oficial. Para mejoras posteriores, siga [ACTUALIZACIONES.md](ACTUALIZACIONES.md): desarrollar y probar en el equipo local, actualizar código y nuevas migraciones, conservando la base y configuración del servidor. La guía de traslado siguiente corresponde a la instalación inicial, no a cada actualización.

Para trasladar los datos existentes a **otra computadora Windows que será servidor de la LAN**, siga [TRASLADO_SERVIDOR.md](TRASLADO_SERVIDOR.md). Incluye requisitos, clonación del repositorio, restauración antes de crear tablas, configuración de origen y firewall, y acceso desde los navegadores de los clientes. La restauración utiliza una base nueva vacía; no copie el `.env` antiguo encima del generado en el destino.

La interfaz y el API se sirven desde un mismo origen. Para una red, configure `HOST`, `PORT` y `APP_ORIGIN` con la dirección real del servidor. Para acceso desde otros dispositivos, use HTTPS, `COOKIE_SECURE=true` y un proxy inverso; `TRUST_PROXY=true` presupone exactamente un proxy confiable delante del proceso. Mantenga PostgreSQL restringido al servidor de la aplicación. Utilice un rol de base de datos sin permiso CREATEDB en producción, aparte de un rol para migraciones.

Traslade una copia de seguridad, aplique las migraciones y configure un servicio de arranque para Node.js/PostgreSQL. No publique `.env`, `.local/` ni `backups/`. El proyecto no se ha publicado en Internet y no necesita Sites hosting para funcionar.

## Verificación

```powershell
npm test
npm run test:integration
npm run test:browser
npm run test:backup
npm audit --omit=dev
```

Las pruebas de integración, navegador y restauración exigen la instalación local aislada en 127.0.0.1:55432. Crean bases temporales `circuito_test_*` y las eliminan al finalizar, sin modificar la base de la empresa. Las pruebas del navegador usan un Chromium instalado por Playwright o Microsoft Edge; puede configurar `BROWSER_PATH`.

## Guardar el proyecto en GitHub

Para un repositorio nuevo, cree uno privado en GitHub sin inicializar README, licencia o gitignore. Desde la carpeta del proyecto ejecute `git init -b main`, configure el nombre y correo de autor para este repositorio y use `git add .`. Revise `git status` antes del primer commit. Después agregue como origin la URL del repositorio vacío y ejecute `git push -u origin main`, autenticándose con su cuenta.

`.gitignore` excluye el clúster y sus datos (`.local/`), `.env`, respaldos, dependencias, artefactos de prueba y logs. Se pueden guardar el código, `.env.example`, migraciones, pruebas y documentos de continuidad. Versionar el proyecto no reemplaza el respaldo de PostgreSQL. Consulte la [guía oficial para subir código local a GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).

## Organización del código

| Carpeta | Contenido |
| --- | --- |
| `public/` | HTML, estilos e interfaz JavaScript sin compilación |
| `server/domain.js` | Fechas, acumulación, conteo laboral y montos |
| `server/app.js` | API, validaciones, permisos y operaciones transaccionales |
| `server/auth.js` | Cuentas, contraseñas y sesiones |
| `server/pdf.js` | Colillas PDF |
| `db/` | Migraciones versionadas |
| `scripts/` | Instalación local, migraciones y respaldo |
| `tests/` | Cálculos, PostgreSQL, navegador y restauración |

Documentación técnica de referencia: [transacciones de node-postgres](https://node-postgres.com/features/transactions), [seguridad de Express](https://expressjs.com/en/advanced/best-practice-security/) y [SMTP de Nodemailer](https://nodemailer.com/smtp).

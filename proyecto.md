# Circuito: memoria del proyecto

Última actualización: 2026-10-11, America/Costa_Rica.

## 1. Estado para retomar

La primera versión funcional de la aplicación de recursos humanos ya está implementada y verificada. Se ejecuta localmente con HTML/CSS/JavaScript, Node.js y PostgreSQL. No está publicada en Internet.

La consulta más reciente del usuario es cómo registrar medio día de vacaciones. Se revisaron el formulario y la validación existentes: Vacaciones → Registrar vacaciones, seleccionar trabajador, Duración = Medio día, misma fecha de inicio y fin, calcular y aprobar 0,5 días. Mañana/tarde se puede indicar en Observación; no hay un selector estructurado de horario. No se cambió la funcionalidad ni se registró ninguna vacación por cuenta del usuario.

Antes de retomar Git, el usuario confirmó que la empresa es Circuito Cinco y solicitó adaptar el estilo al sitio https://www.circuitocinco.com/ y usar el logo adjunto. El cambio está terminado: logo oficial equivalente en mayor resolución, tipografía Montserrat local, blanco/gris/rojo en la interfaz y colillas PDF. El navegador de escritorio y móvil y las 17 entradas de integración pasaron. Se indicó reiniciar npm start en la misma terminal y recargar con Ctrl+F5 para cargar también el nuevo generador de PDF.

La mejora funcional más reciente es la sugerencia de códigos internos `CC0001`, `CC0002`, etc., editables por el administrador. Está implementada y probada y su migración ya está aplicada. Se había indicado reiniciar npm start y recargar el navegador para activar el nuevo servidor; no se volvió a verificar ese reinicio durante la consulta sobre Git.

La instrucción permanente del usuario es conservar **toda la conversación** en `conversacion.md` y mantener **todo el contexto de trabajo** en este archivo. `AGENTS.md` indica leer ambos y actualizarlos durante cada tarea. La primera mejora funcional posterior a la entrega es la sugerencia de códigos internos, documentada abajo.

Última comprobación de datos, al terminar la implementación: **0 cuentas, 0 empleados y 0 periodos de pago** en la base de la empresa. Se dejó lista la pantalla de creación del primer administrador. Ese dato es histórico: si el usuario ya abrió la aplicación y cargó registros, verificar el estado actual sin sobrescribirlos.

Último estado de procesos al terminar la implementación: el servidor Node.js de prueba se detuvo y se ejecutó `npm run db:stop` con éxito para el clúster del proyecto. No se detuvo ni modificó el servicio PostgreSQL preexistente. Los procesos pueden haber cambiado desde entonces.

Comprobación posterior, al preguntar por la persistencia: el clúster del proyecto está activo en 55432 y el usuario informa que usa la aplicación. No se consultaron registros de trabajadores, cuentas ni nóminas; los conteos cero de la entrega anterior no deben asumirse como estado actual.

## 2. Archivos de continuidad

| Archivo | Propósito |
| --- | --- |
| `conversacion.md` | Historial de mensajes del usuario y respuestas visibles del asistente, con actualizaciones de progreso. |
| `proyecto.md` | Estado actual, acuerdos, arquitectura, cambios, comprobaciones, limitaciones y trabajo posterior. |
| `AGENTS.md` | Instrucciones para leer y mantener los dos archivos de memoria en próximas sesiones. |
| `README.md` | Manual de instalación, uso, reglas, correo, copias de seguridad y traslado a servidor. |

Los mensajes históricos no se deben reescribir para reflejar decisiones posteriores. Si una decisión cambia, documentar la sustitución aquí y agregar el nuevo mensaje a la conversación.

Estos documentos no contienen credenciales. No registrar valores de `.env`, contraseñas, sesiones o tokens. Si se recibe un secreto en una conversación futura, omitir únicamente ese valor y marcar la omisión.

## 3. Contexto y objetivo

- Usuario: se comunica en español; quiere colaborar de forma continua y preservar el contexto si se cierra la sesión.
- Carpeta: `C:\Users\makin\Documents\proyectos_Marco\CircuitoDashboard`.
- Entorno: Windows y PowerShell. Node.js observado: v24.18.0; npm: 11.16.0.
- PostgreSQL instalado en `C:/Program Files/PostgreSQL/18/bin`; versión observada en el arranque del clúster: 18.4.
- La carpeta estaba vacía al comenzar. La revisión durante la consulta sobre Git confirmó que todavía no hay `.git` ni repositorio en esta carpeta. Git instalado: 2.55.0.windows.3. Verificar nuevamente antes de ejecutar los pasos, pues el usuario puede haberlos realizado después.
- País: Costa Rica. Moneda: colón costarricense, código CRC. Fechas de negocio: America/Costa_Rica.
- Una sola empresa, aproximadamente 15 trabajadores.
- Empresa confirmada: **Circuito Cinco**, sitio https://www.circuitocinco.com/. La aplicación se muestra como “Circuito Cinco · Recursos humanos”. El nombre interno del paquete y carpeta sigue siendo Circuito; no se cambiaron los datos de empresa que el usuario ya hubiera guardado.
- El usuario retomó las instrucciones para Git/GitHub después de haberlo postergado. Todavía no se conoce un repositorio remoto ni se han ejecutado init, commit o push. Verificar el estado antes de continuar; no publicar datos ni elegir una cuenta remota por inferencia.
- Funcionamiento local primero; traslado futuro a una red o servidor. No se autorizó publicar información de personal en servicios externos.

## 4. Requisitos confirmados por el usuario

### 4.1 Tecnología

Interfaz HTML y JavaScript; servidor Node.js, aceptado expresamente; base PostgreSQL, confirmada tras aclarar la referencia inicial a “SQL progress”.

### 4.2 Empleados

- Perfil con nombre, cédula, fecha de ingreso, fecha de nacimiento y correo electrónico.
- Posibilidad de agregar más datos. La primera versión agrega código interno, puesto, departamento, teléfono, observaciones, salario mensual, estado y fecha de salida.
- Los administradores crean y administran los perfiles.
- Código interno sugerido automáticamente: `CC0001`, `CC0002`, etc. El administrador puede cambiarlo antes de guardar. Petición posterior a la primera entrega.
- Inicialmente solo administradores acceden a la aplicación.
- Posteriormente cada empleado podrá tener cuenta y consultar únicamente lo suyo. No debe ver información de otros empleados. Los administradores sí pueden gestionar a todo el equipo.

### 4.3 Vacaciones

- Todos trabajan de lunes a viernes por ahora.
- 14 días al año: acumulación por **mes completo** desde la fecha de ingreso.
- Tasa conceptual de 14/12 = 1,166666… días por mes. Calcular sobre los meses totales, sin redondear la tasa al acumular.
- Arranque con **días históricos a restar**, no con ingreso de un saldo inicial disponible.
- Descontar solo días laborales: excluir sábados, domingos y los feriados que se registren en la empresa.
- Permitir medios días.
- Permitir adelantos y saldos negativos, con alarma y visualización clara del saldo negativo.
- Sin vencimiento ni límite de acumulación.
- Reportar saldos disponibles y las fechas/días disfrutados durante el año.

### 4.4 Nómina

- Salario base ingresado **mensualmente** en el perfil del trabajador.
- Pago **quincenal**; dividir automáticamente el salario mensual entre dos para una quincena completa.
- Caja, renta y comisiones se ingresan **por quincena**.
- Caja y renta son montos **manuales**; automatización para después.
- Préstamos: por ahora solo registrar la deducción de cada quincena, sin control de capital o amortización.
- Otros rebajos también deben poder registrarse.
- Neto: salario base de la quincena más comisiones menos todas las deducciones.
- Generar colilla de pago y habilitar su envío al correo del trabajador.
- Ante ingreso o salida durante la quincena, permitir importe salarial **manual con motivo**, conservando el salario mensual del perfil. El usuario aceptó expresamente esta sugerencia al autorizar el inicio.

### 4.5 Memoria de trabajo

Guardar todos los mensajes y respuestas en `conversacion.md`. Guardar todo lo realizado, lo que cambia, lo que se deja para después y el contexto suficiente para retomar en `proyecto.md`. Mantenerlos actualizados; no limitarse a un resumen de esta sesión.

## 5. Decisiones de implementación de la primera versión

Esta sección distingue reglas concretas elegidas durante el desarrollo de las peticiones expresas anteriores. Ya están implementadas; pueden revisarse con el usuario si lo solicita.

### 5.1 Fechas y saldos

- Las fechas civiles se guardan como DATE y se conservan como cadenas YYYY-MM-DD; el servidor no convierte esos campos al huso horario del sistema.
- La fecha “hoy” se obtiene en America/Costa_Rica. No existe un trabajo que sume filas cada mes: el saldo se recalcula desde el ingreso y los movimientos cuando se consulta, evitando acumulación duplicada.
- Los meses completos se cumplen en el día original del ingreso. Para el 29, 30 o 31, el aniversario en un mes corto es su último día; al volver a un mes más largo se recupera el día original.
- La salida detiene la acumulación en la fecha de terminación.
- Cada ajuste histórico guarda días, **fecha de corte inclusiva** y motivo. Los movimientos nuevos deben empezar después del corte.
- Se bloquean cambios de ingreso o corte que se superpongan con vacaciones aprobadas.
- No se puede dar salida a un empleado que tenga vacaciones aprobadas posteriores a su salida: primero deben cancelarse esos movimientos.
- Ambos extremos del rango solicitado se incluyen en el conteo.
- Medio día requiere una fecha única; se pueden aprobar dos mitades en esa fecha, pero no más de un día en total.
- `acumulado = meses completos × 14 / 12`.
- `saldo actual = acumulado − histórico − días registrados utilizados hasta hoy`.
- `reservado = días aprobados posteriores a hoy`.
- `disponible = saldo actual − reservado`. No cuenta acumulación futura estimada para aprobar hoy.
- Estados almacenados de vacaciones: `approved` y `cancelled`. La interfaz distingue programadas, en curso y disfrutadas según fechas. No hay todavía solicitud pendiente enviada por empleados ni circuito separado de aprobación.
- Cancelar registra motivo y devuelve los días, conservando el movimiento.
- El conteo aprobado se guarda con el detalle de fechas. No se permite agregar o eliminar un feriado que toque vacaciones aprobadas; se deben cancelar y volver a registrar con el calendario corregido.
- No se precargaron feriados legales ni tasas: los feriados son las fechas que administra la empresa.

### 5.2 Dinero y nómina

- Todos los importes se calculan en céntimos enteros y se guardan como bigint.
- Primera quincena: 1–15. Segunda: 16–fin de mes, contemplando años bisiestos.
- Un céntimo impar del salario mensual se asigna a la primera quincena. La segunda recibe la mitad redondeada hacia abajo, para que ambas sumen el mes exacto.
- Los borradores arrancan comisiones y deducciones en cero. Se requiere revisar y guardar cada trabajador explícitamente antes del cierre.
- El borrador se arma con quienes tuvieron relación laboral durante el rango; no depende solo del estado activo actual.
- Si hubo ingreso o salida dentro de la quincena, se exige motivo del salario revisado, aunque el administrador conserve la mitad normal.
- Si se cambia el importe automático, se exige motivo. Otras deducciones requieren descripción.
- Se bloquea guardar una nómina con deducciones superiores al ingreso; el neto salarial no puede ser negativo en esta versión.
- Los borradores permiten actualizar la plantilla cuando cambian los empleados o fechas, conservando las filas de quienes siguen incluidos.
- El cierre verifica revisiones y que no hayan cambiado salario o datos del perfil desde la revisión.
- Las nóminas cerradas guardan instantáneas de empresa y trabajador, correo incluido. Cambios posteriores del perfil no alteran la colilla cerrada.
- Una nómina cerrada no se edita ni se reabre en esta versión. Correcciones o anulaciones formales quedan para después.
- El salario vigente del perfil se usa al crear o revisar un borrador, incluso si el periodo es antiguo; no hay todavía vigencia histórica de salarios por fecha.
- Las colillas de borrador se identifican como borrador. El envío requiere nómina cerrada y destinatario coincidente con el correo guardado en su instantánea.
- La interfaz muestra ₡; los PDF usan CRC por compatibilidad con la fuente incluida.
- Los CSV neutralizan celdas que puedan interpretarse como fórmulas.

### 5.3 Cuentas y permisos

- Perfil y cuenta de acceso son entidades separadas.
- Primer administrador creado desde la computadora del servidor; no hay cuenta ni contraseña por defecto ni registro público.
- Cada administrador tiene cuenta individual, con correo único, para atribuir los movimientos.
- Contraseñas de 12–128 caracteres con scrypt y sal aleatoria; no se almacenan en texto plano.
- Sesiones PostgreSQL de ocho horas. Cookie HttpOnly/SameSite, token CSRF y control de origen de solicitudes.
- El ingreso y la configuración inicial tienen límite de intentos.
- Cuentas creadas por otro administrador o con contraseña restablecida deben cambiar su contraseña temporal.
- Desactivar o restablecer una cuenta revoca sus sesiones.
- El administrador no puede desactivar su propia cuenta; usa “Mi contraseña” para cambiarla.
- La estructura acepta roles `admin` y `employee` y vinculación a un trabajador, pero la interfaz solo crea administradores. Los endpoints de negocio y PDF rechazan roles de empleado actualmente.
- Para el futuro portal, filtrar por el empleado de la cuenta **en el servidor**, no solo ocultar botones en el navegador.
- El historial conserva antes/después de los cambios y su autor. La interfaz muestra los últimos 100 eventos; la base conserva los anteriores.
- No se eliminan perfiles: se registra salida y se desactivan.

## 6. Funcionalidades implementadas

### Mejora posterior: códigos internos

- Cada apertura de Nuevo empleado consulta `GET /api/employees/next-code` con la sesión de administrador; no depende de una lista del navegador que pueda estar desactualizada.
- La sugerencia empieza en CC0001 si nunca se utilizó un código de esa serie. Tiene como mínimo cuatro dígitos y sigue con CC10000 después de CC9999.
- Se considera el mayor número CC guardado y un contador persistente; los códigos de empleados inactivos también se incluyen.
- La migración recupera el mayor código de los perfiles y de sus valores anteriores/posteriores en auditoría. Los registros existentes no se renumeran.
- Abrir o cancelar un formulario no reserva ni consume códigos. Un código manual de otro formato tampoco avanza la serie CC.
- Conservar la sugerencia marca la creación como automática; al guardar el servidor vuelve a calcular bajo un bloqueo transaccional. Dos creaciones concurrentes con la misma sugerencia reciben códigos sucesivos distintos.
- Si el administrador escribe otro código, se conserva ese valor y se verifica su unicidad. Un manual CC mayor avanza la serie; cambiar después un CC alto por otro formato no hace retroceder el consecutivo.
- El contador se actualiza en la misma transacción que el empleado y la auditoría; una creación fallida no consume números.
- La interfaz muestra el código realmente guardado en la confirmación. Los duplicados manuales producen un mensaje específico.
- El contador es parte de la base PostgreSQL y de sus respaldos. No se trata de una variable en memoria.

| Módulo | Estado y comportamiento |
| --- | --- |
| Configuración inicial e ingreso | Creación de empresa y primer administrador, login, logout y cambio de contraseña. |
| Resumen | Indicadores de equipo, vacaciones reservadas, salarios, saldos negativos, vacaciones próximas, nómina y actividad. |
| Empleados | Crear, editar, consultar perfil, buscar, filtrar por estado, gestionar salario y ajuste histórico. |
| Vacaciones | Vista previa del conteo, detalle de días excluidos, confirmación negativa, aprobación, cancelación y saldos. |
| Feriados | Agregar y eliminar fechas concretas, con protección del historial aprobado. |
| Nómina | Crear quincena, revisar importes manuales, ajustes con motivo, sincronizar plantilla y cerrar. |
| Colillas | PDF autenticado de cada fila, borrador identificado e instantánea de periodos cerrados. |
| Correo | Ruta SMTP, vista previa/confirmación en interfaz, historial y control de reenvío. Pendiente configuración real. |
| Reportes | Vacaciones por año y fecha de saldo, detalle de fechas y exportación CSV; CSV de nómina. |
| Administradores | Crear otras cuentas, cambiar estado, restablecer contraseña y revocar sesiones. |
| Auditoría | Registros con autor y antes/después de cambios; detalle desde Configuración. |
| Copias de seguridad | Script pg_dump y prueba de restauración en otra base aislada. |
| Adaptación móvil | Interfaz responsive con menú lateral y tablas desplazables. |

La interfaz está en español. La paleta verde de la primera entrega fue reemplazada por blanco, grises y rojo según Circuito Cinco. Usa Montserrat y el logo gris/rojo de la empresa. No requiere compilación del frontend ni generación de imágenes; los archivos gráficos existentes de la empresa se sirven localmente.

### Mejora posterior: identidad de Circuito Cinco

- Referencia revisada en navegador: https://www.circuitocinco.com/. Se observaron fondo blanco, texto gris oscuro rgb(44,45,46), acentos rojos rgb(255,0,0), tipografía Montserrat y pesos 300/500/600.
- La imagen adjunta del usuario corresponde al logo oficial gris y rojo del sitio. Se descargó el mismo diseño en PNG de 1495×381 para evitar ampliaciones borrosas; el archivo se conserva sin modificar en `public/assets/circuito-cinco-logo.png`.
- Fuente del logo: https://www.circuitocinco.com/cdn/shop/files/Logo-Circuito-Cinco.png?v=1675865933.
- Fuentes WOFF2 de los pesos 300, 500 y 600 descargadas de las URLs de fuentes que publica el propio sitio, guardadas en `public/assets/fonts/`. La licencia OFL se guardó junto a ellas desde el proyecto oficial de Google Fonts: https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/OFL.txt.
- La aplicación carga esos assets por el mismo servidor local. No usa el dominio externo ni CDN para pintar logo o fuentes en tiempo de ejecución.
- Se sustituyó la marca ficticia con la letra c en ingreso, sidebar y pantallas de carga. En móvil hay logo tanto en el acceso como en el encabezado y el menú.
- `public/favicon.svg` presenta el símbolo gris/rojo mediante un viewport del PNG original incrustado. No se dibujó un símbolo inventado ni se alteró la imagen fuente.
- Navegación blanca, menú activo y botones rojos, tarjetas y avisos neutros, bordes grises, foco rojo y adaptación móvil. Se usa #e21a24 en controles para mantener contraste legible con blanco.
- Las colillas PDF incorporan logo, encabezado blanco con franja roja, texto gris y bloque de neto neutro con acento rojo. Los nombres largos de empresa tienen área acotada para evitar superponerse con otros datos.
- Se mantienen los formatos monetarios, las pantallas y las reglas de negocio existentes. No se modificaron salarios, cuentas, registros ni nombre de empresa guardado en PostgreSQL.
- Se respeta la preferencia de movimiento reducido. Se conserva el desplazamiento horizontal de tablas en móvil sin desbordar el documento.

## 7. Arquitectura y archivos

| Ruta | Responsabilidad |
| --- | --- |
| `package.json`, `package-lock.json` | Comandos npm y dependencias. |
| `public/index.html` | Documento HTML y carga de interfaz. |
| `public/app.js` | Interfaz JavaScript, navegación, formularios, llamadas al API y CSV. |
| `public/styles.css` | Estilos y adaptación responsive. |
| `public/favicon.svg` | Icono de pestaña: símbolo del logo original en un contenedor SVG. |
| `public/assets/circuito-cinco-logo.png` | Logo oficial de Circuito Cinco, sin alteración y en mayor resolución que la referencia adjunta. |
| `public/assets/fonts/` | Montserrat 300/500/600 local y licencia OFL. |
| `server/index.js` | Pool, migraciones, escucha y cierre del servidor. |
| `server/app.js` | API Express, validaciones, permisos, operaciones, cierres y correo. |
| `server/domain.js` | Fechas civiles, meses completos, días laborales, saldos y nómina. |
| `server/employee-codes.js` | Sugerencia del siguiente código CC y conservación del avance. |
| `server/auth.js` | Hashes, sesiones, cookies, CSRF y gestión de autenticación. |
| `server/db.js` | Pool pg, transacciones, migraciones y escritura de auditoría. |
| `server/pdf.js` | Generación de colillas con PDFKit. |
| `db/001-initial.sql` | Esquema inicial versionado. |
| `db/002-employee-codes.sql` | Contador persistente inicializado con perfiles e historial existentes. |
| `scripts/local-postgres.js` | Preparar, iniciar y detener el clúster local exclusivo. |
| `scripts/migrate.js` | Ejecutar migraciones. |
| `scripts/backup.js` | Respaldo PostgreSQL en formato custom. |
| `Iniciar.cmd` | Lanzador de Windows: inicia PostgreSQL del proyecto y Node.js. |
| `tests/domain.test.js` | Pruebas de reglas de cálculo. |
| `tests/helpers.js` | Preparación y limpieza de bases temporales para pruebas. |
| `tests/integration.test.js` | Flujo API con PostgreSQL real y SMTP local simulado. |
| `tests/employee-codes.test.js` | Secuencia CC, edición manual, inactivos, concurrencia y migración del historial. |
| `tests/browser.js` | Flujo de interfaz con Playwright y capturas. |
| `tests/backup.test.js` | Respaldo y recuperación en base aislada. |
| `.env.example` | Plantilla de configuración sin secretos reales. |
| `.gitignore` | Excluye dependencias, configuración privada, clúster, respaldos y artefactos de prueba. |

Dependencias: Express, express-rate-limit, Helmet, pg, PDFKit y Nodemailer; Playwright para pruebas. Nodemailer se actualizó a `^10.1.0` durante la implementación para resolver las advertencias encontradas en npm audit. La versión efectiva reproducible de cada paquete está en `package-lock.json`.

Solo se sirve `public/` como contenido estático. La interfaz y el API comparten origen. Las consultas parametrizadas y las transacciones están en el servidor. Se usan revisiones para evitar sobrescribir cambios concurrentes y bloqueos para mantener coherencia en calendario, nómina y cuentas.

### Tablas

`company`, `employees`, `users`, `sessions`, `holidays`, `vacations`, `payroll_periods`, `payroll_items`, `email_deliveries`, `audit_log`, `schema_migrations` y `employee_code_counter` (agregada en la mejora de códigos).

Las migraciones se ejecutan al iniciar el servidor y mediante `npm run db:migrate`. Las migraciones aplicadas se registran por nombre. Para cambios futuros, agregar una nueva migración; no depender de editar una que ya se ejecutó.

## 8. Configuración y funcionamiento local

- URL predeterminada de la aplicación: `http://127.0.0.1:3000`. En la explicación de arranque posterior se indicó usar `http://127.0.0.1:3001` porque el puerto 3000 estaba ocupado. La alternativa cambia variables de esa terminal; no modifica `.env` ni el puerto predeterminado del lanzador.
- Base: `circuito_rrhh`, en `127.0.0.1:55432`.
- Usuario de aplicación: `circuito_app`; no es superusuario. Tiene CREATEDB en el entorno local para las pruebas.
- Clúster principal del proyecto: `.local/postgres`.
- La conexión con contraseña está en `.env`, no en estos archivos.
- Existe además un servicio de PostgreSQL previo llamado `postgresql-x64-18`. No se modificó ni se utilizaron sus credenciales.
- Variables relevantes: `HOST`, `PORT`, `APP_ORIGIN`, `DATABASE_URL`, `PG_BIN`, `COOKIE_SECURE`, `TRUST_PROXY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
- SMTP real todavía no está configurado. No se ha enviado correo a trabajadores o servicios externos.
- `.env`, `.local/`, `backups/`, `test-results/` y `node_modules/` están excluidos por `.gitignore`.

### Iniciar

Abrir `Iniciar.cmd`, mantener la ventana abierta y visitar la URL. Alternativa desde la carpeta del proyecto:

```powershell
npm run db:start
npm start
```

Primero se crea la empresa y el administrador, después los empleados y feriados. No abrir solamente `public/index.html` con doble clic: los datos y permisos requieren el servidor.

Si el puerto 3000 está ocupado, la alternativa comunicada al usuario es:

```powershell
cd "C:\Users\makin\Documents\proyectos_Marco\CircuitoDashboard"
$env:HOST = "127.0.0.1"
$env:PORT = "3001"
$env:APP_ORIGIN = "http://127.0.0.1:3001"
npm run db:start
npm start
```

Después visitar `http://127.0.0.1:3001`. Mantener abierta la ventana que ejecuta Node.js. El origen debe coincidir con el puerto elegido para que las operaciones de la interfaz pasen el control de origen.

### Instalar desde cero en otra computadora

```powershell
npm ci
npm run setup:local
npm run db:migrate
npm start
```

El instalador local de Windows usa por defecto `C:/Program Files/PostgreSQL/18/bin`. Configurar `PG_BIN` si cambia esa ruta. Para una base existente, configurar `.env` y migrar; no ejecutar el instalador del clúster local encima de datos ajenos.

### Detener y respaldar

Ctrl+C detiene el servidor Node.js. `npm run db:stop` detiene únicamente el clúster del proyecto. `npm run backup` crea una copia custom en `backups/`.

Las copias de seguridad contienen datos privados y hashes. Copiar respaldos y `.env` por separado a una ubicación protegida. Para restaurar, usar una base nueva y vacía; consultar `README.md`.

### Persistencia y apagado

Los datos activos de `circuito_rrhh` están en varios archivos internos de PostgreSQL dentro de `C:/Users/makin/Documents/proyectos_Marco/CircuitoDashboard/.local/postgres`, no en un único archivo SQL. La aplicación usa tablas persistentes; PostgreSQL puede utilizar memoria para trabajar, pero conserva los cambios confirmados en disco.

Verificación de solo lectura durante la consulta del usuario: base conectada `circuito_rrhh`; 11 tablas en el esquema public, ninguna temporal o unlogged; `fsync=on`, `synchronous_commit=on`, `full_page_writes=on`. El archivo de proceso activo confirmó el directorio esperado y puerto 55432. No se modificaron opciones ni datos y no se simuló un apagón o reinicio.

Un apagado o reinicio normal conserva lo guardado. Tras encender se deben volver a iniciar PostgreSQL del proyecto y la aplicación con los comandos de arranque; no hay todavía servicio automático de arranque instalado para este clúster. PostgreSQL usa WAL para recuperar transacciones confirmadas tras interrupciones, sujeto al funcionamiento correcto del almacenamiento. Lo escrito en un formulario sin guardar o una operación que no terminó puede perderse. Fallos físicos, borrado o corrupción de archivos requieren respaldo; no prometer riesgo cero.

Los respaldos se generan manualmente con `npm run backup` en otra terminal situada en el proyecto mientras PostgreSQL está activo. Son archivos `.dump` en `backups/`. Una copia en el mismo disco no protege contra la pérdida de ese disco: conservar otra copia en almacenamiento separado y protegido. No copiar ni editar los archivos internos del clúster en uso como sustituto de pg_dump.

Fuentes consultadas: [organización de archivos PostgreSQL 18](https://www.postgresql.org/docs/18/storage-file-layout.html), [WAL y recuperación](https://www.postgresql.org/docs/18/wal-intro.html) y [respaldo y restauración](https://www.postgresql.org/docs/18/backup.html).

## 9. Verificación completada

Comprobaciones ejecutadas durante la implementación, el 2026-10-10. No se volvieron a ejecutar por la sola creación de estos documentos de memoria.

| Comando/comprobación | Último resultado observado |
| --- | --- |
| `npm test` | 9 pruebas de dominio aprobadas. |
| `npm run test:integration` | Tras la mejora de códigos: 17 entradas aprobadas, incluyendo los dos flujos padre y sus subpruebas. |
| `npm run test:browser` | Repetido tras la identidad corporativa: ingreso y logo en escritorio/móvil, CC, flujo completo, colilla con imagen y móvil sin desbordamiento aprobados. |
| `npm run test:backup` | Repetido tras la mejora: restauración de datos, migraciones y consecutivo CC aprobada. |
| `npm audit --omit=dev` | 0 vulnerabilidades informadas. |
| `npm run setup:local` repetido | Conservó la configuración existente. |
| `npm run db:start` | Arranque correcto del clúster del proyecto. |
| `npm run db:migrate` | Esquema actualizado correctamente. |
| `npm run backup` | Generó un respaldo real del esquema/base de la empresa. |
| `GET /api/health` | HTTP 200. |
| `GET /` | HTTP 200. |
| `GET /api/auth/status` al entregar | `initialized=false`, sin usuario autenticado. |
| Consulta de cuentas/empleados/periodos al entregar | 0 / 0 / 0. |
| `npm run db:stop` al terminar | Clúster del proyecto detenido correctamente. |

Casos cubiertos: acumulación exacta anual, aniversarios al fin de mes, bisiestos, conteo inclusivo, feriados en fin de semana, medios días, saldos negativos, cancelaciones, corte histórico, salida y acumulación, céntimos impares, deducciones, ajustes parciales, concurrencia mediante revisiones, cierre y preservación de colillas, nuevas cuentas temporales, revocación, permisos, CSRF, exportación y SMTP simulado.

Las pruebas de integración y navegador crean bases `circuito_test_*` en el clúster aislado y las eliminan al terminar. Las pruebas de restauración hacen lo mismo. No cargan empleados ni cuentas en `circuito_rrhh`.

Artefactos locales: `test-results/dashboard.png`, `test-results/payroll.png`, `test-results/mobile.png` y `test-results/restore-test.dump`. Las imágenes tienen datos ficticios señalados como prueba; se inspeccionaron las capturas de escritorio y móvil.

Tras el cambio de marca también se generaron e inspeccionaron `test-results/auth-desktop.png` y `test-results/auth-mobile.png`, y se actualizaron las capturas de dashboard y móvil. `test-results/reference-circuitocinco.png` y su HTML son referencias de la web pública, no datos internos. Los scripts de inspección y transformación usados en esta tarea están en `.local/`, excluida de Git; no son necesarios para ejecutar la aplicación.

## 10. Limitaciones y pendientes

### Pendientes ya acordados o dependientes de datos de la empresa

1. **Configurar SMTP real:** se necesita el proveedor/cuenta autorizada, remitente y credencial; actualmente el código y la interfaz están listos pero el envío real permanece deshabilitado.
2. **Portal de empleados:** crear y vincular cuentas, consultas de datos propios, vacaciones y colillas; verificar aislamiento en todas las rutas. Actualmente solo hay interfaz de administradores.
3. **Automatizar Caja y renta:** el usuario lo dejó para después. Hoy son montos escritos por quincena. Cualquier cálculo automático necesitará confirmar reglas aplicables antes de implementarlo.
4. **Traslado a red o servidor:** configurar dirección, HTTPS, cookies seguras, proxy si corresponde, rol de base con privilegios mínimos, arranque como servicio y respaldos. Todavía no se desplegó.
5. **Carga inicial de información real:** primer administrador, empresa, empleados, días históricos y feriados. No debe inventarse ni precargarse información privada.

### Mejoras futuras propuestas; no son funcionalidades completadas ni órdenes pendientes inmediatas

- Control completo de préstamos: capital, saldo, cuotas y pagos. El usuario pidió explícitamente dejar solo la deducción quincenal por ahora.
- Anulación, reapertura controlada o nóminas correctivas para periodos cerrados, con historial y reglas claras.
- Vigencia de salarios por fecha y selección histórica al crear periodos antiguos.
- Solicitudes de empleados, estados pendientes y un circuito de aprobación separado.
- Jornada de sábado, turnos u otros calendarios si la empresa deja de trabajar exclusivamente de lunes a viernes.
- Importación de fechas históricas de vacaciones para completar reportes anuales anteriores al corte.
- Respaldo automático programado y definición de frecuencia/destino con la empresa.
- Recuperación de acceso si se pierde la única cuenta de administrador; hoy otros administradores pueden restablecer contraseñas, pero no hay un procedimiento de recuperación del único administrador en la interfaz.
- Ajustes adicionales de datos legales o formato de colilla si la empresa los solicita. La identidad visual y el logo de Circuito Cinco ya están aplicados.

### Límites que debe conocer quien retome

- El ajuste histórico da un total descontado, no fechas anteriores. No puede producir un listado completo de vacaciones antiguas si no se cargaron esos movimientos.
- El reporte a fecha recalcula con los datos y movimientos vigentes; no reconstruye automáticamente la fotografía de la base antes de correcciones pasadas.
- Los feriados se ingresan manualmente y por fecha exacta; no hay calendario legal automático ni validación jurídica de la política de 14 días.
- Se verifica aceptación SMTP, no recepción en bandeja ni lectura del correo. Los errores o reintentos deben revisarse en el historial.
- Los tests pasados corresponden a la versión documentada. Tras cambios funcionales, repetir las pruebas pertinentes y registrar resultados nuevos.

## 11. Incidencias relevantes resueltas y residuales

### Arranque de PostgreSQL en Windows

La primera ejecución de `setup:local` quedó esperando porque `pg_ctl` y el PostgreSQL que inicia heredaban los pipes del proceso. PostgreSQL llegó a escuchar en 55432, pero el script no avanzó a provisionar el rol/base ni a escribir `.env`.

Se detuvo el proceso de configuración concreto y el clúster del proyecto, se preservó esa carpeta en `.local/postgres-interrupted` y se corrigió el lanzador para ejecutar `pg_ctl` con stdio ignorado. La instalación posterior creó `.local/postgres`, el rol de aplicación, la base y `.env` correctamente. Se comprobó el arranque y que repetir setup conserva la configuración.

**Residual conocido:** `.local/postgres-interrupted` sigue presente según la revisión de archivos de este turno. Es el clúster de aquel intento interrumpido, no la base de la empresa actual. Su limpieza es opcional, no una tarea de negocio pendiente. Un comando de limpieza combinada fue rechazado por la política automática; no se forzó la eliminación. No usar esa carpeta para iniciar la aplicación ni borrarla sin verificar de nuevo la ruta, su propiedad y el estado de procesos.

### Dependencias

La instalación inicial con Nodemailer 7 informó una vulnerabilidad alta. Se actualizó a Nodemailer 10.1.0 y el audit posterior informó cero vulnerabilidades. Se verificó la integración SMTP con la versión nueva.

### Instantáneas de nómina

Se corrigió una comparación de instantáneas que dependía del orden de propiedades JSON, porque PostgreSQL JSONB puede reordenarlas. Ahora se comparan los valores por clave.

### Redondeo de salario

Se corrigió la división de salarios con céntimo impar: primera quincena hacia arriba y segunda hacia abajo, en lugar de redondear ambas igual.

### Prueba del navegador y advertencias negativas

La primera prueba detectó en consola el HTTP 409 provocado intencionalmente al intentar aprobar un saldo negativo sin confirmar. Se añadió la comprobación inmediata en la interfaz, conservando también el control del servidor. La prueba final pasó sin errores inesperados.

### PowerShell y codificación

Un intento puntual de consulta Node con `-e` perdió comillas al pasar por PowerShell. Se hizo la consulta mediante un here-string enviado a stdin y se confirmaron los conteos cero. Para scripts de varias líneas, preferir archivos o stdin y evitar interpolaciones de shell.

`Get-Content` sin `-Encoding UTF8` en Windows PowerShell puede mostrar tildes como mojibake aunque el archivo sea UTF-8. Leer y escribir estos Markdown en UTF-8; no “corregir” los bytes basándose solo en una lectura con codificación equivocada.

## 12. Bitácora acumulativa

### 2026-10-10 — Definición de alcance

- El usuario pidió primero asesoría, sin implementar: perfiles, vacaciones, feriados, nómina, deducciones, colillas y correo.
- Se discutieron servidor, base, historial, permisos, ajuste inicial, acumulación, periodos y cierre.
- El usuario confirmó Costa Rica, PostgreSQL, Node.js, lunes a viernes, meses completos, históricos a restar, pago quincenal y colones.
- Confirmó salario mensual, comisiones y rebajos quincenales, medios días, negativos con alarma, sin vencimiento y préstamos solo como rebajo.
- Aceptó ajustes salariales manuales con motivo ante entrada/salida parcial y autorizó iniciar todo.

### 2026-10-10 — Construcción de la primera versión

- Se revisó la carpeta vacía, Node/npm y la instalación PostgreSQL existente.
- Se aplicó la habilidad Sites para orientar el trabajo de interfaz local; no se registró ni publicó ningún sitio.
- Se crearon manifiesto npm, configuración, migración inicial, servidor, autenticación, reglas, PDF, interfaz y scripts de operación.
- Se preparó un clúster PostgreSQL propio y se resolvió la espera de pg_ctl en Windows.
- Se instaló y actualizó el conjunto de dependencias; se resolvió la advertencia de Nodemailer.
- Se construyeron pruebas de dominio, API/BD, navegador y restauración.
- Se corrigieron comparación JSONB, céntimos impares, validación de correo y nacimiento, confirmación negativa en la interfaz, actualización del reporte y cierre del diálogo de contraseña temporal.
- Se verificaron los módulos, los permisos, el correo simulado, las colillas cerradas, las exportaciones y el móvil.
- Se generaron capturas de prueba y una copia real de la base de la empresa todavía vacía.
- Se creó README y el lanzador de Windows.
- Se comprobó arranque HTTP, primera pantalla sin administrador y conteos de datos cero.
- Se detuvieron los procesos propios de comprobación; no se publicaron datos ni se enviaron correos reales.
- Se entregó al usuario la primera versión y las instrucciones de acceso.

### 2026-10-10 — Memoria solicitada por el usuario

- Se revisaron los archivos existentes y el estado de la documentación; no se leyeron ni copiaron secretos de `.env`.
- Se creó `conversacion.md` con todos los mensajes y respuestas visibles disponibles en el contexto, incluidas las actualizaciones de progreso de la implementación y las anotaciones de la conversación.
- Se creó `proyecto.md` con requisitos, decisiones, módulos, arquitectura, comandos, pruebas, incidencias y pendientes.
- Se agregó `AGENTS.md` para que próximas sesiones lean ambos archivos y conserven la memoria durante el trabajo.
- Se agregó a `README.md` una sección con enlaces a los archivos de memoria y sus instrucciones.
- Se verificaron la codificación UTF-8, la secuencia del historial, los enlaces a archivos y la presencia de los apartados de requisitos, pruebas y pendientes.
- Esta tarea solo modifica documentación de continuidad. No cambió el comportamiento de la aplicación ni se volvieron a ejecutar las pruebas funcionales por este cambio documental.

### 2026-10-10 — Explicación para ejecutar localmente

- El usuario preguntó cómo correr la aplicación de forma local.
- Se leyeron las instrucciones de continuidad, la memoria, la conversación, README, `Iniciar.cmd` y `package.json`.
- Se comprobó que existen `.env`, `.local/postgres/PG_VERSION` y `node_modules/`, sin leer ni registrar secretos.
- Se observó un proceso Node.js escuchando en 3000. Las consultas a `/api/health` y `/api/auth/status` de ese puerto devolvieron 401, lo cual no coincide con los endpoints públicos de Circuito. No se identificó la función de ese proceso ni se detuvo.
- No se observó un listener en 3001 al comprobarlo; se eligió ese puerto para las instrucciones. Tampoco se observó listener del clúster del proyecto en 55432 en la primera revisión.
- Se explicaron los comandos PowerShell con HOST local, PORT=3001 y APP_ORIGIN coincidente, arranque de PostgreSQL y Node.js, apertura del navegador, creación del primer administrador y cierre con Ctrl+C.
- Se documentó la alternativa en README y se agregaron el mensaje del usuario, las actualizaciones de progreso y la respuesta final a `conversacion.md`.
- No se cambió código funcional ni `.env`, no se reiniciaron otros procesos y no se consultaron registros de la base. No se volvieron a ejecutar pruebas funcionales; se verificaron archivos y puertos para la explicación.

### 2026-10-10 — Consulta sobre almacenamiento y apagado

- El usuario indicó que ya está usando la aplicación y preguntó si los datos viven en memoria o archivos y si apagar la computadora los puede perder.
- Se revisaron las instrucciones de continuidad, la memoria, el historial reciente y los scripts de clúster y respaldo.
- Se consultó documentación oficial de PostgreSQL 18 sobre archivos, WAL y backups.
- Se conectó a la base configurada en `.env` para consultar exclusivamente metadatos de persistencia y opciones de escritura. No se imprimieron credenciales ni registros personales.
- Se confirmaron base `circuito_rrhh`, 11 tablas persistentes, las tres opciones de durabilidad activas, directorio `.local/postgres` y puerto 55432.
- Se explicó que los registros guardados sobreviven un reinicio normal, los formularios sin guardar no, y un corte inesperado tiene recuperación WAL pero no implica riesgo cero de hardware.
- Se indicó `npm run backup` desde otra ventana de PowerShell, su salida en `backups/` y guardar otra copia fuera del disco de esta computadora. Los respaldos automáticos siguen pendientes.
- Se agregaron la pregunta, la actualización visible y la respuesta final a `conversacion.md`.
- No se alteró código, configuración ni registros; no se detuvo la aplicación que el usuario está usando, no se produjo un apagón de prueba y no se creó un nuevo respaldo sin solicitud.

### 2026-10-10 — Códigos internos CC sugeridos

- El usuario pidió sugerir CC0001, CC0002 y sucesivos según el último generado, permitiendo que el administrador lo cambie al crear el perfil.
- Se agregó `db/002-employee-codes.sql`, que crea `employee_code_counter` y obtiene el avance a partir de perfiles y auditoría, sin cambiar códigos existentes.
- Se agregó `server/employee-codes.js` y se modificó `server/app.js`: consulta protegida de sugerencia, bloqueo al crear/editar, asignación automática actualizada y error específico por código duplicado.
- Se modificó `public/app.js`: formulario precargado, campo editable, indicador de conservar la sugerencia y confirmación del código guardado.
- Se agregó `tests/employee-codes.test.js` y se incluyó en `npm run test:integration`; se extendieron pruebas de navegador y respaldo.
- Se probaron consulta sin consumir, fallos sin avance, código manual, inactivos, cambios de código sin retroceso, dos guardados concurrentes, CC10000 y recuperación del mayor código auditado al migrar.
- Resultados: integración 17 entradas aprobadas; navegador completo aprobado; respaldo/restauración aprobado. También se comprobaron las sintaxis de servidor e interfaz.
- Se aplicó `npm run db:migrate` a la base local con éxito. Los tests trabajaron en bases temporales; no se cargaron empleados de prueba en la empresa.
- No se detuvo el proceso que el usuario está usando. Para activar el nuevo servidor se indicó Ctrl+C y `npm start` en la misma terminal (mantiene las variables para puerto 3001), después recargar el navegador.
- Se actualizaron README, esta memoria y la conversación con la solicitud, las actualizaciones y la respuesta final.

### 2026-10-10 — Instrucciones para subir el código a GitHub

- El usuario preguntó qué debe hacer para subir el proyecto a Git; se trató como petición de instrucciones, sin realizar una publicación por su cuenta.
- Se revisó Git y su estado: versión 2.55.0.windows.3, carpeta sin `.git`, `git rev-parse` confirmó que no pertenece a un repositorio.
- Se revisó `.gitignore`: excluye `node_modules/`, `.env`, `.local/`, `backups/`, `test-results/` y logs. `.env.example`, migraciones, pruebas, código y documentos de continuidad sí pueden versionarse.
- Se consultaron las guías oficiales de GitHub para importar un proyecto local y de Git para gitignore.
- Se recomendó GitHub privado para el proyecto de la empresa y un repositorio remoto inicialmente vacío, sin README, licencia ni gitignore generados allí.
- Se explicaron git init -b main, identidad local de autor con valores que el usuario debe sustituir, git add, revisión de git status, primer commit, origin con URL del usuario y push -u origin main, además de cambios posteriores.
- Se aclaró que versionar código y documentación no respalda la base PostgreSQL; los datos de empleados siguen locales y requieren los respaldos ya documentados.
- No se leyó `.env`, no se agregó ningún archivo al índice, no se configuró identidad Git ni se publicó información. La creación del remoto y la autenticación dependen de la cuenta que el usuario elija.
- Se guardaron el mensaje, actualizaciones y respuesta final en `conversacion.md` y una referencia de instrucciones en README. No se cambió código funcional ni se ejecutaron pruebas de la aplicación por esta tarea documental.

### 2026-10-10 — Identidad visual de Circuito Cinco

- El usuario indicó no avanzar con Git, confirmó la empresa y proporcionó el sitio y su logo gris/rojo.
- Se revisó la habilidad Sites ya utilizada y su guía de preview local; se mantuvo el trabajo local sin registro ni publicación externa.
- Se leyó la web indicada y se inspeccionó su aspecto real con Chromium, obteniendo captura, estilos computados y URLs de assets. Se descargó y comparó visualmente el logo oficial, coincidente con el adjunto.
- Se descargaron Montserrat 300/500/600 y su licencia, guardadas en el frontend. El sitio de producción no se copió como interfaz de tienda: se aplicó su identidad a los módulos de recursos humanos.
- Se modificaron `public/app.js`, `public/styles.css`, `public/index.html` y `public/favicon.svg` y se agregaron los assets locales.
- Se modificó `server/pdf.js` para incorporar el logo y la paleta en las colillas, conservando el contenido e importes.
- Se amplió la comprobación del navegador para ingreso en escritorio/móvil, carga del logo y presencia de imagen en el PDF. Se revisaron las capturas de acceso, resumen y móvil.
- Validación final: npm run test:browser aprobado, sin errores inesperados; npm run test:integration con 17 entradas aprobadas; sintaxis de JS comprobada. No se amplió testing después de esas comprobaciones porque no quedaron cambios funcionales o fallos pendientes.
- No se alteró `.env`, no hubo migración de datos ni registros reales modificados. Las pruebas se ejecutaron en bases temporales. No se detuvo el servidor que el usuario usa ni se enviaron correos reales.
- Se indicó reiniciar npm start en la misma terminal y recargar con Ctrl+F5 para activar el PDF y evitar assets antiguos en caché.
- Se actualizaron README, memoria y conversación. Git queda pendiente hasta que el usuario vuelva a solicitarlo.

### 2026-10-10 — Confirmación de la memoria guardada

- El usuario volvió a proporcionar las instrucciones de AGENTS.md y preguntó si todo está registrado en “conversion.md” y proyecto.md.
- Se verificó que los archivos reales son `conversacion.md` y `proyecto.md`; `conversion.md` no existe. No se cambió el nombre ni se creó una copia que pudiera desactualizarse.
- Se confirmó que la conversación previa contiene las 48 entradas hasta la entrega de la identidad de Circuito Cinco y que la memoria conserva reglas, cambios, verificaciones y pendientes, incluido Git postergado.
- Se agregaron el mensaje de instrucciones, la pregunta, la actualización visible y la respuesta final de esta consulta al historial.
- Se actualizó el resumen y se aclaró que la identidad visual ya está completada, dejando únicamente eventuales ajustes de datos legales o formato de colilla como propuesta futura.
- Esta comprobación solo modificó documentación; no se consultaron datos privados, no se cambió código y no se ejecutaron pruebas funcionales de la aplicación.

### 2026-10-10 — Retomar instrucciones para subir a GitHub

- Tras confirmar la memoria, el usuario preguntó nuevamente cómo subir el proyecto a Git. Esta consulta retoma el tema previamente postergado.
- Se verificó que `.git` no existe y que `git rev-parse` indica que la carpeta no pertenece a un repositorio. Se revisaron las exclusiones; no se abrió `.env` ni se consultó PostgreSQL.
- Se entregó el procedimiento con repositorio privado vacío, configuración de autor local, revisión de git status antes del commit y origin con URL que el usuario debe sustituir por la de su cuenta.
- Se recordaron las exclusiones de datos/respaldos y que guardar el código no publica automáticamente la aplicación ni respalda PostgreSQL.
- No se ejecutaron init, add, commit, cambios de configuración o push ni acciones externas. No se encontró gh en el PATH al consultarlo; se mantuvieron las instrucciones con Git normal.
- Se agregaron la consulta y las respuestas a `conversacion.md`. Esta tarea solo actualiza memoria e instrucciones, sin cambios funcionales o pruebas adicionales de la aplicación.

### 2026-10-11 — Instrucciones para registrar medio día

- El usuario preguntó cómo pedir medio día de vacaciones.
- Se revisaron AGENTS.md, memoria, conversación, README y los nombres reales de campos y botones en `public/app.js`, además de `workingDays` en `server/domain.js` y la validación en `server/app.js`.
- Se confirmó que Medio día es una opción del campo Duración y que requiere la misma fecha en Desde y Hasta. El cálculo es 0,5 días en fecha laboral, excluyendo los feriados registrados.
- Se explicaron el conteo previo y el botón Aprobar vacaciones. El flujo actual lo gestiona el administrador; no se creó un nuevo portal o solicitud de empleado.
- Se indicó Observación como lugar para especificar mañana o tarde, sin inventar un campo de horario que todavía no existe.
- La fecha debe cumplir también las reglas existentes de ingreso, corte histórico y superposición. No se consultaron perfiles o saldos privados para responder.
- Se guardaron la consulta y las respuestas en `conversacion.md`, actualizando la fecha de continuación a 2026-10-11. No hubo cambios de código ni necesidad de repetir pruebas funcionales para una explicación del uso existente.

## 13. Protocolo de continuación

1. Leer este documento, después el historial de conversación y las instrucciones de `AGENTS.md`.
2. Identificar la última solicitud del usuario y el alcance autorizado; no implementar automáticamente toda la lista de mejoras futuras.
3. Verificar los archivos y el estado que sea necesario. Si el usuario ya cargó datos reales, preservarlos y trabajar con copias/bases de pruebas cuando corresponda.
4. Para operar localmente, iniciar el clúster del proyecto y el servidor con los comandos documentados. No tocar otros servicios.
5. Hacer el trabajo solicitado; registrar decisiones y cambios en la bitácora.
6. Ejecutar verificaciones adecuadas al cambio, describiendo qué se comprobó y qué no.
7. Agregar los nuevos mensajes y la respuesta final a `conversacion.md`, y actualizar el resumen y pendientes de `proyecto.md` antes de terminar.

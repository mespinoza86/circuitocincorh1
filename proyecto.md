# Circuito: memoria del proyecto

Última actualización: 2026-10-13, America/Costa_Rica.

## 1. Estado para retomar

Resumen revisado el 13/10/2026. Las comprobaciones de datos y pruebas citadas abajo corresponden a los turnos documentados; en esta revisión de memoria no se consultó la base ni se ejecutaron pruebas funcionales.

Última solicitud completada: el asistente creó en main el commit local **Agregar deducciones automaticas y reporte patronal**, con los 19 archivos de implementación/pruebas/documentación. El usuario hará únicamente git push. No se publicó ni se actualizó producción; la base/credenciales/muestras quedan fuera de Git. El identificador vigente se consulta con git log -1 --oneline.

**Entorno y protección de datos.** Esta carpeta es desarrollo/validación: C:/Users/makin/Documents/proyectos_Marco/CircuitoDashboard. Aplicación local de Circuito Cinco en HTML/CSS/JavaScript, Node.js y PostgreSQL, sin publicación externa. Base circuito_rrhh en 127.0.0.1:55432 y clúster .local/postgres, separado del servicio PostgreSQL ajeno. La otra computadora de la LAN es producción, según el usuario; conservar su base, .env y .local. Git transporta código/migraciones, nunca la base ficticia ni sus respaldos. Si se lee desde otro clon, comprobar el entorno antes de modificar una base.

**Funcionalidades y acuerdos.** Perfiles/códigos CC consecutivos editables, vacaciones por meses completos a 14/12 desde ingreso, históricos a restar con corte, feriados, medios días, negativos con aviso y sin vencimiento; salida detiene acumulación. Nómina quincenal en colones, salario mensual dividido entre dos, comisiones, préstamos/otros rebajos y colillas PDF/correo. La interfaz y rutas de negocio son de administradores; el portal de empleados sigue pendiente. Aporte patronal privado: no aparece en la colilla ni se rebaja del neto.

**Deducciones implementadas aquí.** Migración 004 aplicada en desarrollo, configuración por vigencia de Caja obrera/patronal y tramos de renta, reporte Aportes y renta, excepciones/reconciliación/devoluciones y ajustes posteriores con comprobante. Renta del mismo mes completa en primera; comisiones en primera; segunda concilia cambios. Sin pensionados ni créditos fiscales. Octubre 2026 es comparación y los periodos históricos son manuales; noviembre 2026 inicia automático. Devolución separada del bruto/aguinaldo. Incapacidad: importe salarial ingresado y validado con fechas/motivo/referencia; no automatiza subsidios o declaraciones. Configuración ingresada por el administrador en desarrollo: vigencia 01/10/2026, obrero 10,80 %, patronal 26 %, habilitada; se conservaron sus valores. Las dos versiones anteriores copiadas para la muestra están marcadas como SIMULACIÓN, sin validar normativa histórica. Leer DEDUCCIONES.md.

**Aguinaldo.** Migración 003 aplicada en desarrollo. Suma bruto de nóminas cerradas cuyo periodo terminó al corte e históricos activos mensuales, sin duplicarlos, divide entre 12 y preserva salarios guardados. Ciclo diciembre anterior–noviembre; el usuario confirmó mantener el corte temporal. Para 2026, noviembre 2025 pertenece al ciclo anterior; octubre/noviembre 2026 se incluyen según termine cada quincena. No hay pago/colilla especial de aguinaldo todavía.

**Muestra actual en desarrollo, última verificación documentada.** 15 ficticios CC0003–CC0017 (nombres con PRUEBA), más 2 perfiles previos conservados. Intervalo noviembre 2025–octubre 2026: 24 quincenas cerradas, y se conservan las 2 de noviembre 2026: 26 periodos/354 filas. 117 históricos ficticios retirados con auditoría y sustituidos por nóminas del mismo bruto; aguinaldos del lote sin duplicación y sin quincenas pasadas pendientes al corte 13/10/2026. 88 movimientos de vacaciones del lote, medios días/reservas y 3 disponibles negativos actuales. Se reconstruyeron 68 fechas desde el ajuste histórico conservando saldo/disponible. Las filas salariales anteriores quedaron intactas; octubre recibió filas ficticias adicionales, por lo que aumentaron sus totales de muestra. No se habilitó edición de nóminas cerradas en la aplicación ni se debe reproducir esta carga de fixtures en producción.

**Identificar y limpiar las muestras.** Manifest .local/demo-empleados-2026-10-13.json: lote original, payroll_extension y year_extension completed, con UUID, periodos propios/compartidos, reglas, históricos retirados, cambios de ajustes y respaldos previos. Scripts de carga/verificación en .local y capturas en test-results, todos ignorados. No borrar todavía: el usuario lo ordenará. Entonces verificar conexiones y relaciones nuevas, limpiar solo datos identificados de muestra, preservar los 2 perfiles anteriores y los periodos/fila originales de octubre; no retroceder contador CC. El manifest también identifica salarios ficticios añadidos a perfiles anteriores en periodos nuevos. No copiar muestras/reglas simuladas al servidor.

**Git.** Correo d9a9ad7 y aguinaldo 2e3acad ya están en el remoto según el fetch del 13/10/2026. Ahora main contiene un commit local adicional **Agregar deducciones automaticas y reporte patronal**, con deducciones/migración 004, pruebas, ajuste móvil y memoria. Origin/main conserva 2e3acad en la última referencia comprobada; queda únicamente el push para el usuario. El cierre de este turno se integra mediante amend del commit recién creado, sin modificar historia publicada. No se sabe si producción ya instaló los commits anteriores; no se ejecutó una actualización. No publicar por inferencia.

**Verificaciones disponibles.** Implementación de deducciones: 17 pruebas de cálculo, 26 entradas de integración, navegador de escritorio/móvil y respaldo/restauración aprobados. Ampliaciones de muestra: preservación de filas, saldos/aguinaldo, ausencia de duplicación/fechas inválidas y API de 12 reportes/24 periodos comprobados; navegador escritorio/móvil sin errores. Ajuste responsive corregido para importes grandes en tarjetas de Aportes. Resultados son de turnos anteriores: no se repitieron por revisar documentación. Procesos propios de comprobación cerrados; no asumir que el proceso del usuario mantiene el mismo estado.

**Pendientes y siguiente paso.** El usuario ejecutará git push para publicar el commit de deducciones ya creado. Después actualizar producción por etapas: verificar aguinaldo 003, luego deducciones 004, respaldando y conservando configuración/datos del servidor; leer ACTUALIZACIONES.md. SMTP real: Google Workspace, contabilidad@circuitocinco.com; falta configurar credencial autorizada del servidor y comprobar entrega, sin compartir secretos; leer CORREO_COLILLAS.md. Portal de empleados, HTTPS/arranque como servicio/respaldos programados y otras mejoras propuestas están pendientes, no implementadas por inferencia. Para continuar: leer conversación y bitácora completas, atender la nueva solicitud y mantener ambos documentos con cada mensaje/progreso/final; preservar instrucciones de AGENTS.md.

## 2. Archivos de continuidad

| Archivo | Propósito |
| --- | --- |
| `conversacion.md` | Historial de mensajes del usuario y respuestas visibles del asistente, con actualizaciones de progreso. |
| `proyecto.md` | Estado actual, acuerdos, arquitectura, cambios, comprobaciones, limitaciones y trabajo posterior. |
| `AGENTS.md` | Instrucciones para leer y mantener los dos archivos de memoria en próximas sesiones. |
| `README.md` | Manual de instalación, uso, reglas, correo, copias de seguridad y traslado a servidor. |
| `TRASLADO_SERVIDOR.md` | Guía de traslado de código y datos a un nuevo host Windows de la LAN. |
| `ACTUALIZACIONES.md` | Protocolo de desarrollo local y actualización del servidor conservando sus datos. |
| `DEDUCCIONES.md` | Configuración, comparación de octubre, cálculo oficial, excepciones, ajustes y entrega a producción. |
| `CORREO_COLILLAS.md` | Uso del botón y configuración de Google Workspace con el remitente confirmado. |

Los mensajes históricos no se deben reescribir para reflejar decisiones posteriores. Si una decisión cambia, documentar la sustitución aquí y agregar el nuevo mensaje a la conversación.

Estos documentos no contienen credenciales. No registrar valores de `.env`, contraseñas, sesiones o tokens. Si se recibe un secreto en una conversación futura, omitir únicamente ese valor y marcar la omisión.

## 3. Contexto y objetivo

- Usuario: se comunica en español; quiere colaborar de forma continua y preservar el contexto si se cierra la sesión.
- Carpeta: `C:\Users\makin\Documents\proyectos_Marco\CircuitoDashboard`.
- Entorno: Windows y PowerShell. Node.js observado: v24.18.0; npm: 11.16.0.
- PostgreSQL instalado en `C:/Program Files/PostgreSQL/18/bin`; versión observada en el arranque del clúster: 18.4.
- La carpeta estaba vacía al comenzar. El usuario ya subió el proyecto a Git según su mensaje del 2026-10-11 y `git rev-parse --is-inside-work-tree` confirmó que ahora hay un repositorio. La URL remota y su contenido no se inspeccionaron; no imprimir una URL con credenciales. Git instalado observado anteriormente: 2.55.0.windows.3.
- País: Costa Rica. Moneda: colón costarricense, código CRC. Fechas de negocio: America/Costa_Rica.
- Una sola empresa, aproximadamente 15 trabajadores.
- Empresa confirmada: **Circuito Cinco**, sitio https://www.circuitocinco.com/. La aplicación se muestra como “Circuito Cinco · Recursos humanos”. El nombre interno del paquete y carpeta sigue siendo Circuito; no se cambiaron los datos de empresa que el usuario ya hubiera guardado.
- Git/GitHub: el usuario informa que ya publicó el código. El 2026-10-12 autorizó crear el commit de la mejora de correo y se hizo localmente en `main`; no se hizo push. Antes de una actualización, verificar la versión y sincronización real con el remoto.
- Funcionamiento local primero; traslado futuro a una red o servidor. No se autorizó publicar información de personal en servicios externos.

### Entornos confirmados el 2026-10-12

- Desarrollo: esta carpeta y su base local, utilizadas exclusivamente para implementación y validaciones. El usuario no necesita conservar sus datos de prueba, pero eso no implica una orden de borrar la base ahora.
- Producción: la otra computadora servidor de la LAN, donde el usuario comenzará a crear empleados y operar. Preservar sus registros y configuración en todas las actualizaciones.
- El traslado inicial fue completado por el usuario. Para nuevas versiones no repetir restore ni copiar `.local/` desde desarrollo.
- Las futuras migraciones deben probarse con registros existentes ficticios y proteger empleados, vacaciones, nóminas cerradas, cuentas y auditoría. No editar migraciones que producción ya aplicó.

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
- Mejora solicitada el 2026-10-12: botón visible al lado del PDF en Nómina para enviar esa colilla al correo del perfil. Remitente confirmado: contabilidad@circuitocinco.com; proveedor confirmado: Gmail / Google Workspace.
- Ante ingreso o salida durante la quincena, permitir importe salarial **manual con motivo**, conservando el salario mensual del perfil. El usuario aceptó expresamente esta sugerencia al autorizar el inicio.

### 4.5 Memoria de trabajo

Guardar todos los mensajes y respuestas en `conversacion.md`. Guardar todo lo realizado, lo que cambia, lo que se deja para después y el contexto suficiente para retomar en `proyecto.md`. Mantenerlos actualizados; no limitarse a un resumen de esta sesión.

### 4.6 Aguinaldo (mejora del 2026-10-12)

- Petición: conservar el salario de cada empleado para actualizar su monto acumulado de aguinaldo.
- El usuario confirmó **ingresar salarios brutos históricos por mes** para los periodos anteriores al uso del programa.
- Después de la explicación de octubre, el usuario confirmó mantener el corte temporal actual: solo incluir nóminas cerradas cuyo periodo haya terminado al corte, aunque otras ya estén ingresadas o cerradas anticipadamente.
- Se verificó en el MTSS la regla de Costa Rica: ingresos salariales ordinarios/extraordinarios del 1 de diciembre anterior al 30 de noviembre del año, divididos entre 12. Comisiones incluidas antes de rebajos. [Asuntos laborales del MTSS](https://www.mtss.go.cr/temas-laborales/index.html).
- Implementación elegida: sumar ingresos guardados de nóminas cerradas e históricos explícitos, preservando los importes de cada periodo. No es una orden de reconstruir meses faltantes usando el salario actual.

### 4.7 Deducciones automáticas: acuerdos e implementación en desarrollo

- Primero se pidió únicamente análisis; después el usuario aceptó la propuesta y fijó octubre de 2026 como prueba y noviembre como inicio oficial. La mejora ya está implementada aquí; no se autorizó desplegar en producción por inferencia.
- Caja: porcentaje obrero total configurable por el administrador, común para el personal; referencia del usuario 10,83 % incluyendo Banco Popular. No imponer un desglose de componentes como requisito de configuración contra su preferencia.
- Aporte patronal: otro porcentaje configurable y reporte por empleado/quincena y total, exclusivo para administradores. No se descuenta del salario ni se incluye en la colilla del empleado.
- Renta: rangos configurables con cálculo automático; **sin créditos fiscales para nadie** en esta etapa. No crear interfaz de créditos por inferencia.
- Regla corregida y confirmada: calcular renta del mismo mes sobre salario base mensual + comisiones de la primera quincena y descontarla completa en la primera; no repetir renta ordinaria en la segunda. Las comisiones se pagan en la primera quincena. La petición anterior de usar el mes previo queda sustituida, no es un requisito vigente.
- No hay trabajadores pensionados ni créditos fiscales, confirmado por el usuario. La tasa patronal se ingresa en Configuración; no se inventó una tasa empresarial en su base. Octubre compara sin modificar importes; noviembre es oficial cuando el administrador configura/habilita. Cambios de ingreso posteriores a primera se concilian con devolución/cobro aprobado, preservando colillas cerradas.
- Todo se desarrolla/prueba en esta computadora. El usuario recuerda que producción todavía requiere la entrega de aguinaldo y luego la de deducciones; no asumir que ya se migró producción.
- El usuario solicitó excepciones (ejemplo: incapacidad). El formulario automático permite importe salarial ajustado, fechas, motivo y referencia; requiere revisión de deducciones y aprobación de la conciliación. No calcula subsidios desde una boleta. Ajustes posteriores concilian retención con ingresos ya guardados, con propuesta/aplicación/cancelación y PDF; correcciones salariales de nóminas cerradas requieren un procedimiento adicional.

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
- Las colillas de borrador se identifican como borrador. El envío requiere nómina cerrada. Desde la mejora del 2026-10-12 el destinatario debe coincidir con el **correo actual del perfil**, sustituyendo la decisión inicial de usar el correo de la instantánea. El PDF histórico conserva su instantánea y sus importes.
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

### Mejora actual: deducciones y excepciones

- Configuración versionada por vigencia: porcentaje obrero total, porcentaje patronal independiente, tabla mensual progresiva, referencia y estado de habilitación. Las tasas iniciales se dejan vacías para que el administrador las introduzca; referencia de tramos 2026 visible y editable en el formulario. Se requiere una versión de reglas del año de la nómina.
- `deduction_control` empieza deshabilitado con trial_start=2026-10-01 y official_start=2026-11-01. Octubre permanece manual; comparación calcula sobre los datos guardados sin escribir pagos, rebajos o ajustes. La segunda puede comparar un borrador de primera, indicando carácter informativo; si falta una primera que debería existir, se avisa.
- La migración agrega modo manual a todos los periodos previos y cero/null a columnas nuevas sin cambiar los importes existentes. Nuevos meses oficiales pasan a automático con configuración habilitada. Activar expresamente borradores convierte todos los del mes juntos y obliga a revisar sus filas, sin borrar sus importes antes de revisión. Las dos quincenas deben usar el mismo modo.
- Una quincena manual cerrada conserva el mes manual aunque luego se active la configuración. Un mes iniciado automático conserva ese modo para su otra quincena aunque se deshabiliten nuevos meses. No se mezclan modos ni se convierten periodos cerrados.
- Renta mensual prevista en primera = bruto salarial real de primera + base de segunda prevista desde el salario mensual (otra mitad, o cero si la salida ya excluye esa segunda). Comisiones solo en primera. Segunda usa los ingresos reales de ambas y renta neta retenida/aplicada; admite un ingreso posterior a primera con origen cero explícito por fecha de ingreso.
- Caja y aporte patronal sobre bruto salarial; cálculo preciso con BigInt y redondeo en céntimos. Refund separado en tax_refund_cents: afecta neto, PDF y CSV pero nunca gross_cents/aguinaldo. Neto negativo bloqueado con aviso, sin traslado silencioso.
- Vista previa obligatoria de importes y tasas, validada por el servidor contra empleado/reglas/origen antes de guardar; API ignora valores de Caja/renta enviados por el cliente en modo automático. Cierre revalida las reglas y bases. Diferencia de segunda requiere confirmación explícita y motivo de conciliación.
- Excepción documentada: fechas que toquen la quincena, motivo, referencia y salario ajustado con motivo. No se incorporó gestión automática de subsidios, bases mínimas contributivas ni tratamiento de todas las licencias; revisión contable del importe salarial sigue necesaria.
- Reporte Aportes y renta exclusivamente administrador, filtrado por mes/quincena, totales de cerradas separados de borradores, patronal manual identificado como estimación y falta de reglas marcada incompleta; worker/employer aportes separados de impuesto retenido. Los PDF de empleados no incluyen aporte patronal.
- tax_adjustments: propuesta de diferencia sobre ingresos de nóminas automáticas cerradas, control de mes completo según ingreso/salida, referencia y confirmación contable para aplicar, cancelación con historial, aplicación única bajo bloqueo y comprobante PDF sin reescribir colillas. No realiza pagos bancarios, declaraciones o recuperaciones desde Hacienda. El PDF congela la empresa del periodo original y los datos de la propuesta.
- Bloqueo 74210620 para configuración/retención, adquirido después del 74210619 salarial y antes de filas de periodo/empleados en mutaciones de nómina. Se preserva el bloqueo de códigos 74210618 y se evita cruzar órdenes. Ajuste posterior bloquea el perfil mientras valida su base; reportes usan repeatable read.

### Mejora posterior: aguinaldo

- Sección propia en la navegación para administradores; año seleccionable, acumulado, bruto, estado de empleado y advertencia de quincenas pasadas sin ingresos registrados.
- Año del aguinaldo = año en que termina el ciclo en noviembre. Por defecto se muestra el ciclo en curso: en diciembre pasa al siguiente año. Se pueden consultar ciclos anteriores.
- Corte = menor entre hoy (Costa Rica) y 30 de noviembre del ciclo. Se incluyen nóminas cerradas con fin de quincena anterior o igual al corte, más históricos activos cuyo mes terminó al corte. No se prorratea un mes/quincena en curso ni se proyectan ingresos futuros.
- Los bruto/base/comisiones de cada nómina ya se conservaban en PostgreSQL. Se reutilizan sin copiar filas ni depender del salario vigente del perfil.
- Detalle de 12 meses por persona, origen (histórico o quincenas), datos faltantes, importes incluidos y referencias de históricos.
- Históricos mensuales: trabajador, año, mes, total bruto real y referencia obligatoria. Solo meses terminados con relación laboral; se admite cero explícito. Editar usa revisión concurrente; retirar exige motivo y conserva la fila/auditoría; reactivar permite corregirla.
- Un empleado/mes puede tener históricos o nóminas, sin mezclarlos. Cualquier borrador o nómina del mes bloquea un histórico; un histórico activo bloquea crear o revisar filas salariales del mes. Un bloqueo transaccional común evita duplicados incluso si se crean simultáneamente. Si existe una quincena, completar la otra en Nómina.
- Un dato faltante no equivale a salario cero. Los meses anteriores sin detalle se indican como pendientes. Se consideran las fechas de ingreso/salida para determinar quincenas esperadas y también se muestran empleados que salieron.
- Suma con BigInt en céntimos y división por 12 con un solo redondeo final por trabajador. Total de empresa = suma de aguinaldos individuales ya redondeados.
- CSV con bruto, acumulado, fechas del ciclo, corte y número de quincenas sin datos. La misma neutralización de fórmulas existente se aplica a nombres/códigos.
- No registra pago o liquidación del aguinaldo; no genera colilla especial ni envío de aguinaldo. Tampoco automatiza horas extra, licencias, subsidios o clasificación de pagos no salariales. Se debe completar el historial antes de usar un acumulado incompleto para pagar.
- Lectura del reporte dentro de una transacción repeatable read evita combinar fuentes de momentos distintos mientras se corrige un histórico y se crean nóminas.

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
| Deducciones | Octubre comparativo; nuevas nóminas oficiales desde noviembre con configuración, vista previa, aprobación, excepciones y devoluciones. |
| Aportes y renta | Control privado del administrador por mes/quincena, aportes y renta neta, ajustes posteriores y comprobante PDF. |
| Aguinaldo | Ingresos brutos de nóminas cerradas e históricos mensuales, acumulado, detalle, pendientes, corrección/retiro con auditoría y CSV. |
| Colillas | PDF autenticado de cada fila, borrador identificado e instantánea de periodos cerrados. |
| Correo | Botón visible junto al PDF, remitente y correo actual del perfil, confirmación, historial, errores y control de reenvío. Google Workspace confirmado; pendiente credencial y entrega real. |
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
| `server/aguinaldo.js` | Ciclo diciembre–noviembre, fuentes salariales, pendientes y cálculo preciso del acumulado. |
| `server/deductions.js` | Porcentajes, validación de tramos, renta precisa, proyección y conciliación por empleado/mes. |
| `server/deduction-api.js` | Configuración, comparación, activación mensual, reporte patronal y ajustes con permisos/auditoría. |
| `public/deduction-views.js` | Configuración, formularios automáticos, comparaciones, reportes y aprobación de ajustes. |
| `server/auth.js` | Hashes, sesiones, cookies, CSRF y gestión de autenticación. |
| `server/db.js` | Pool pg, transacciones, migraciones y escritura de auditoría. |
| `server/pdf.js` | Generación de colillas con PDFKit. |
| `db/001-initial.sql` | Esquema inicial versionado. |
| `db/002-employee-codes.sql` | Contador persistente inicializado con perfiles e historial existentes. |
| `db/003-aguinaldo.sql` | Tabla de ingresos brutos históricos mensuales con revisión y estado, sin alterar datos anteriores. |
| `db/004-deductions.sql` | Control/reglas/ajustes y columnas compatibles de modo, devolución, patronal y snapshots en nómina. |
| `scripts/local-postgres.js` | Preparar, iniciar y detener el clúster local exclusivo. |
| `scripts/migrate.js` | Ejecutar migraciones. |
| `scripts/backup.js` | Respaldo PostgreSQL en formato custom. |
| `Iniciar.cmd` | Lanzador de Windows: inicia PostgreSQL del proyecto y Node.js. |
| `tests/domain.test.js` | Pruebas de reglas de cálculo. |
| `tests/aguinaldo.test.js` | Ciclo, proporcional, bruto, redondeo, periodos no incluidos, ceros y salida. |
| `tests/aguinaldo.integration.test.js` | Históricos, nómina, cambios de salario, concurrencia, auditoría y conservación al migrar. |
| `tests/deductions.test.js` | Tramos, límites, ejemplos, redondeo, primera/segunda, devoluciones y excepciones. |
| `tests/deductions.integration.test.js` | Migración con datos, prueba vs oficial, stale previews, aprobación, privacidad, transición mensual y ajuste único. |
| `tests/helpers.js` | Preparación y limpieza de bases temporales para pruebas. |
| `tests/integration.test.js` | Flujo API con PostgreSQL real y SMTP local simulado. |
| `tests/employee-codes.test.js` | Secuencia CC, edición manual, inactivos, concurrencia y migración del historial. |
| `tests/browser.js` | Flujo de interfaz con Playwright y capturas. |
| `tests/smtp-server.js` | SMTP de loopback para verificar el botón sin enviar mensajes externos. |
| `tests/backup.test.js` | Respaldo y recuperación en base aislada. |
| `.env.example` | Plantilla de configuración sin secretos reales. |
| `.gitignore` | Excluye dependencias, configuración privada, clúster, respaldos y artefactos de prueba. |

Dependencias: Express, express-rate-limit, Helmet, pg, PDFKit y Nodemailer; Playwright para pruebas. Nodemailer se actualizó a `^10.1.0` durante la implementación para resolver las advertencias encontradas en npm audit. La versión efectiva reproducible de cada paquete está en `package-lock.json`.

Solo se sirve `public/` como contenido estático. La interfaz y el API comparten origen. Las consultas parametrizadas y las transacciones están en el servidor. Se usan revisiones para evitar sobrescribir cambios concurrentes y bloqueos para mantener coherencia en calendario, nómina y cuentas.

### Tablas

`company`, `employees`, `users`, `sessions`, `holidays`, `vacations`, `payroll_periods`, `payroll_items`, `email_deliveries`, `audit_log`, `schema_migrations`, `employee_code_counter` (mejora de códigos) y `salary_history` (mejora de aguinaldo).

Desde la mejora de deducciones también: `deduction_control`, `deduction_rules` y `tax_adjustments` (16 tablas de negocio/operación en total). No se reemplazaron tablas existentes.

Las migraciones se ejecutan al iniciar el servidor y mediante `npm run db:migrate`. Las migraciones aplicadas se registran por nombre. Para cambios futuros, agregar una nueva migración; no depender de editar una que ya se ejecutó.

## 8. Configuración y funcionamiento local

- URL predeterminada de la aplicación: `http://127.0.0.1:3000`. En la explicación de arranque posterior se indicó usar `http://127.0.0.1:3001` porque el puerto 3000 estaba ocupado. La alternativa cambia variables de esa terminal; no modifica `.env` ni el puerto predeterminado del lanzador.
- Base: `circuito_rrhh`, en `127.0.0.1:55432`.
- Usuario de aplicación: `circuito_app`; no es superusuario. Tiene CREATEDB en el entorno local para las pruebas.
- Clúster principal del proyecto: `.local/postgres`.
- La conexión con contraseña está en `.env`, no en estos archivos.
- Existe además un servicio de PostgreSQL previo llamado `postgresql-x64-18`. No se modificó ni se utilizaron sus credenciales.
- Variables relevantes: `HOST`, `PORT`, `APP_ORIGIN`, `DATABASE_URL`, `PG_BIN`, `COOKIE_SECURE`, `TRUST_PROXY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
- SMTP real todavía no se configuró durante el trabajo. El usuario confirmó Google Workspace y contabilidad@circuitocinco.com. Falta la credencial autorizada en el servidor; no se consultó su `.env`. No se ha enviado correo a trabajadores o servicios externos desde estas pruebas.
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
| `npm test` | Tras deducciones: 17 pruebas de cálculo aprobadas. |
| `npm run test:integration` | Tras deducciones: 26 entradas aprobadas; incluye conservación de registros, modos por mes, devolución, permisos y aplicación única concurrente. |
| `npm run test:browser` | Tras deducciones: flujo completo, configuración, octubre comparativo, noviembre automático, excepción/devolución, PDF/CSV, aportes y móvil aprobados, sin errores de consola/JavaScript. |
| `npm run test:backup` | Tras deducciones: 1 prueba aprobada; restaura reglas/control, snapshots, aporte patronal, devolución, ajuste aplicado e históricos salariales. |
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

1. **Configurar SMTP real:** proveedor Google Workspace y remitente contabilidad@circuitocinco.com confirmados. Falta generar/configurar una credencial autorizada en el servidor y comprobar entrega real. Leer `CORREO_COLILLAS.md`. No se ha comprobado si la cuenta permite contraseñas de aplicación; si no, consultar al administrador de Workspace sobre relay u otra implementación. OAuth2 no está implementado.
2. **Portal de empleados:** crear y vincular cuentas, consultas de datos propios, vacaciones y colillas; verificar aislamiento en todas las rutas. Actualmente solo hay interfaz de administradores.
3. **Activar deducciones en producción:** la mejora está implementada/probada y guardada en un commit local; falta que el usuario haga push. Entregar según ACTUALIZACIONES.md y luego ingresar tasas/tramos reales en Configuración del servidor. Octubre es comparación; noviembre oficial. No se transfiere la configuración de prueba desde esta base.
4. **Preparar operación definitiva del servidor:** el usuario ya lo levantó en la LAN. HTTPS, cookies seguras, proxy si corresponde, rol de base con privilegios mínimos, arranque como servicio y respaldo automático no se verificaron ni configuraron durante esta consulta.
5. **Carga de información real:** el usuario la realizará en la computadora de producción. No inventar, precargar, reemplazar ni mezclar sus datos con los de validación.
6. **Completar el historial de aguinaldo en producción:** ingresar salarios brutos de meses anteriores cuando se instale la mejora. Los datos reales no se conocen ni se cargaron en esta computadora. Cálculo y carga ya están implementados; registro de pago/liquidación o colilla de aguinaldo son posibles etapas futuras.

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

### 2026-10-11 — Consulta interrumpida sobre acceso desde otro equipo

- El usuario informó que ya subió el proyecto a Git y preguntó qué instalar en otra computadora y cómo manejar la base.
- Se preguntó si reemplazaría al equipo actual o compartirían datos; respondió “Usar ambas con datos compartidos”. Después, ante la pregunta de la red, respondió “No, ubicaciones diferentes”.
- Se revisaron scripts, configuración, estado Git y metadatos de red. Se observó un repositorio local válido y PostgreSQL escuchando solo en 127.0.0.1:55432. No se leyeron credenciales.
- Se investigaron las alternativas de un único servidor con HTTPS o VPN privada, y documentación oficial de PostgreSQL, Node.js, Git, Express, Windows firewall y Tailscale. No se instaló ni configuró una VPN ni se contrataron servicios.
- El usuario interrumpió el turno antes de una respuesta final. No quedaron scripts funcionales de esa alternativa ni procesos propios corriendo.

### 2026-10-11 — Explicación de traslado a un nuevo servidor de la LAN

- La última instrucción reemplaza el escenario anterior: otra computadora será host del programa y de PostgreSQL y los clientes estarán en la misma LAN. El usuario pidió solo explicación.
- Se revisaron setup:local, backup, configuración, arranque, control de origen y prueba de restauración existente. Se consultaron fuentes oficiales para instaladores, Git clone, pg_restore y firewall.
- Se confirmó que `setup:local` crea una base vacía antes de migraciones. Para restaurar datos existentes, no se debe ejecutar npm start, Iniciar.cmd ni db:migrate antes del pg_restore completo.
- Se preparó `TRASLADO_SERVIDOR.md` y se agregó su enlace a README. Incluye respaldo con registros congelados, instalación y descarga, contraseña nueva del rol local, restore de una sola transacción sin sobreescribir propietarios/privilegios, migraciones y verificación con cuentas restauradas.
- Se explicaron HOST=0.0.0.0, puerto 3001, APP_ORIGIN con la IP real del nuevo servidor y acceso por esa misma dirección desde todos los navegadores.
- Se documentó una regla de firewall para 3001, perfiles Private/Domain y subred local, sin exponer PostgreSQL 55432. La configuración propuesta es HTTP inicial para comprobar la LAN; HTTPS, arranque como servicio y respaldo automático quedan por preparar para uso definitivo.
- Se mantuvieron las contraseñas y registros fuera de los documentos. El destino genera un `.env` nuevo; si había SMTP se trasladan esos ajustes aparte, sin reemplazar la conexión nueva de la base.
- No se ejecutaron respaldo, restauración, clonado, cambios de `.env`, comandos de firewall ni pasos en la computadora destino. No se cambiaron archivos de aplicación ni se simularon resultados de una migración real.
- Se guardaron también el turno interrumpido y la nueva solicitud en `conversacion.md`. Los últimos resultados funcionales de pruebas siguen siendo los ya registrados; para esta explicación no se repitieron.

### 2026-10-12 — Desarrollo separado de producción y actualizaciones

- El usuario confirmó que el programa y la base ya se trasladaron y funcionan en el otro equipo, que será el servidor de producción. Esta computadora queda para pruebas y su base no es la oficial.
- Se revisaron el ejecutor de migraciones y el arranque: las migraciones se registran por nombre y se omiten las ya aplicadas; los archivos nuevos se ejecutan en una transacción.
- Se comprobó con git ls-files que `.env`, `.local/` y `backups/` no están versionados en este repositorio y con git check-ignore que permanecen excluidos. No se inspeccionó el repositorio ni la base del servidor.
- Se explicaron las actualizaciones por código y migraciones compatibles, con respaldo antes de aplicar y sin restaurar la base de desarrollo ni repetir la instalación inicial.
- Se creó ACTUALIZACIONES.md, se enlazó desde README y se agregaron a AGENTS.md las reglas permanentes para la separación de entornos y protección de producción.
- Se describió el flujo de servidor: detener Node, conservar PostgreSQL activo, comprobar estado y versión, respaldar, git pull --ff-only, npm ci, migrar, arrancar y verificar. Los pasos se ejecutan uno a uno y se detienen si falla alguno.
- Se registró que un cambio de esquema necesita una migración nueva y pruebas con datos ya existentes; no se garantiza preservación por el solo hecho de llamarlo migración.
- Se consultaron fuentes oficiales de Git y PostgreSQL. No se cambiaron archivos de aplicación ni SQL, no se reinició el programa y no se ejecutaron pruebas o comandos de despliegue en producción.
- Se guardó la anotación del usuario y todo el intercambio en conversacion.md. Las mejoras futuras siguen pendientes de que el usuario las especifique.

### 2026-10-12 — Botón de envío de colillas y Google Workspace

- Solicitud: botón junto al PDF en Nómina, con entrega al correo del empleado guardado en la base. El usuario confirmó remitente contabilidad@circuitocinco.com y después Gmail / Google Workspace; no facilitó credenciales.
- Se revisaron memoria, conversación, README, interfaz, API, generación PDF, configuración y pruebas existentes. El envío ya existía como icono oculto en borradores y deshabilitado sin SMTP. Se reutilizó y mejoró el flujo existente.
- `public/app.js`: acciones con textos PDF / Enviar correo / Reenviar correo; botón siempre visible para revisar, confirmación con direcciones de solo lectura y adjunto, avisos por cierre o configuración pendientes, envío bloqueado hasta cumplir requisitos, historial actualizado tras éxito y fallos, y preservación del estado disabled de formularios.
- `public/styles.css`: presentación de botones y confirmación, remitente/destinatario con ajuste de líneas y adaptación móvil. Las capturas se inspeccionaron visualmente.
- `server/app.js`: bootstrap informa configuración SMTP completa y remitente, sin secretos; falta de credencial deshabilita Gmail y SMTP con usuario; consulta de nómina obtiene `recipient_email` del perfil vigente; envío revalida esa dirección bajo bloqueo y rechaza correo antiguo o arbitrario. No cambia instantáneas ni importes cerrados. Se conserva protección contra envíos simultáneos y reenvíos sin confirmar, PDF compartido, registro de fallos y auditoría.
- `.env.example`: remitente/usuario confirmados, puerto 465 y cifrado; SMTP_HOST y SMTP_PASS vacíos hasta activar. No se modificó el `.env` local o del servidor. Un git pull no configura esas variables privadas.
- `tests/integration.test.js`: comprueba Gmail incompleto, perfil actualizado después del cierre sin alterar neto/instantánea, rechazo de correo antiguo y arbitrario, dos envíos concurrentes con una sola aceptación, adjunto PDF, remitente, reenvío y fallo SMTP con historial.
- `tests/browser.js` y nuevo `tests/smtp-server.js`: botón en borrador y periodo cerrado, PDF y dirección revisables, ausencia de campos para sobrescribir destinatario, bloqueos explicados, envío y reenvío a SMTP de loopback, escritorio y móvil sin desbordamiento. Todos los destinatarios de prueba usan example.test.
- Verificaciones: `node --check public/app.js`, `node --check server/app.js` aprobados; `npm.cmd run test:integration`: 17 entradas aprobadas, 0 fallos; `npm.cmd run test:browser`: aprobado, sin errores de JavaScript ni consola inesperados; `git diff --check`: sin errores de espacios. Git avisó conversión LF/CRLF habitual de Windows, sin alteración de UTF-8.
- Artefactos: `test-results/payroll.png`, `test-results/payslip-email.png`, `test-results/payslip-email-mobile.png`, junto a las capturas generales del flujo. Son ficticios y están ignorados por Git. Los servidores y bases temporales de pruebas se cerraron al finalizar; no se detuvo el programa que el usuario pueda estar usando ni PostgreSQL.
- Se consultó documentación oficial actual de Google y Nodemailer. DNS público del dominio apuntaba a Google; se pidió y recibió confirmación del usuario antes de documentar el proveedor. Credencial, permisos de la organización y entrega real no fueron verificados.
- Nuevo `CORREO_COLILLAS.md`: preparación de cuenta/contraseña de aplicación si está permitida, cambios exclusivos SMTP en .env, reinicio, uso y comprobación. README y esta memoria actualizados; conversación preservada en orden.
- No hay migración nueva ni cambios en `db/`, dependencias o estructura. No se restauró ni trasladó ninguna base. No se hizo commit/push o despliegue ni se envió correo externo. Los cambios previos no confirmados de documentación/traslado permanecen en el repositorio.
- Próximo punto: el usuario puede validar la interfaz reiniciando Node.js y recargando. Para producción, guardar la versión en Git, actualizar mediante ACTUALIZACIONES.md, configurar credencial en el servidor siguiendo CORREO_COLILLAS.md y comprobar el primer envío autorizado. Nunca compartir esa credencial por chat ni guardarla en estas memorias.

### 2026-10-12 — Commit de la mejora de correo y documentación

- El usuario pidió hacer commit para mantener Git al día. Se incluyeron los 14 archivos pendientes de la mejora y documentación de continuidad, configuración de correo, traslado y actualizaciones, todos revisados en este contexto.
- Se comprobaron rama `main`, último commit previo `45386e3` (First commit), cambios y ausencia de archivos previamente preparados en el índice. `git diff --check` y `git diff --cached --check` pasaron.
- `git check-ignore` confirmó exclusión de .env, .local, backups, test-results y node_modules. Se agregaron únicamente los 14 archivos explícitos de código/pruebas/documentación y .env.example sin credenciales reales; no se agregaron datos de PostgreSQL.
- `git commit -m "Agregar envio de colillas por correo desde nomina"` terminó con éxito. Se incorporó al mismo commit su registro en la memoria y el cierre de este turno mediante amend del commit recién creado; no se modificó historia publicada. Para consultar el identificador vigente: `git log -1 --oneline`.
- No se hicieron cambios funcionales ni se repitieron pruebas ya aprobadas en el turno anterior. No se hizo push, se contactó el servidor de producción, se configuró SMTP o se enviaron mensajes.
- Próximo paso: subir el commit al remoto con git push, actualizar producción mediante ACTUALIZACIONES.md y configurar correo mediante CORREO_COLILLAS.md cuando corresponda. La configuración de credencial y primera entrega real siguen pendientes.

### 2026-10-12 — Aguinaldo e ingresos históricos por mes

- El usuario pidió la segunda mejora: conservar salarios y actualizar el aguinaldo; preguntó si conocemos ese concepto. Se verificó la regla de Costa Rica en fuentes oficiales del MTSS, consultando asuntos laborales, calculadora y campaña de aguinaldo. Dos lecturas directas (calculadora y un criterio PDF) respondieron 403; se usó la página oficial de asuntos laborales y su contenido recuperado por búsqueda.
- Se preguntó cómo tratar los salarios anteriores al programa. El usuario eligió «Ingresar los salarios brutos históricos por mes»; no se inventaron datos ni se reconstruyeron salarios antiguos desde el perfil.
- Se añadieron db/003-aguinaldo.sql y server/aguinaldo.js. La migración solo crea salary_history, referenciada a empleados/administradores, con único empleado/año/mes, revision, active, importe y referencia.
- server/app.js: reporte autenticado, lectura consistente, altas/ediciones/retiros de históricos con permisos existentes de administrador, validación de mes terminado y relación laboral, revisión concurrente y auditoría. Se agregó la protección contra históricos en savePayrollItem y el bloqueo común para crear fuentes excluyentes.
- public/app.js: estado/carga/navegación de Aguinaldo, reporte anual, advertencias, detalle de 12 meses y fuentes, registro/edición/retiro/reactivación de históricos y CSV. No se modificaron salarios mensuales del perfil, cálculos de vacaciones, colillas o forma de cerrar nóminas.
- package.json integra las nuevas pruebas de cálculo/integración. No cambió ninguna dependencia o lockfile. Se añadieron tests/aguinaldo.test.js y tests/aguinaldo.integration.test.js; tests/browser.js y tests/backup.test.js se ampliaron.
- Pruebas: npm.cmd test → 13 aprobadas; npm.cmd run test:integration → 18 aprobadas; npm.cmd run test:browser → flujo completo aprobado, sin errores inesperados; npm.cmd run test:backup → 1 aprobada, recuperando también salary_history. Sintaxis comprobada para public/app.js, server/app.js y server/aguinaldo.js. No quedaron fallos pendientes.
- Se verificaron 12 meses completos, proporcional dividido entre 12, bruto en vez de neto, exclusión de borradores/futuros, salida y ceros explícitos, redondeo de suma, corrección/retiro/reactivación, salario actualizado sin alterar periodos cerrados, duplicados y una carrera de alta de histórico vs creación de nómina. En una base temporal se reejecutó la migración nueva sobre empleados y nóminas existentes; se compararon filas completas antes/después, conservadas sin cambios.
- En la revisión final se detectó que el número de bloqueo propuesto inicialmente (74210618) ya pertenecía a los códigos internos. Se separó el bloqueo salarial a 74210619 y se adquirió antes de bloquear empleados/periodos en revisión y sincronización de nómina. Se añadió una prueba simultánea de edición de perfil, revisión de nómina y alta de histórico para comprobar que las tres operaciones completan correctamente. No se observó un fallo real en producción; se corrigió el riesgo al revisar el código.
- Después de ese ajuste se repitió npm.cmd run test:integration: 18 entradas aprobadas, 0 fallos, incluida la prueba simultánea nueva. La comprobación final git diff --check tampoco informó errores de espacios. Los demás resultados corresponden a las comprobaciones ya ejecutadas del mismo turno, sin nuevas modificaciones de interfaz, cálculo o esquema después de ellas.
- Artefactos inspeccionados: test-results/aguinaldo.png, aguinaldo-detail.png y aguinaldo-mobile.png. El detalle usa desplazamiento vertical/horizontal en pantallas pequeñas, como el resto de tablas. Los datos son ficticios. Servidores/bases de pruebas se cerraron mediante sus helpers.
- npm.cmd run db:migrate → «Base de datos actualizada» en la base local de desarrollo. No se transfirió la base a producción, no se crearon salarios ficticios en la base de la empresa y no se modificó .env ni el servicio PostgreSQL ajeno. No se detuvo el proceso Node del usuario: debe reiniciarlo para activar las rutas nuevas.
- README actualizado con uso, regla, límites, fuentes, arranque y actualización. Conversación y decisiones de este turno conservadas en memoria. No se hizo commit, push o despliegue de esta segunda mejora.
- Pendiente operativo: reiniciar/recargar localmente; después guardar la versión validada en Git cuando el usuario lo pida y actualizar producción con respaldo previo y migración nueva. Completar ingresos anteriores en producción y comprobar quincenas faltantes. Pago/colilla especial de aguinaldo, horas extra en nómina y tratamiento automático de licencias quedan fuera de esta entrega.

### 2026-10-12 — Explicación de octubre posterior al corte del aguinaldo

- El usuario preguntó por qué octubre figura como ₡0 incluido y sus dos quincenas como posteriores al corte pese a tener salarios registrados. Se conservó su selección en tabla en conversacion.md.
- Se revisaron server/aguinaldo.js, el mensaje del detalle en public/app.js y las reglas documentadas en README. aguinaldoPeriod limita as_of a hoy o 30 de noviembre; aguinaldoReport exige nómina cerrada y end_date <= as_of.
- Con la fecha actual del contexto del cliente (2026-10-12), el 15 y el 31 de octubre son posteriores. El cero representa bruto excluido del acumulado al corte, no salario registrado como cero. No se inspeccionó la base o reloj del servidor del usuario ni se atribuyó esta conducta a una obligación legal.
- Se explicó que fue una decisión de implementación. Incluir inmediatamente las quincenas cerradas se plantea como alternativa ajustada a la expectativa expresada; sigue pendiente de que el usuario confirme esa preferencia. No se cambió código, datos, migraciones, Git o configuración ni se repitieron pruebas por una consulta explicativa.
- Se actualizó el resumen y se guardaron pregunta, progreso y respuesta final. Próximo punto: si el usuario pide cambiar el criterio, conservar borradores excluidos y límites del ciclo anual, revisar textos/corte/CSV/pendientes y agregar pruebas para quincenas cerradas antes de su fin.

### 2026-10-12 — Confirmación de mantener el corte temporal

- El usuario aclaró que solo quería entender la exclusión de octubre y pidió dejar el funcionamiento como está.
- Se confirmó mantener status closed y end_date <= corte. No se implementará la propuesta de sumar quincenas cerradas anticipadamente; la preferencia sobre este punto ya está resuelta.
- Se actualizaron el resumen, requisitos y esta bitácora, y se guardaron su mensaje, actualización visible y respuesta final en conversacion.md. No hubo cambios de código, base, configuración, migraciones o Git; no se repitieron pruebas por esta confirmación documental.
- Los pendientes de guardar la mejora de aguinaldo en Git y actualizar producción cuando el usuario lo solicite siguen vigentes.

### 2026-10-12 — Commit de aguinaldo e historial salarial

- El usuario pidió dejar listo el commit para subir la mejora de aguinaldo a Git. Se revisaron cambios y rama main, con d9a9ad7 como commit anterior de correo; el índice estaba vacío.
- Se incluyeron 12 archivos: README.md, conversacion.md, proyecto.md, package.json, public/app.js, server/app.js, server/aguinaldo.js, db/003-aguinaldo.sql y pruebas de aguinaldo, integración, navegador y respaldo.
- git diff --check y git diff --cached --check pasaron. git check-ignore confirmó exclusión de .env, .local, backups, test-results y node_modules. No se incluyeron salarios reales, archivos internos de PostgreSQL ni credenciales.
- Se creó el commit local «Agregar aguinaldo e historial salarial mensual» en main. Se incorporaron al mismo commit la memoria y respuesta final mediante amend del commit recién creado, sin modificar historia publicada. El identificador vigente se consulta con git log -1 --oneline.
- No hubo cambios funcionales ni se repitieron las pruebas ya aprobadas durante implementación; sus resultados siguen documentados. Se conserva el filtro de periodos terminados confirmado por el usuario. No se hizo push, nueva migración, respaldo, configuración de correo o despliegue en producción durante esta tarea de Git.
- Próximo punto: subir con git push desde desarrollo; en producción seguir ACTUALIZACIONES.md y aplicar db:migrate después del respaldo/descarga. La tabla nueva preserva las nóminas y empleados existentes; los históricos reales se completarán en producción.

### 2026-10-12 — Instrucciones detalladas para actualizar el servidor con aguinaldo

- El usuario pidió explicación en el chat para git pull y cambios necesarios de base en la otra computadora. Se trató como instrucciones, sin ejecutar una actualización por su cuenta.
- Se revisaron ACTUALIZACIONES.md, README, db/003-aguinaldo.sql, package.json y los scripts de migraciones, respaldo y arranque. Git local confirmó 2e3acad como último commit y el estado limpio al comenzar; no se inspeccionó el remoto o el servidor.
- La migración únicamente crea salary_history y el ejecutor omite los nombres ya aplicados. npm start también llama a migraciones, pero se indicó ejecutarlas previamente para verificar errores antes de arrancar la aplicación.
- Se detallaron push previo desde desarrollo, coordinación sin usuarios operando, Ctrl+C de Node sin detener PostgreSQL, carpeta correcta/main/estado limpio y versión previa, backup verificado y copia separada, pull --ff-only, comprobación de commit/archivo nuevo, npm ci, db:migrate y arranque con la configuración de red original.
- Se explicó que no se crean tablas manualmente ni se reinicializa/restaura la base para actualizar, y se conservan .env/.local. Si falla un comando se detiene el flujo; no se fuerza Git o se borra una tabla para eludir el fallo.
- Se describieron verificación de empleados/nóminas previas, Ctrl+F5 y carga de brutos históricos mensuales, sin duplicar nóminas del mismo mes. Continúa el filtro temporal confirmado; las quincenas cerradas con fin posterior al corte no suman todavía.
- Fuentes técnicas consultadas: documentación oficial de git pull y npm ci. Se amplió ACTUALIZACIONES.md con una sección específica y se guardó el intercambio completo en conversacion.md.
- No se ejecutaron respaldo, instalación, migración, restauración, arranque, push o comandos en producción; no se modificó código funcional ni se repitieron pruebas. Pendiente: el usuario debe realizar los pasos y comunicar cualquier error sin credenciales.

### 2026-10-12 — Análisis de Caja y renta automáticas (sin implementación)

- El usuario pidió analizar una tercera mejora: sección de Configuración para porcentaje de Caja y niveles de renta, con cálculo automático. Expresamente indicó «aun no hagas nada»; se respetó y solo se actualizó la memoria de conversación/trabajo.
- Se revisaron las reglas actuales de nómina y payrollAmounts: base quincenal + comisiones = bruto; Caja y renta aún son entradas manuales independientes. La automatización planteada sustituirá esa operación cotidiana únicamente si el usuario autoriza implementarla después.
- Se consultaron referencias oficiales vigentes para 2026: calculadora para patronos de CCSS, anuncio sobre incremento IVM y tabla PDF TramosRenta2026 del Ministerio de Hacienda. La página de CCSS tiene una FAQ con tasas anteriores y una calculadora con las actualizadas; se tomó el bloque 2026 corroborado por el anuncio IVM. Las aperturas directas de CCSS agotaron tiempo, pero la búsqueda recuperó el contenido oficial; el PDF de Hacienda sí se abrió y se recuperó su tabla.
- Tasas obreras generales verificadas: SEM 5,50 %, IVM 4,33 %, subtotal CCSS 9,83 %; Banco Popular 1,00 %, total conjunto 10,83 %. Distinguir aportes patronales de rebajos del trabajador. Fuente: https://aissfa.ccss.sa.cr/patronos y https://aissfa.ccss.sa.cr/noticias/noticia?v=822124515110.
- Para asalariados, la tabla de Hacienda 2026 es mensual y progresiva; se conservará la referencia https://www.hacienda.go.cr/docs/TramosRenta2026.pdf. Se verificaron también créditos mensuales por hijos/cónyuge, sujetos a derecho/declaración; no aplicarlos por el solo hecho de registrar parentesco.
- Propuesta (todavía no decisión aprobada): Configuración con tasas/componentes y tramos por vigencia, validación de rangos, historial/autor y referencia; cálculo sobre bruto salarial de los rubros actuales, valores mostrados automáticamente en nómina y explicación en colilla. Guardar la versión de reglas/bases utilizadas al cerrar y conservar nóminas anteriores.
- Propuesta quincenal: por ser la renta mensual, estimar la primera retención y conciliar la segunda con ingreso bruto real del mes menos renta retenida previamente. Una alternativa es toda la renta en la segunda quincena; queda por decidir. No asumir que aplicar directamente el umbral mensual a cada quincena sea correcto, ni duplicar la primera comisión para proyectar el mes. Casos con retención previa superior necesitarán ajuste documentado.
- Consideraciones planteadas: créditos familiares en el perfil con vigencia, pensionados/base mínima contributiva y entradas/salidas parciales; aplicación inicial desde el comienzo de un mes para no mezclar manual/automático sin conciliación; préstamos y otros rebajos continuarían manuales. Aguinaldo conserva sus ingresos brutos y no cambia por automatizar deducciones.
- Preguntas pendientes: si Caja agrupa Banco Popular, modo de repartir renta entre quincenas y si hay pensionados o créditos fiscales ya aplicados. No se crearon tablas, pantallas, pruebas, commits o configuraciones ni se tocó producción. El siguiente paso es recibir las preferencias y, solo si luego se autoriza, diseñar la migración y cálculos con pruebas contra las tablas oficiales.

### 2026-10-12 — Precisiones de Caja, aporte patronal y renta del mes anterior (solo propuesta)

- El usuario seleccionó «faltan» de la respuesta anterior y confirmó Caja total obrero configurable, reporte separado de obligaciones patronales por empleado/quincena y total solo para administradores, tramos de renta editables, ausencia de créditos fiscales y retención deseada del mes anterior en la primera quincena. Se preservó la anotación y el mensaje completo en conversacion.md.
- Reiteró varias veces no implementar. Solo se revisaron documentación, ejecutor de migraciones y fuentes públicas; no se crearon archivos funcionales, tablas, pruebas o configuración. No se accedió al servidor ni a datos de empleados.
- Se propuso configuración global por vigencia: tasa obrera, tasa patronal independiente y tabla de renta progresiva. La colilla del trabajador mostraría solo sus rebajos; el reporte administrativo mostraría bruto, obrero, patronal, suma a CCSS y renta retenida a trasladar a Hacienda. La renta retenida no se convierte en una contribución adicional propia del patrono.
- La regla de usar el mes anterior quedó comprendida como requisito operacional solicitado, no como aprobación de su legalidad. Se investigó que la Ley 7092 contempla retenciones cuando se paga/acredita renta y se distinguió retención al empleado de entero a Hacienda. Fuente oficial recuperada por búsqueda: https://sinalevi.go.cr/ResultadosNormativa/Informacion?param1=10969&param2=94458&param3=3&param4=63839. Algunas páginas de PGR redirigen a una interfaz dinámica sin el texto; no se usaron borradores de resoluciones ni normas derogada como fundamento definitivo.
- Se propuso vincular cada deducción con su mes de origen para evitar duplicados; pedir datos completos antes de calcular, conservar nóminas cerradas, guardar tasas/bases y mostrar pendientes si falta ingreso, hay salida sin pago siguiente o rebajo superior al disponible. Los controles y pantallas todavía no están implementados.
- Transición: elegir inicio y registrar meses cuya renta ya fue cobrada para no duplicar manual/automático. El porcentaje patronal y situaciones como pensionados deben confirmarse. El reporte quincenal sería control/provisión, con consolidado mensual para contrastar obligaciones reales.
- Producción: se recomendaron dos entregas verificables (aguinaldo primero, deducciones después), respaldo antes de cada actualización y conservación de .env/.local. El ejecutor puede aplicar 003 y una futura 004 en orden con un único db:migrate si llegaran juntas, saltando lo ya aplicado; se mantiene el protocolo de detenerse ante errores. No existe migración 004 todavía.
- Se actualizaron resumen, requisitos/pendientes y memoria; no se hicieron commits, push, pruebas o despliegue. Próximo punto: recibir aclaración de retención/entero, pensionados y datos de transición; luego esperar la autorización expresa de implementación.

### 2026-10-12 — Corrección: renta del mismo mes completa en primera quincena

- El usuario explicó que había indicado mal el mes de renta. Las comisiones se pagan en la primera quincena, lo que permite estimar el bruto mensual completo (base mensual + comisiones) y retener la renta en esa primera quincena. Confirmó que no hay trabajadores pensionados y reiteró no implementar.
- Ejemplo original conservado: base mensual 600 mil, comisiones 800 mil en primera; primera bruta 1.100.000, segunda bruta 300.000, mensual bruto 1.400.000. Se volvió a consultar el PDF oficial de tramos 2026 de Hacienda: renta sin créditos = (1.347.000 − 918.000) × 10 % + (1.400.000 − 1.347.000) × 15 % = 50.850.
- Se actualizó el resumen, requisitos y pendientes para sustituir el mes previo y cerrar la duda de pensionados. Los mensajes/bitácoras anteriores quedan como historial de lo que se dijo, sin reescribirlos.
- Se explicó que un cambio posterior de ingresos (entrada/salida, ajuste salarial u otro evento) requiere revisar la diferencia respecto de lo previsto, preservando colillas cerradas. No se asumió una regla de ajuste automático todavía.
- Solo se actualizó documentación de continuidad; no se cambió código, configuración, SQL, Git o producción ni se repitieron pruebas. Caja/renta siguen manuales. El plan futuro de entregar aguinaldo 003 y luego deducciones por una nueva migración permanece vigente; esperar autorización antes de implementar.

### 2026-10-12 — Propuesta de excepciones y entrega gradual a producción (sin implementación)

- El usuario aceptó que debemos prever excepciones y dio el caso de una incapacidad posterior a la retención que reduce salario/renta. Solicitó integrar todos los acuerdos y explicar ejecución, reiterando «aun no hagas nada» y que aguinaldo todavía no se trasladó a producción.
- Se revisaron payrollAmounts, la tabla payroll_items, la generación PDF, el cálculo de aguinaldo y las migraciones actuales. Se confirmó que el código actual no tiene devolución de renta y cuenta como salarios únicamente gross_cents; no debe simularse una devolución subiendo comisiones u otro importe salarial. Solo existen migraciones 001–003.
- Se consultaron fuentes oficiales de Hacienda (TramosRenta2026.pdf) y MTSS (temas-laborales/index.html). El MTSS distingue subsidios de incapacidad por enfermedad/riesgo de salarios para aguinaldo y explica tratamiento distinto de maternidad. No se usaron reglas del sector público o resoluciones tributarias en proyecto como normativa aplicable definitiva al sector privado.
- Propuesta integral: configuración por vigencias del total obrero, porcentaje patronal independiente y tramos de renta sin créditos; retención prevista completa en primera con salario mensual + comisiones, conciliación del bruto salarial real en segunda, excepción documentada y aprobación explícita del ajuste antes de cerrar. Conservación de primera colilla y origen por empleado/mes.
- Diferencia propuesta = impuesto mensual real − retención neta ya aplicada (cobros menos devoluciones). Positiva: cobro adicional; negativa: devolución; cero: ningún ajuste. Se propone registrar estados pendiente/aplicado/cancelado, autor/motivo, referencias y controlar aplicación única/concurrencia. No se trasladaría una deuda al siguiente periodo ni se permitiría neto negativo por defecto sin tratamiento explícito.
- Ejemplo ilustrativo con cifras, no regla automática de incapacidad: mensual esperado 1.400.000, primera real 1.100.000 y segunda salarial validada reducida a 150.000; mensual real 1.250.000. Renta 2026 sin créditos: prevista 50.850; real 33.200; diferencia −17.650. La devolución se mostraría como concepto separado que aumenta el importe a pagar, sin incrementar bruto salarial, base de Caja o aguinaldo.
- La propuesta de primera etapa permite usar el salario quincenal ajustado existente con motivo, asociado a fechas/referencia del evento. No se propone automatizar subsidios CCSS/INS desde boletas médicas sin reglas adicionales. Separar pagos de distinta naturaleza evita que la pérdida de salario o un subsidio genere bases indebidas; maternidad no se trata igual a incapacidad por enfermedad.
- Reporte admin propuesto: por empleado/quincena y consolidado mensual, bruto salarial, cuota obrera, cuota patronal, total a CCSS, renta cobrada/devoluciones y saldo neto. Colilla: rebajos del trabajador y ajuste de renta explicado, sin costos patronales. Si el impuesto ya fue declarado/pagado, conciliar con contabilidad: el registro interno no rectifica una declaración ni recupera automáticamente fondos de Hacienda.
- Casos previstos: mes incompleto, primera sin cerrar al revisar segunda, cambios de tasas, ingreso/salida, falta de pago posterior, neto insuficiente y excepciones después de cerrar ambas quincenas. Deben quedar pendientes para ajuste documentado sin reescribir nóminas cerradas. Activación recomendada desde primera quincena de un nuevo mes, conservando periodos manuales previos.
- Plan propuesto: actualizar/verificar aguinaldo de commit 2e3acad en producción primero, desarrollar/probar excepciones y deducciones aquí cuando se autorice, crear una futura 004 con campos/tablas compatibles y valores por defecto que conserven el comportamiento histórico, y entregar después por Git y db:migrate. Pruebas relevantes: renta progresiva, primera/segunda sin duplicación, devolución sin efecto en aguinaldo, privados patronales, concurrencia, PDF, respaldo y conservación de filas previas.
- Para cada entrega: detener Node con usuarios fuera, dejar PostgreSQL, backup verificado/copia protegida, pull --ff-only, npm ci, db:migrate, start y comprobación. Si las dos versiones se descargan juntas, el ejecutor aplica 003→004 (cuando exista) en orden dentro de su transacción, omitiendo lo registrado. Se prefiere revisión por entregas; conservar .env/.local y jamás restaurar datos de prueba encima de producción.
- Solo se actualizaron proyecto.md/conversacion.md. No se ejecutaron pruebas, migraciones, commits, push o cambios de configuración/servidor. La definición final de aprobación y liquidación contable de ajustes queda propuesta, pendiente de autorización de implementación.

### 2026-10-12 — Información para comenzar la implementación

- El usuario aceptó la propuesta con «ok me parece» y preguntó qué se necesita para empezar. Se revisaron los acuerdos y estado local: únicamente hay documentación pendiente, sin código de deducciones o migración 004 creada.
- Se explicó que ya existe información suficiente para desarrollar. Valores de tasas y tramos son configurables por el usuario; falta acordar activación por mes para separar nóminas manuales anteriores de las automáticas. Se propuso noviembre de 2026 desde su primera quincena; permanece como sugerencia hasta su respuesta.
- Se conservó el plan de trabajar aquí, preparar/probar migración 004 y actualizar producción por etapas con aguinaldo 003 primero. No se ejecutó ninguna fase en producción ni se repitieron pruebas por esta aclaración.
- Se guardaron mensaje, progreso y respuesta final. Próximo punto: respuesta del usuario sobre inicio y continuación de la implementación con el alcance aceptado; no volver a preguntar por créditos, pensionados o momento ordinario de renta, ya confirmados.

### 2026-10-12 — Implementación: octubre de prueba, noviembre oficial y excepciones

- El usuario respondió al inicio: desea octubre con lo ya ingresado como prueba y noviembre oficial. Se continuó con la implementación aceptada, sin otra ronda de permisos o traslado a producción. Interpretación aplicada: comparación informativa de octubre, conservando sus pagos cerrados; cálculo oficial desde noviembre al configurar/habilitar.
- Se revisaron los acuerdos, código, arquitectura y referencias oficiales de Hacienda/MTSS. Se continuó el uso local de Sites (sin publicación), con la guía de preview local; no se crearon subagentes conforme a AGENTS.md. Dependencias ya instaladas y sin cambios: no se ejecutó instalación adicional.
- Se creó 004-deductions.sql sin editar 001–003: tres tablas nuevas y columnas en nómina con manual/0/null por defecto. No se precargaron tasas empresariales o salarios. La migración fue probada reconstruyéndola en una base temporal con empleados y nóminas manuales cerradas y comparando filas completas antes/después, intactas.
- Nuevos server/deductions.js y server/deduction-api.js; server/app.js integra módulos, cálculo real del servidor, vista previa, reglas/snapshots, control de cierre, modo por mes y bloqueos consistentes. server/domain.js mantiene validación manual y permite diferir validación del neto únicamente para considerar una devolución calculada en modo automático.
- Nuevo public/deduction-views.js y cambios en public/app.js/styles.css para Configuración, comparación, formulario automático con aprobación/excepción, reporte admin/CSV/ajustes. Encabezados de modal quedan visibles al desplazar formularios largos. Comisiones segunda readonly y rechazadas por servidor; Caja/renta automáticas readonly e ignoradas si el cliente intenta alterarlas.
- server/pdf.js añade devolución, referencia mensual/excepción/conciliación sin aporte patronal, y genera comprobante independiente de ajuste. CSV de nómina incluye devolución separada; se comprobó su importe descargando el archivo en navegador. Se conserva la base gross_cents del aguinaldo, sin sumar devoluciones.
- Nuevas tests/deductions.test.js y tests/deductions.integration.test.js incluidas en package.json. Se ampliaron navegador y respaldo para datos de reglas/control/patronal/refund/ajuste. Resultados finales: npm.cmd test 17 aprobadas; npm.cmd run test:integration 26 aprobadas; npm.cmd run test:browser flujo completo aprobado sin errores inesperados; npm.cmd run test:backup 1 aprobada; sintaxis de los seis módulos JS afectados comprobada y git diff --check sin errores.
- Casos comprobados: tramos oficiales y límites; ejemplo 600.000+800.000 con renta 50.850; segunda reducida a 150.000 con devolución 17.650 y bruto sin incremento; neto insuficiente; segunda comisión prohibida; reglas de otro año requieren confirmación; origen de primera obligatorio; previews desactualizadas; filas antiguas conservadas; salida con ajuste posterior; cancelación y dos aplicaciones concurrentes con solo una aceptación; roles admin; activación conjunta de borradores conservando importes; deshabilitar futuros meses no mezcla modos dentro de uno iniciado; mes manual cerrado permanece manual.
- Incidencias corregidas: un selector del navegador asumía puntos de miles pero es-CR usa espacios; se adaptó. La confirmación/nota del formulario automático pasaba por el cálculo manual que buscaba #payroll-net (ausente), generando dos errores de consola; se separó el manejador de input automático y el flujo final pasó limpio. Un reemplazo CSV enviado por pipe PowerShell perdió tildes y falló su comprobación antes de escribir; se reintentó con código ASCII/String.fromCharCode y se verificó el CSV UTF-8. Python disponible era un alias de Microsoft Store, no un intérprete instalado; no se instaló para visualizar PDF. PDFs se comprobaron por respuestas/estructura y descarga; capturas HTML se inspeccionaron con view_image.
- Artefactos en test-results: deduction-settings.png, deductions-trial.png, deductions-refund.png, deductions-refund-mobile.png, employer-report.png y payslip-refund.pdf; ficticios, ignorados. Se inspeccionaron comparación, reporte y móvil. Los servidores/bases propios de pruebas se cerraron mediante helpers; no se detuvo el Node que el usuario utiliza ni PostgreSQL del proyecto/otro servicio.
- Se aplicó npm.cmd run db:migrate en desarrollo con «Base de datos actualizada». Comprobación de solo lectura, restringida a 127.0.0.1:55432/circuito_rrhh: 004 registrada, control deshabilitado, dos periodos octubre 2026 (primera/segunda) cerrados y manuales con una fila cada uno. No se consultaron nombres, importes u otros datos personales; no se modificaron sus registros.
- Se creó DEDUCCIONES.md y se actualizaron README/ACTUALIZACIONES/proyecto/conversación. Se explica configurar ambos porcentajes en cada entorno, tramos de referencia editables, activar nuevos meses, convertir borradores juntos y mantener manuales meses ya cerrados. Reglas reales no ingresadas en desarrollo, ni credenciales o .env modificados.
- Límites explícitos: no calcula subsidios desde boletas, no automatiza bases mínimas contributivas o todas las licencias, no presenta declaraciones/pagos ni ejecuta transferencias. Ajuste posterior concilia retención sobre salarios ya registrados, sin corregir salarios de colillas cerradas; esa corrección requiere un procedimiento adicional con contabilidad. No se incorporaron créditos fiscales o pensionados, conforme a los acuerdos.
- No se hizo commit/push de deducciones ni despliegue. Producción sigue pendiente de aguinaldo según el usuario: entregar/verificar 003 de 2e3acad y después 004 de esta mejora; si llegan juntas db:migrate las aplica en orden y salta lo existente. Mantener respaldos y .env/.local del servidor, sin restaurar bases de prueba. Próximo punto: reiniciar Node local y probar desde Configuración; después crear commit/subir/actualizar cuando el usuario lo pida.

### 2026-10-13 — Consulta sobre fecha de corte de vacaciones

- El usuario preguntó por la diferencia entre fecha de ingreso y fecha de corte al crear un empleado. Se revisaron README.md, employeeInput/validateVacation de server/app.js y vacationBalance de server/domain.js.
- El ingreso original determina los meses completos acumulados. El corte histórico delimita, inclusive, el total de días ya disfrutados a descontar. No reinicia acumulación ni es vencimiento. Nuevas vacaciones individuales requieren inicio posterior al corte para evitar doble descuento; el corte debe estar entre ingreso y hoy.
- Ejemplo explicado: ingreso 16/06/2020, histórico de 40 días disfrutados hasta 30/09/2026; corte 30/09/2026 y movimientos nuevos desde 01/10/2026. Histórico es días utilizados, no días disponibles. Si no hay histórico, dejar cero y corte vacío.
- Solo se actualizaron conversacion.md y proyecto.md; no se cambió código ni base de datos, ni se repitieron pruebas funcionales por una consulta explicativa. Deducciones siguen pendientes de commit y traslado a producción según el estado anterior.

### 2026-10-13 — Aclaración sobre vacaciones posteriores al corte

- El usuario preguntó si se siguen contando los días después del corte y si solo pueden descontarse al disfrutarlos. Se confirmó en README.md, vacationBalance de server/domain.js y validateVacation de server/app.js que la acumulación continúa según meses completos desde el ingreso; el corte no cambia los aniversarios ni detiene acumulación.
- Las vacaciones posteriores se descuentan mediante movimientos individuales, no aumentando el histórico por cada solicitud. Fechas futuras aprobadas se reservan y reducen disponible desde la aprobación; al llegar sus fechas pasan a disfrutadas sin un segundo descuento. Se aclaró esta diferencia para evitar afirmar que el disponible solo disminuye después del disfrute.
- Solo documentación de continuidad actualizada, sin cambios de código o datos. No se repitieron pruebas funcionales por esta explicación. Se conserva el pendiente de commit y actualización de producción de deducciones.

### 2026-10-13 — Consulta sobre privacidad del aporte patronal

- El usuario pidió confirmar que el aporte patronal no sale en la colilla ni es accesible al empleado. Se revisaron server/pdf.js, el orden de adminOnly e installDeductionRoutes en server/app.js, la ruta de correo que reutiliza payslipPdf, server/auth.js, README.md y DEDUCCIONES.md.
- Confirmado por código: la colilla contiene caja_cents (rebajo obrero), sin incluir employer_cents o porcentajes patronales; el correo adjunta el mismo PDF. Reporte Aportes y renta y configuración están después del middleware adminOnly, que devuelve 403 a roles distintos de admin. Se consultó el caso de prueba existente de autorización sin volver a ejecutarlo.
- Se explicó que el aporte patronal es visible solo al administrador y no reduce el neto del empleado. Se aclaró que el portal de empleados aún no está habilitado, evitando presentarlo como funcionalidad disponible.
- Solo cambios de memoria, sin modificar código, datos, credenciales o producción. No se enviaron correos ni se repitieron pruebas funcionales por esta consulta. Pendientes anteriores de commit y traslado de deducciones se conservan.

### 2026-10-13 — Carga autorizada de 15 empleados ficticios en desarrollo

- El usuario pidió 15 empleados variados con ingresos de hace uno/dos años y de meses recientes, todos los datos rellenados, únicamente para desarrollo. Pidió conservarlos y borrarlos después cuando lo ordene. Se implementó una carga local, sin crear una migración o mecanismo que se ejecute en producción.
- Se usaron `.local/demo-employees.mjs` y `.local/verify-demo-employees.mjs`, ignorados por Git. El cargador comprueba carpeta absoluta autorizada, conexión loopback, puerto 55432, base circuito_rrhh, directorio del clúster en postmaster.pid y corte 2026-10-13. Rechaza repetir el lote. No imprime contraseñas ni conexiones. No se modificó .env ni otro PostgreSQL.
- Antes de escribir se ejecutó scripts/backup.js con resultado correcto: backups/circuito-2026-10-13T21-40-43-290Z.dump. En esta tarea se verificó su generación, sin hacer otra restauración de ese respaldo. La carga se realizó en una sola transacción con bloqueos y comparación de todas las filas preexistentes de empleados, cuentas, empresa, feriados, vacaciones, salarios históricos, nóminas, correos, reglas/control y ajustes. Todas quedaron iguales; solo se añadieron los datos del lote, el avance normal del contador y su auditoría.
- Creados 15 perfiles activos CC0003–CC0017, edades adultas, ingreso 01/10/2024–28/09/2026, salario mensual ₡480.000–₡1.250.000, puestos/departamentos variados. Nombres llevan (PRUEBA); cédulas PRUEBA-20261013-01 a -15; correos empleado.prueba.01@example.test y sucesivos, y teléfonos ficticios 0000-0001 a 0000-0015. Corte histórico 30/09/2026 y notas explícitas de muestra, sin suplantar datos reales.
- 117 salarios históricos mensuales del ciclo diciembre 2025–septiembre 2026 según cada ingreso. Se incluyen bruto base y comisiones ficticias en Comercial; meses de ingreso parcial se prorratearon por días calendario solo para esta muestra, sin incorporar esa fórmula a las reglas de negocio. Se comprobaron fecha de empleo, mes terminado y ausencia de una nómina del mismo empleado/mes. Los 15 tienen acumulado de aguinaldo positivo al corte.
- 20 movimientos de vacaciones posteriores al corte: días disfrutados, medios días, reservas de semanas futuras y medios días futuros. Conteo mediante workingDays y feriados existentes; no se crearon feriados. Hay 3 disponibles negativos al corte por adelantos ficticios documentados. La autorización del usuario para probar saldos negativos y la política acordada permiten estos casos de muestra.
- Las columnas obligatorias created_by/updated_by de vacaciones e históricos referencian al administrador activo existente, sin crear cuentas o cambiar sus datos. La auditoría del script usa actor NULL (Sistema), acción crear_prueba_desarrollo y origen/lote explícitos para distinguir la carga de una acción manual del administrador: 152 eventos añadidos. No se enviaron correos ni se hicieron pagos.
- Manifest local `.local/demo-empleados-2026-10-13.json`, estado committed: conserva UUID de los 15 perfiles, 20 vacaciones, 117 históricos y 152 eventos, más códigos/saldos/ubicación del respaldo. Se escribió antes del COMMIT y se confirmó después, para poder identificar el lote ante un fallo de archivo. Scripts, manifest, respaldo y capturas confirmados excluidos por git check-ignore. Los documentos de memoria solo describen la muestra; no la instalan al descargar Git.
- Verificación: node --check del cargador y ejecución exitosa; consultas/API confirmaron 15 perfiles, 20 vacaciones, 117 históricos, 3 negativos y aguinaldo positivo. Playwright verificó tabla de 15 perfiles filtrados por PRUEBA en escritorio y móvil, aguinaldo y ausencia de errores JS/consola/desbordamiento del documento. Capturas test-results/demo-empleados.png, demo-aguinaldo.png y demo-empleados-movil.png; se inspeccionaron visualmente las dos primeras. No se repitió toda la batería funcional porque no se cambió código de la aplicación.
- Incidencias del verificador local corregidas: el nombre accesible Empleados incluye el conteo, así que una coincidencia exacta no servía; un selector genérico coincidía también con Ver equipo, y se restringió a .nav-item. La tabla no muestra códigos internos y se verificó el UUID del botón de perfil en su lugar. Al volver desde Aguinaldo se reinicia la búsqueda; se rellenó de nuevo antes de comprobar móvil. Eran supuestos del script de comprobación, sin fallo funcional encontrado en la aplicación. El flujo final pasó; las sesiones efímeras propias se eliminaron y el servidor/navegador propios se cerraron en cada intento, sin detener la aplicación del usuario.
- No se añadieron filas a periodos de nómina existentes, especialmente octubre cerrado; las nuevas quincenas que el usuario cree incluirán estos trabajadores según las reglas normales. No se cambiaron tasas o el control de activación, ni se hizo commit/push/despliegue. Los pendientes de producción (aguinaldo 003 y deducciones 004) permanecen.
- Próximo punto: el usuario revisará Empleados, Vacaciones, Reportes y Aguinaldo y podrá preparar nuevas quincenas de prueba. **Cuando ordene limpiar**, leer el manifest y verificar la conexión de desarrollo; localizar también relaciones nuevas que haya generado al probar (nómina, correos, cuentas, ajustes). Eliminar selectivamente solo UUID del lote y dependencias autorizadas; no borrar toda la base, periodos compartidos o cuentas existentes. Mantener registro de la limpieza y el consecutivo CC sin retroceder. No ejecutar limpieza por inferencia mientras solo solicita otra mejora.

### 2026-10-13 — Completar muestra de nómina y aporte patronal

- El usuario indicó que los empleados de prueba no aparecían en Nómina ni Aportes. Se aclaró y corrigió el alcance anterior: solo se habían cargado perfiles, vacaciones e históricos de aguinaldo; los históricos mensuales no generan nóminas o aportes.
- Verificación local restringida a la base de desarrollo: únicamente estaban las dos quincenas de octubre cerradas/manuales con una fila cada una. El usuario ya había configurado control enabled=true/revision=2 y reglas con vigencia 01/10/2026, worker_bp=1080/employer_bp=2600, referencia Caja y Hacienda. Estos valores son los ingresados en esta base, no una afirmación de porcentajes normativos vigentes. Se reutilizaron tasas y tramos existentes, sin reemplazarlos.
- Nuevos scripts locales ignorados `.local/demo-payroll.mjs` y `.local/verify-demo-payroll.mjs`. Antes de operar se comprobaron carpeta absoluta, loopback/55432/circuito_rrhh, directorio del clúster, existencia del lote anterior y ausencia de periodos de noviembre. Se rechaza repetir el proceso. Respaldo previo generado: backups/circuito-2026-10-13T21-53-32-897Z.dump; no se volvió a restaurar en este turno.
- Se usó createApp en un servidor loopback efímero y una sesión administrativa efímera para ejecutar los endpoints reales: crear periodo, vista previa de deducciones, revisión/guardado y cierre. No se modificaron cuentas/contraseñas ni se revocaron sesiones del usuario; la sesión propia se eliminó en finally y el servidor propio se cerró. Cada operación usa la transacción y validaciones normales del API; el manifest guarda progreso tras cada paso para detectar una carga parcial. Estado final completed.
- Se crearon noviembre primera y segunda, modo automático, ambas cerradas. Cierre valida plantilla completa, por lo que incluyen 17 perfiles por periodo: los 15 del lote y los 2 preexistentes. Total 34 filas nuevas, de las que 30 corresponden a los nuevos perfiles. Los dos anteriores recibieron solo sus valores de base/configuración en estos periodos nuevos, sin modificar sus perfiles o nóminas anteriores. Se anotó PRUEBA DE DESARROLLO en los motivos de estas filas.
- Las filas del lote incluyen comisiones variadas en primera (Alejandra: 800.000; Diego: 500.000; otras en Comercial), préstamo 15.000 para algunos y otros rebajos 5.000 con referencia para otros. Segunda sin comisiones, con salario de Alejandra ajustado de 300.000 a 150.000 y excepción ficticia documentada 16–30/11, referencia PRUEBA-NOV-2026-001. El API propuso y recibió aprobación/motivo de conciliación: devolución 17.650, sin sumar al bruto.
- Reporte de noviembre completo (17 personas, ambas quincenas cerradas): bruto ₡14.120.000; Caja obrera ₡1.524.960; patronal ₡3.671.200; renta cobrada ₡195.500 y devolución ₡17.650. Son cifras de desarrollo, no un pago real. Se comprobó ausencia de reglas faltantes/borradores, 30 filas del lote en reporte y endpoint PDF de segunda de Alejandra, HTTP 200/estructura PDF.
- Antes/después se compararon todas las filas anteriores de empleados, cuentas, empresa, feriados, vacaciones, salarios históricos, nóminas, correos, reglas/control, ajustes y contador. Permanecieron idénticas. Solo se añadieron los dos periodos y sus filas/auditoría; no se enviaron correos, generaron transferencias, modificaron reglas o conectaron producción. Las nóminas nuevas de noviembre siguen posteriores al corte del aguinaldo actual; se conserva el criterio aceptado.
- El manifest del lote previo incorpora payroll_extension con backup, regla utilizada, periodos/estado, todas las filas (incluidas las cuatro de perfiles anteriores) y totales. Para futura limpieza, los dos periodos pertenecen a esta extensión de prueba y sus filas se identifican por UUID; verificar cambios/dependencias nuevas antes de eliminar. No usar un borrado genérico de empleados o periodos compartidos.
- Validación visual detectó desbordamiento real a 448 px en viewport 390 por tarjetas monetarias del reporte. public/styles.css cambia las dos columnas móviles a minmax(0,1fr); public/deduction-views.js aplica clase money a las cuatro tarjetas de importes, usando la fuente monetaria responsive existente. No cambió ninguna fórmula o regla de negocio. Transformación local UTF-8 en `.local/format-report-money.mjs`, ignorada.
- Verificación final: sintaxis del cargador y módulo frontend correctas; carga vía API aprobada, preservación anterior comprobada; Playwright aprobó apertura de ambas nóminas, 15 nombres PRUEBA por quincena, reporte noviembre con 34 filas/aportes configurados/devolución visible y vista móvil sin desbordamiento o errores JS/consola. Capturas test-results/demo-nomina-primera.png y demo-aportes-noviembre.png; primera inspeccionada con view_image. git diff --check pasó y scripts/manifest continúan ignorados. No se repitió la batería de cálculo/integración/respaldo, al no cambiar cálculos ni esquema.
- Incidencias de herramientas: una consulta de metadatos en stdin tenía un paréntesis faltante y falló antes de ejecutarse; se corrigió. Un rg con comillas PowerShell dobles mal escapadas fue rechazado por el shell; se reintentó con comillas simples. El verificador asumía una etiqueta Devolución en la tabla de nómina, que solo tiene el neto; se verificó en Aportes, donde sí hay columna. El primer patch CSS esperaba una regla distinta y no escribió; se corrigió usando la regla existente. Tras corregir el desbordamiento real el flujo final pasó.
- Próximo punto: recargar con Ctrl+F5; Nómina → abrir noviembre primera/segunda; Aportes y renta → año 2026, mes noviembre, Todo el mes, Consultar. Si el usuario pide seguir probando ediciones, preparar nuevos borradores; estas muestras quedaron cerradas para que los totales superiores se vean. Limpieza sigue pendiente de su orden expresa. No se hizo commit/push/despliegue; el pequeño ajuste visual queda incluido en los cambios de deducciones pendientes de commit.

### 2026-10-13 — Ampliación anual noviembre 2025 a octubre 2026

- El usuario pidió datos desde noviembre del año pasado hasta este año para revisar nómina, aguinaldo, Caja, renta, vacaciones y demás. Se interpretó hasta octubre 2026, mes actual del contexto, conservando noviembre 2026 ya creado. No se cambió el corte de aguinaldo ni se realizó un despliegue.
- Se revisaron memoria, README, fuentes de nómina/deducciones/saldos, manifest y estado real. Solo había octubre y noviembre 2026; 117 históricos activos del lote y ningún histórico activo ajeno. Se confirmó regla del administrador vigente 01/10/2026 con 10,80 % obrero y 26 % patronal. Los 2 perfiles anteriores participan en nóminas nuevas según sus fechas de ingreso, sin cambiar sus datos.
- Cargador local ignorado .local/demo-year.mjs: comprueba ruta autorizada, loopback/55432/circuito_rrhh, directorio del clúster y fecha del corte. Rechaza repetición y exige que noviembre 2025–septiembre 2026 estén libres. Respaldo previo generado correctamente: backups/circuito-2026-10-13T22-08-16-666Z.dump. No se probó otra restauración en este turno.
- Carga de fixtures únicamente en desarrollo, mediante una transacción SQL con bloqueos y aserciones. No se creó un mecanismo de edición de nóminas cerradas en la aplicación o una migración que instale muestras. Los datos históricos se insertaron cerrados/manuales para respetar el inicio oficial desde noviembre 2026. Octubre recibió filas adicionales solo de los 15 ficticios en los periodos cerrados existentes: amplía sus totales de prueba, sin modificar ninguna fila salarial anterior ni metadatos de cierre. No aplicar este procedimiento a nóminas reales de producción.
- Dos reglas nuevas: 01/11/2025 y 01/01/2026, copias de tasas/tramos configurados actualmente, con referencias SIMULACIÓN histórica que aclaran que no validan porcentajes o tramos legales de esos años. La regla actual desde octubre y el control permanecen idénticos; noviembre automático conserva sus snapshots. Aportes en periodos manuales se muestran como estimaciones usando estas reglas de simulación.
- Los 117 históricos ficticios se retiraron (active=false, revisión/nota/auditoría), sin borrarlos. Se recuperó exactamente su bruto mensual y se distribuyó entre quincenas dentro de la relación laboral. En ingreso después del día 15, el bruto agregado se presenta como salario ajustado de segunda con referencia a reconstrucción ficticia, sin inventar empleo en primera. Importes parciales de muestra no introducen una fórmula automática de prorrateo en el programa.
- Se crearon 22 periodos noviembre 2025–septiembre 2026 y se añadieron 30 filas ficticias a octubre. Total 318 filas nuevas: 279 de los 15 ficticios y 39 de los 2 anteriores en nuevos periodos. Se incluyen comisiones comerciales en primera, Caja/renta de simulación, préstamos/otros rebajos con motivos y límites que evitan neto negativo, importe patronal separado y snapshots. La renta conocida se asigna a primera o a segunda si el ingreso fue posterior a primera. No se ejecutaron transferencias/pagos ni correos.
- Con la muestra anterior quedan 26 periodos y 354 filas. Se comprobó que todas las filas están revisadas, no hay salarios anteriores al ingreso/posteriores a salida ni históricos activos superpuestos. Las nóminas nuevas de noviembre 2025 pertenecen al ciclo de aguinaldo 2025; para 2026 el ciclo comienza en diciembre 2025.
- Para los 15 perfiles se repartió el antiguo ajuste de vacaciones entre un pequeño histórico previo a noviembre 2025 y fechas individuales desde noviembre o su ingreso posterior hasta septiembre 2026. Corte 31/10/2025 para quienes ingresaron antes; sin ajuste/corte previo para los demás. Se añadieron 68 fechas laborales únicas, incluidos medios días, respetando feriados existentes. Se conservaron 20 movimientos previos: 88 del lote en total. Se compararon saldo/disponible antes y después por persona, idénticos, incluidos los 3 negativos. Solo se cambiaron los ajustes y revisiones de perfiles ficticios, no salarios/ingresos/datos básicos.
- Aguinaldo: bruto y acumulado de los 15 al corte 13/10/2026 idénticos antes/después, ahora obtenidos de nóminas en lugar de históricos activos. Cero quincenas pasadas pendientes para los ficticios. Octubre/noviembre 2026 siguen excluidos mientras el fin de cada quincena sea posterior al corte, conforme a la decisión del usuario.
- Comparación transaccional de filas previas: solo se permitieron los cambios previstos en los 15 ajustes de perfil y 117 históricos retirados. Cuentas, empresa, feriados, vacaciones anteriores, periodos y filas anteriores de nómina, correos, control/regla de deducciones anterior, ajustes tributarios y contador CC quedaron idénticos. No se cambió .env, el otro servicio PostgreSQL, producción o código de negocio.
- Manifest year_extension registra intervalo, respaldo, 24 periodos (22 nuevos/2 existentes), 318 filas, 117 históricos archivados, 68 vacaciones, 2 reglas, cambios de ajustes, auditoría y total de aguinaldo. Se escribió preparado antes del COMMIT y confirmado completed después; ante fallo SQL se revierte la transacción. Limpieza futura: preservar los periodos originales de octubre y sus filas anteriores; eliminar únicamente UUID del lote y sus dependencias autorizadas. Las 39 filas nuevas de los perfiles anteriores también son fixtures de esta extensión; sus perfiles se preservan.
- Verificaciones: node --check y ejecución exitosa del cargador; aserciones de preservación, saldos/aguinaldo y fechas/superposición aprobadas. .local/verify-demo-year.mjs probó API de 24 periodos y 12 reportes mensuales, con cuotas obrera/patronal positivas, sin reglas faltantes/borradores; 15 aguinaldos positivos con cero pendientes y suma igual al manifest; 88 vacaciones y 3 negativos actuales. Playwright pasó lista de 26 periodos, apertura de diciembre 2025, Aportes de marzo 2026 según fechas de ingreso, aguinaldo y viewport móvil sin desbordamiento/errores JS o consola.
- Capturas locales: test-results/demo-nomina-diciembre-2025.png, demo-aportes-marzo-2026.png, demo-aguinaldo-nominas.png; última inspeccionada con view_image. Cargador/verificador/manifest/capturas ignorados según git check-ignore. git diff --check pasó. No se repitió la batería funcional general: no hubo cambios de fórmulas, código o esquema. Servidor, navegador y sesión efímeros del verificador se cerraron/eliminaron sin detener la aplicación del usuario.
- Un primer intento de guardar esta documentación falló por una cadena JavaScript multilínea inválida antes de escribir archivos; se corrigió el envío. No hubo fallos de la carga SQL o de la verificación final.
- Próximo punto: Ctrl+F5, abrir nóminas de cualquier mes del intervalo, elegir año/mes en Aportes y renta, revisar fechas en Vacaciones/Reportes y detalle de Aguinaldo. Datos de desarrollo y tasas históricas simuladas. Esperar orden de limpieza y entonces inspeccionar relaciones que el usuario haya creado después. No se hizo commit/push/despliegue; los pendientes de producción se conservan.

### 2026-10-13 — Estado real de Git y sincronización remota

- El usuario preguntó cómo estamos actualmente en Git. Se revisaron rama, estado, últimos commits, diferencias y staging, además de las exclusiones; no se interpretó como una orden de crear un commit o publicar.
- Rama main con upstream origin/main. Se ejecutó git fetch --quiet origin correctamente para evitar basar el estado en referencias locales antiguas. No se imprimió la URL del remoto ni credenciales; el proceso deshabilitó preguntas interactivas y tenía timeout. No se ejecutaron pull/merge/rebase ni cambios de código.
- HEAD y origin/main coinciden en 2e3acad Agregar aguinaldo e historial salarial mensual. git rev-list --left-right --count HEAD...origin/main devolvió 0/0. Correo d9a9ad7 forma parte de ese historial remoto; ambos commits anteriores están subidos. Esto corrige el supuesto documentado de push pendiente, sin atribuir quién lo ejecutó o afirmar que producción ya esté actualizada.
- Pendientes: 12 archivos modificados (ACTUALIZACIONES.md, README.md, conversacion.md, package.json, proyecto.md, public/app.js, public/styles.css, server/app.js, server/domain.js, server/pdf.js, tests/backup.test.js, tests/browser.js) y 7 nuevos (DEDUCCIONES.md, db/004-deductions.sql, public/deduction-views.js, server/deduction-api.js, server/deductions.js, tests/deductions.integration.test.js, tests/deductions.test.js). Incluyen la mejora de deducciones/excepciones, ajuste móvil, pruebas y memoria; ninguno preparado en staging.
- git check-ignore confirmó exclusión de .env, scripts y manifest .local de la muestra, backups, test-results y node_modules. La base con empleados/nóminas de prueba permanece local y no se instalará por Git. git diff --check pasó. Advertencias LF/CRLF al consultar diff fueron informativas de la configuración existente, no errores ni conversiones hechas en este turno.
- Solo se actualizó memoria de esta consulta. No se hizo commit/push, despliegue, cambio de configuración/base o limpieza de muestras ni se repitieron pruebas funcionales. Próximo punto: cuando el usuario lo pida, revisar/guardar deducciones y documentación en un commit, subir y seguir la actualización de producción con respaldo, migraciones y configuración propias del servidor.

### 2026-10-13 — Archivo del resumen anterior (antecedentes, no estado actual)

Se conserva íntegro el texto previo para no perder historial al ordenar el resumen. Incluye afirmaciones de momentos anteriores (base vacía, Git pendiente, muestra inicialmente más corta y propuestas previas) que deben interpretarse según su fecha y bitácora. El apartado 1 recoge el estado vigente revisado.

**Git comprobado contra el remoto el 13/10/2026:** main y origin/main apuntan a 2e3acad (aguinaldo), con cero commits de diferencia tras fetch correcto. Correo d9a9ad7 y aguinaldo 2e3acad ya están en el remoto. Las menciones anteriores a que falta subir esos dos commits quedan superadas por esta comprobación; no se inspeccionó si producción los instaló. Deducciones, migración 004, pruebas, ajuste móvil y documentación siguen sin commit: 12 archivos modificados y 7 nuevos, ninguno en staging. No se hizo commit/push por esta consulta. Base, .env, scripts/manifest de muestra y respaldos siguen fuera de Git.

**Última tarea: muestra anual completada desde noviembre de 2025 hasta octubre de 2026.** Se añadieron 22 periodos históricos manuales y se completaron las dos quincenas de octubre con filas ficticias, conservando los importes anteriores. Son 24 quincenas en el intervalo; noviembre 2026 sigue disponible de la muestra previa, para un total de 26 periodos/354 filas. Los 117 salarios históricos ficticios quedaron retirados y sustituidos por nóminas con el mismo bruto y aguinaldo al corte. Se añadieron 68 vacaciones fechadas: 88 movimientos del lote, sin cambiar disponibles actuales. Dos versiones de deducciones de simulación cubren los meses anteriores; regla actual de octubre y control intactos. Manifest local .local/demo-empleados-2026-10-13.json contiene year_extension completed con todas las referencias. No borrar hasta la orden del usuario ni transferir datos a producción. API de los 12 meses, aguinaldo sin duplicación y navegador escritorio/móvil verificados. Recargar y seleccionar año/mes en Aportes y renta; Aguinaldo 2026 conserva su corte y comienza en diciembre de 2025.

El párrafo siguiente describe la muestra de noviembre que precedió a la ampliación anual; sus datos se conservan, pero la muestra ya incluye los meses anteriores:

Última tarea completada: se completó la muestra con nóminas y aportes porque el usuario indicó que faltaban. **Noviembre 2026, primera y segunda quincena**, ambas cerradas por el flujo normal del API: 34 filas (15 perfiles de prueba más los 2 que ya existían, en cada quincena). Incluyen comisiones, préstamos, otros rebajos y una excepción con devolución de renta de ₡17.650. **Para ver los aportes hay que seleccionar noviembre de 2026**, pues el reporte abre el mes actual, octubre. Configuración de desarrollo verificada: habilitada, Caja obrera 10,80 %, patronal 26 %, tramos del administrador; se reutilizó sin cambiarla. Se preservaron todas las filas anteriores, incluyendo octubre cerrado. Siguen los 15 perfiles CC0003–CC0017, 117 históricos y 20 vacaciones. Manifest `.local/demo-empleados-2026-10-13.json` actualizado con periodos/filas creadas y respaldo; no borrar hasta que el usuario lo ordene. No transferir la base a producción. Además se corrigió un desbordamiento móvil de tarjetas con importes grandes; navegador en escritorio/móvil aprobado.

La primera versión funcional de la aplicación de recursos humanos ya está implementada y verificada. Se ejecuta localmente con HTML/CSS/JavaScript, Node.js y PostgreSQL. No está publicada en Internet.

**Estado actual: deducciones implementadas en desarrollo.** El usuario aceptó el plan y definió octubre de 2026 como prueba y noviembre como inicio oficial. Octubre permite comparación sin cambiar nóminas cerradas; noviembre permite modo automático tras configurar tasas/tramos. Se añadieron configuración por vigencias, Caja obrera, aporte patronal, renta mensual en primera, conciliación/cobro/devolución en segunda con aprobación, excepciones documentadas, reporte privado de aportes y ajustes posteriores con comprobante PDF. `004-deductions.sql` está aplicada **solo aquí**. Últimos resultados de la implementación: 17 pruebas de cálculo, 26 entradas de integración, navegador completo en escritorio/móvil y respaldo/restauración aprobados. No se hizo commit/push de esta mejora ni se actualizó producción. Leer `DEDUCCIONES.md` para configurar y usar. El administrador ya configuró y habilitó tasas/tramos en desarrollo, comprobados al completar nóminas de muestra: 10,80 % obrero y 26 % patronal, vigencia 01/10/2026. No se cambiaron esas tasas ni se verificó o trasladó la configuración de producción; debe gestionarse allí por separado.

El usuario confirmó el 2026-10-12 que el traslado al nuevo servidor ya se completó y que la aplicación está corriendo allí. **La base de esa computadora es producción y la única que importa para conservar los registros de la empresa. Esta computadora es desarrollo/validación; sus datos de prueba no se transfieren a producción.** Este estado es informado por el usuario; no se accedió al servidor para verificarlo.

La mejora anterior es **Aguinaldo e historial salarial mensual**, solicitada después del commit de correo. Está implementada y probada: nueva sección Aguinaldo, acumulado por empleado, detalle diciembre–noviembre, nóminas cerradas y salarios brutos históricos por mes (opción confirmada por el usuario), corrección/retiro/reactivación con auditoría, pendientes y CSV. La fórmula suma los ingresos brutos registrados y divide entre 12. No reconstruye salarios a partir del salario actual ni suma borradores o periodos futuros. `db/003-aguinaldo.sql` agrega `salary_history` y ya se aplicó **solo en desarrollo**. Pasaron 13 pruebas de cálculo, 18 entradas de integración, navegador completo y respaldo/restauración. El usuario pidió guardar esta mejora en Git y se creó el commit local **Agregar aguinaldo e historial salarial mensual** en `main`, con migración, pruebas y documentación. **Falta subirlo al remoto y actualizar producción; no se hizo push ni despliegue.** Para verla aquí: reiniciar Node.js en su terminal y recargar con Ctrl+F5. La explicación de uso está en README.

La mejora anterior es **Enviar correo junto al PDF en Nómina**, guardada en el commit local `d9a9ad7`. El usuario confirmó **contabilidad@circuitocinco.com** mediante **Gmail / Google Workspace**. **Falta configurar la credencial autorizada en el `.env` del servidor y comprobar una entrega real**. No se modificó ningún `.env` ni se envió correo real. Procedimiento: `CORREO_COLILLAS.md`.

Última confirmación: tras entender por qué octubre estaba excluido al corte del 12 de octubre, el usuario indicó «dejalo asi». **Queda confirmado mantener el criterio actual: nómina cerrada y fin del periodo anterior o igual al corte.** La alternativa de sumar al cerrar anticipadamente no se implementará. No hay una decisión pendiente sobre ese filtro. Solo se actualizaron documentos de continuidad; no se consultaron salarios ni registros personales de su base.

Última solicitud: explicación detallada para actualizar el servidor con aguinaldo. Se revisó el commit `2e3acad`, migración y scripts, y se entregó el procedimiento paso a paso: push desde desarrollo si falta; detener Node y conservar PostgreSQL; comprobar rama/estado/versión; respaldo; pull --ff-only; npm ci; db:migrate; arrancar y revisar la interfaz. Se amplió ACTUALIZACIONES.md. No se ejecutaron comandos de producción ni push. Los cambios de documentación de esta explicación quedan sin commit; la mejora funcional sí está en el commit mencionado.

Antecedente (antes de implementar deducciones): Solicitud más reciente: **corrección de la regla de renta, todavía sin implementar**. El usuario aclaró que la renta corresponde al **mismo mes**, se calcula con salario base mensual + comisiones pagadas en la primera quincena y se descuenta completa en esa primera quincena. La segunda recibe la otra mitad del salario base, sin comisiones ni otra retención ordinaria de renta. **Esto sustituye la instrucción anterior de usar el mes previo; no seguir preparando ese desfase.** Confirmó que no hay trabajadores pensionados; ya había confirmado ausencia de créditos fiscales. Caja obrera total y aporte patronal siguen propuestos como porcentajes globales separados configurables, con reporte patronal exclusivo para administradores. Ejemplo confirmado: base mensual ₡600.000 + comisión ₡800.000 = bruto mensual ₡1.400.000; bruto 1.ª ₡1.100.000 y 2.ª ₡300.000. Renta con tramos 2026 sin créditos: ₡50.850. **Caja y renta siguen siendo manuales en el programa; el usuario reitera no implementar.** Queda por prever cómo revisar diferencias si el ingreso real del mes cambia después de la primera quincena. Producción: conservar plan aguinaldo 003, después futura migración de deducciones 004.

Antecedente (antes de implementar deducciones): Última ampliación: el usuario quiere contemplar excepciones, por ejemplo incapacidad después de retener renta que reduce el ingreso real del mes, y pide propuesta/plan completo sin implementar. Se propuso retención mensual prevista en primera, conciliación automática propuesta al revisar segunda, cobro adicional o devolución separado y aprobado por administrador, historial por empleado/mes y protección contra duplicados. La devolución no se sumaría a gross_cents ni al aguinaldo. Las incapacidades se registrarían con motivo/fechas/referencia e importe salarial correcto ingresado por el administrador; salario y subsidios no se mezclarían sin clasificación. Son decisiones propuestas, todavía no funcionalidades. Producción sigue pendiente de aguinaldo según el usuario; se recomienda entrega 003 primero y futura 004 después, con pruebas de migración y respaldos. No crear código/tablas o desplegar sin autorización posterior.

Antecedente (antes de implementar deducciones): Último mensaje: el usuario indicó «ok me parece» respecto de la propuesta integral y preguntó qué hace falta para empezar a implementarla. Se confirmó que el alcance y reglas ya están definidos. Los porcentajes obrero/patronal y tramos se ingresarán en la futura Configuración; no es necesario fijarlos en el chat para construir la mejora. Se consultó el mes de activación para conservar periodos manuales y evitar duplicar retenciones; se sugirió la primera quincena de noviembre de 2026, **todavía no confirmada**. Esta respuesta no implementó código ni migraciones. Al continuar, conservar las preferencias aceptadas y evitar pedirlas de nuevo; identificar respuesta sobre activación y la instrucción de iniciar, sin inferir una orden de actualizar producción.

Se mantiene el flujo de versiones: pruebas locales, actualización de código mediante Git, nuevas migraciones cuando hagan falta, respaldo previo y verificación antes de reabrir el sistema. `ACTUALIZACIONES.md` y AGENTS.md documentan la separación. Correo y aguinaldo ya tienen commits locales en `main`; no se hizo push desde aquí ni se ejecutó una actualización en producción. Para compartir la versión, ejecutar git push y después actualizar el servidor según la guía, con respaldo previo y db:migrate para la nueva migración; no copiar la base de pruebas. El estado real del remoto no se inspeccionó en esta tarea.

El usuario primero había indicado dos ubicaciones distintas, pero interrumpió esa consulta y reemplazó ese escenario por el traslado a un servidor de la LAN. La última indicación prevalece: no seguir preparando VPN o nube por las respuestas anteriores.

Antes de retomar Git, el usuario confirmó que la empresa es Circuito Cinco y solicitó adaptar el estilo al sitio https://www.circuitocinco.com/ y usar el logo adjunto. El cambio está terminado: logo oficial equivalente en mayor resolución, tipografía Montserrat local, blanco/gris/rojo en la interfaz y colillas PDF. El navegador de escritorio y móvil y las 17 entradas de integración pasaron. Se indicó reiniciar npm start en la misma terminal y recargar con Ctrl+F5 para cargar también el nuevo generador de PDF.

La mejora anterior es la sugerencia de códigos internos `CC0001`, `CC0002`, etc., editables por el administrador. Está implementada y probada y su migración ya está aplicada en desarrollo. No se inspeccionó su aplicación en el servidor de producción.

La instrucción permanente del usuario es conservar **toda la conversación** en `conversacion.md` y mantener **todo el contexto de trabajo** en este archivo. `AGENTS.md` indica leer ambos y actualizarlos durante cada tarea. La primera mejora funcional posterior a la entrega es la sugerencia de códigos internos, documentada abajo.

Última comprobación de datos, al terminar la implementación: **0 cuentas, 0 empleados y 0 periodos de pago** en la base de la empresa. Se dejó lista la pantalla de creación del primer administrador. Ese dato es histórico: si el usuario ya abrió la aplicación y cargó registros, verificar el estado actual sin sobrescribirlos.

Último estado de procesos al terminar la implementación: el servidor Node.js de prueba se detuvo y se ejecutó `npm run db:stop` con éxito para el clúster del proyecto. No se detuvo ni modificó el servicio PostgreSQL preexistente. Los procesos pueden haber cambiado desde entonces.

Comprobación posterior, al preguntar por la persistencia: el clúster del proyecto está activo en 55432 y el usuario informa que usa la aplicación. No se consultaron registros de trabajadores, cuentas ni nóminas; los conteos cero de la entrega anterior no deben asumirse como estado actual.

### 2026-10-13 — Revisión de continuidad solicitada por el usuario

- El usuario preguntó si bitácora y conversación estaban totalmente actualizadas y pidió completarlas si faltaba algo. Se revisaron las entradas recientes y su secuencia, las instrucciones AGENTS.md, referencias README, el resumen/pendientes, la bitácora, estado local de Git y último commit.
- Conversación previa: 173 entradas numeradas consecutivas, sin huecos/duplicados ni caracteres de sustitución UTF-8; incluye mensajes, anotaciones, progresos y finales de las muestras y la consulta de Git. Se conserva íntegra y se añaden este mensaje, progreso y respuesta final.
- Se detectó que el resumen acumulaba frases de estados antiguos, aunque la bitácora posterior las corregía. Se reordenó el apartado 1 para distinguir estado actual, muestras, Git, pruebas, producción, pendientes y limpieza. El texto previo se archivó íntegro inmediatamente antes de esta entrada, sin borrar bitácora o modificar mensajes históricos.
- Estado documentado consistente: 15 ficticios, 26 periodos/354 filas, 88 vacaciones, 117 históricos retirados y reemplazados; tasas históricas simuladas; manifest y respaldos locales; limpiar solo cuando el usuario lo ordene. Main/último commit local 2e3acad comprobados en esta revisión; sincronización remota corresponde al fetch del turno anterior, no se repitió.
- Validaciones de memoria: secuencia de conversación, conservación exacta del historial previo, conservación del resumen antiguo en archivo, UTF-8, referencias locales necesarias y git diff --check. No se leyó .env, no se consultó/modificó base, ni se ejecutaron pruebas, limpieza, commit/push o acciones en producción. Solo se cambiaron conversacion.md y proyecto.md; la herramienta .local/update-memory.mjs es local/ignorada.
- Próximo punto: retomar la siguiente solicitud desde el apartado 1 y los detalles de la bitácora, manteniendo autorización separada para commit/push/actualización/limpieza. Conservar todos los registros históricos aun cuando cambien decisiones o comprobaciones.

### 2026-10-13 — Confirmación de que puede crear el commit

- El usuario preguntó «entonces puedo hacer el commit ya?». Se respondió como solicitud de confirmación/instrucciones para que lo ejecute, sin crear ni publicar un commit por inferencia.
- Se verificaron main, 12 modificados/7 nuevos, staging vacío, git diff --check correcto y git ls-files sin .env/.local/backups/test-results/node_modules. git check-ignore confirmó las exclusiones. No hay nuevos archivos ajenos al alcance entre los pendientes.
- Se entregó git add . y git commit -m "Agregar deducciones automaticas y reporte patronal", y git push como paso posterior de publicación. Se aclaró que se incluyen código, migración 004, pruebas y memoria, mientras base/credenciales/muestras permanecen locales.
- Solo documentación de continuidad actualizada. No se ejecutaron add/commit/push, pruebas funcionales o acciones de base/producción. Al retomar, revisar si el usuario ejecutó estos pasos; no asumir que siguen pendientes por la memoria anterior.

### 2026-10-13 — Preparación del commit de deducciones solicitada al asistente

- El usuario aclaró que el asistente debe dejar todo preparado y él hará solo el push. Se toma como autorización expresa de crear un commit local, sin publicación.
- Verificación previa: main/HEAD 2e3acad, 12 archivos modificados y 7 nuevos; índice vacío y git diff --check correcto. Se revisaron migración 004, cambios de estilos/dinero/package, README y memoria de las verificaciones anteriores.
- Se confirmó que .env, .local, backups, test-results y node_modules están ignorados y no hay archivos de esas rutas versionados. Se incluirán solo los 19 archivos esperados de implementación/pruebas/documentación; no se transfiere la base de desarrollo o la configuración de tasas.
- No se repitieron pruebas ya aprobadas: no hubo cambios funcionales posteriores a las últimas verificaciones de la implementación y del ajuste móvil. La memoria conserva sus resultados y distingue que no se ejecutaron de nuevo por crear este commit. No se cambió código, esquema, datos o producción durante la preparación.
- git add seleccionó explícitamente los 19 archivos esperados. git diff --cached --check pasó y se revisaron nombres/estadísticas staged, sin archivos privados o ignorados.
- git commit -m "Agregar deducciones automaticas y reporte patronal" terminó correctamente en main. Incluye 19 archivos (12 modificados/7 añadidos); no se hizo push. Para consultar el hash definitivo usar git log -1 --oneline: el cierre documental se incorpora al mismo commit con amend del commit recién creado, exclusivamente local y no publicado.
- Se guardó la respuesta final en conversación y se actualizó el resumen/pendiente de producción: el commit ya existe; solo publicación y entrega al servidor permanecen. Se incorporan estos dos documentos al commit y se verifica estado limpio/un commit adelantado antes de cerrar. No se modificó código/datos durante este cierre ni se detuvo la aplicación del usuario.

## 13. Protocolo de continuación

1. Leer este documento, después el historial de conversación y las instrucciones de `AGENTS.md`.
2. Identificar la última solicitud del usuario y el alcance autorizado; no implementar automáticamente toda la lista de mejoras futuras.
3. Verificar los archivos y el estado que sea necesario. Si el usuario ya cargó datos reales, preservarlos y trabajar con copias/bases de pruebas cuando corresponda.
4. Para operar localmente, iniciar el clúster del proyecto y el servidor con los comandos documentados. No tocar otros servicios.
5. Hacer el trabajo solicitado; registrar decisiones y cambios en la bitácora.
6. Ejecutar verificaciones adecuadas al cambio, describiendo qué se comprobó y qué no.
7. Agregar los nuevos mensajes y la respuesta final a `conversacion.md`, y actualizar el resumen y pendientes de `proyecto.md` antes de terminar.

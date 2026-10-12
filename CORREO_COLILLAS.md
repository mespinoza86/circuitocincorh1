# Enviar colillas con Google Workspace

Remitente confirmado por el usuario: **contabilidad@circuitocinco.com**, utilizado desde Gmail / Google Workspace.

## Qué hace el botón

En **Nómina**, abra una quincena. Cada trabajador tiene **PDF** y **Enviar correo** uno al lado del otro. El segundo abre una confirmación con remitente, correo actual del perfil del trabajador y enlace al PDF que se adjuntará.

El destinatario no se escribe manualmente en esta confirmación: para corregirlo, edite el perfil del empleado y vuelva a abrir la nómina. Si otro administrador cambia ese correo mientras la confirmación está abierta, el servidor rechazará el destinatario antiguo y pedirá revisarlo otra vez.

Se pueden revisar las direcciones desde un borrador, pero el envío requiere **cerrar la nómina** y tener el correo configurado. Las colillas cerradas conservan sus datos e importes originales; actualizar la dirección de entrega no modifica el PDF histórico.

La fila muestra **Correo aceptado**, **Enviando correo** o **Error de correo**. La aceptación SMTP no acredita recepción ni lectura. Si ya hubo un envío aceptado, aparece **Reenviar correo** y se pide confirmarlo. No hay envío automático al cerrar, ni envío masivo.

## Preparar la cuenta

1. Inicie sesión en Google con **contabilidad@circuitocinco.com**. Estas instrucciones suponen que es una cuenta con acceso propio, no solamente un alias o grupo.
2. Active la verificación en dos pasos, si está permitida por la organización.
3. Abra [Contraseñas de aplicación](https://myaccount.google.com/apppasswords) y cree una para esta aplicación, por ejemplo con nombre «Circuito Nómina».
4. Guarde la credencial directamente en el `.env` del servidor. No envíe esa contraseña por el chat ni la suba a Git.

Google requiere verificación en dos pasos para las contraseñas de aplicación y puede limitar su disponibilidad según la cuenta o las políticas de la organización. Si la opción no aparece, consulte al administrador de Google Workspace; no use la contraseña normal de Gmail. [Ayuda oficial de Google](https://support.google.com/accounts/answer/185833?hl=es).

## Configurar el servidor

Primero actualice el código validado siguiendo [ACTUALIZACIONES.md](ACTUALIZACIONES.md). Esta mejora **no agrega una migración SQL** ni requiere trasladar o restaurar datos.

En la computadora servidor, detenga Node.js con Ctrl+C y edite **únicamente las variables SMTP** del `.env` existente:

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contabilidad@circuitocinco.com
SMTP_PASS=REEMPLAZAR_POR_CONTRASENA_DE_APLICACION
SMTP_FROM="Contabilidad Circuito Cinco <contabilidad@circuitocinco.com>"
```

El valor de SMTP_PASS del ejemplo es un marcador; reemplácelo por la credencial real. Si Google muestra la contraseña agrupada con espacios, ingrese sus caracteres sin esos espacios. El host, puerto, conexión cifrada y autenticación corresponden a la configuración de Gmail para aplicaciones. [Guía oficial de Google Workspace](https://knowledge.workspace.google.com/admin/gmail/send-email-from-a-printer-scanner-or-app?hl=es).

**Conserve DATABASE_URL y los ajustes de red y seguridad del servidor.** No copie el `.env` de desarrollo ni reemplace el archivo completo con `.env.example`. Git no actualiza `.env`: esta configuración se realiza una vez en el servidor y se mantiene entre versiones. Proteja el archivo y su copia de seguridad.

Reinicie desde una terminal con la configuración correcta:

```powershell
npm.cmd start
```

Si ya utiliza un servicio para Node.js, reinicie ese servicio. Las variables SMTP definidas previamente en la terminal o servicio prevalecen sobre `.env`; compruebe que no se esté usando una configuración antigua. Recargue el navegador con Ctrl+F5 después del cambio.

## Comprobar el primer envío

1. Revise el correo del perfil del empleado y los importes de una nómina cerrada.
2. Pulse **Enviar correo**, compruebe **De**, **Para** y **Revisar PDF**, y confirme el envío cuando corresponda.
3. Compruebe el estado en la fila y confirme con el destinatario la recepción, incluida su carpeta de spam.
4. Ante un error, revise credencial, permisos de la cuenta, conectividad del servidor a Internet y SMTP. Si hubo una respuesta incierta, compruebe la recepción antes de reintentar.

La aplicación verifica que la configuración esté completa; no valida la contraseña con Google al abrir la pantalla. La autenticación y entrega reales solo se comprueban al enviar.

## Si Google bloquea las contraseñas de aplicación

El administrador de Workspace puede evaluar un servicio de retransmisión SMTP autorizado. También se puede implementar OAuth2 en una mejora posterior. Esta versión usa SMTP con credencial de aplicación o un servicio SMTP autorizado y **no implementa OAuth2**. No cambie el método de conexión por ensayo sin confirmar las políticas de la cuenta.

## Validación de esta versión

Se probó la API y el navegador con un SMTP simulado limitado a 127.0.0.1, datos ficticios y bases PostgreSQL temporales. Se verificaron adjunto PDF, correo vigente, protección de destinatarios, envíos simultáneos, confirmación de reenvío y registro de fallos. No se enviaron correos reales ni se configuró la cuenta de Google o el `.env` de producción.

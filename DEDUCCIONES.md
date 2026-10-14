# Caja, renta y aporte patronal

La mejora está preparada en desarrollo. Octubre de 2026 es comparación de prueba y noviembre de 2026 es el primer mes oficial. Las nóminas existentes conservan su modo manual y sus importes.

## Activar aquí

La migración `004-deductions.sql` ya se aplicó en esta computadora. Reinicie Node.js con Ctrl+C y `npm.cmd start` en su terminal habitual, y recargue el navegador con Ctrl+F5.

En **Configuración → Configurar deducciones**, ingrese:

- **Vigencia desde:** por ejemplo, 2026-10-01 para comparar octubre y usar esas reglas también en noviembre. Debe ser el primer día del mes.
- **Caja del trabajador (%):** el porcentaje obrero total que decidió la empresa, incluido Banco Popular. Referencia acordada: 10,83 %, editable.
- **Aporte patronal (%):** porcentaje de la empresa, independiente del obrero. No se precarga una tasa empresarial ni se descuenta este aporte al trabajador.
- **Tramos mensuales de renta:** límite superior y porcentaje de cada tramo. El primero es exento; el último no tiene límite. Los porcentajes no disminuyen y los límites aumentan. Se muestran valores de referencia 2026 de [Hacienda](https://www.hacienda.go.cr/docs/TramosRenta2026.pdf), que el administrador debe revisar antes de guardar.
- **Referencia de las reglas:** fuente o revisión contable.
- **Cálculo automático:** habilitado para los nuevos periodos oficiales.

El guardado crea una versión; no reemplaza las versiones anteriores. No se modifican meses automáticos ya cerrados: use una vigencia posterior. Antes de calcular un año nuevo se necesita una configuración de ese año, evitando reutilizar una tabla fiscal antigua inadvertidamente.

La configuración se guarda en PostgreSQL. Configurar desarrollo no configura producción: introduzca los valores reales en el servidor cuando instale esta mejora. No transfiera la base de pruebas.

## Octubre: comparación con lo ya ingresado

Abra una nómina de octubre y pulse **Comparar deducciones** junto al trabajador. La ventana muestra lo registrado y el cálculo simulado: Caja, renta mensual, aporte patronal, devolución si corresponde y neto.

La comparación no guarda rebajos, devoluciones, ajustes o importes de salario y no altera PDF o aguinaldo. Para la segunda quincena se utiliza la primera que esté registrada; si falta, se explica que no puede completarse la comparación. Puede comparar borradores, pero sus datos son provisionales.

La comprobación local al terminar observó las dos quincenas de octubre cerradas y manuales, con una fila cada una; no se leyeron nombres, salarios u otros datos personales. Esas colillas se conservan.

## Noviembre: cálculo oficial

Con configuración habilitada, los **nuevos borradores** desde noviembre se crean en modo automático. Un borrador manual anterior puede activarse expresamente mediante **Activar cálculo automático**; sus pagos deben revisarse de nuevo. No se convierte un mes con alguna quincena manual cerrada: termine ese mes en su modo original para no mezclar retenciones.

La activación convierte los borradores del mismo mes juntos, conserva sus importes hasta la revisión y marca sus pagos como pendientes. Si el mes ya comenzó automático, deshabilitar nuevos periodos no convierte su otra quincena a manual. Si hay una quincena manual cerrada, la otra conserva el modo manual aunque después se habilite la configuración.

En **Revisar pago**, registre salario ajustado cuando corresponda, comisiones de la primera quincena, préstamo y otras deducciones. Caja y renta son valores calculados, de solo lectura. Pulse **Calcular deducciones y revisar** antes de guardar.

La primera quincena calcula renta sobre su bruto salarial más la base prevista de la segunda (normalmente la otra mitad del salario mensual). Una salida conocida antes de la segunda elimina esa base futura. En la segunda se suma el salario realmente registrado de ambas quincenas y se resta la renta neta ya retenida. Las comisiones no se admiten en segunda, según la regla acordada.

Para revisar la segunda debe existir la primera cerrada y automática, salvo un trabajador que ingresó después de la primera quincena. Si falta información, se señala; no se toma como salario cero. Si cambian empleado, reglas o base entre vista previa y guardado/cierre, se exige revisar de nuevo.

El bruto salarial y el impuesto del mes tienen cálculo en céntimos. Caja y aporte patronal se redondean por quincena; los tramos de renta se suman y se redondean una sola vez.

## Excepciones y conciliación

El formulario automático incluye fechas, motivo y referencia de una excepción. Ingrese el **importe salarial correcto** de la quincena y el motivo del salario ajustado. No se automatiza el cálculo de subsidios de CCSS/INS desde una boleta; el administrador valida el importe y naturaleza del pago. La incapacidad por enfermedad/riesgo y la maternidad tienen tratamientos distintos para aguinaldo. [MTSS](https://www.mtss.go.cr/temas-laborales/index.html).

Una diferencia en la segunda quincena se muestra como cobro adicional o **Devolución de renta**. Requiere confirmación y motivo de la conciliación antes de guardar. La devolución aumenta el neto a pagar, pero no el bruto salarial, la base de Caja o el aguinaldo; aparece separada en PDF y CSV. El neto negativo se rechaza y debe resolverse de forma documentada, sin trasladar deuda automáticamente.

## Reporte del administrador y ajustes posteriores

**Aportes y renta** permite seleccionar mes y quincena o todo el mes. Muestra bruto, Caja obrera, aporte patronal, renta y devoluciones. Los totales superiores usan periodos cerrados; los borradores se muestran aparte. En periodos manuales el aporte patronal es estimación con reglas configuradas, identificada como tal; si faltan reglas, se marca incompleto.

El aporte patronal no aparece en la colilla del empleado. Tanto configuración como reportes y ajustes requieren administrador en el servidor. El portal de empleados sigue pendiente.

Para una salida sin otra quincena, o diferencia de retención en ingresos de un mes ya registrado, **Revisar diferencia pendiente** compara la renta de las nóminas automáticas cerradas con las retenciones/devoluciones aplicadas. Si hay diferencia, crea una propuesta. No permite duplicar propuestas pendientes.

**Registrar aplicación** exige revisión contable, referencia y confirmación del cobro/devolución realizado; no efectúa transferencias. La propuesta se revalida antes de aplicarse y no puede aplicarse dos veces. Puede cancelarse dejando historial. **Comprobante PDF** conserva el mes de origen y el motivo; no reescribe las colillas originales.

Esta sección de ajustes corrige **retenciones según salarios ya registrados**; no modifica salarios de nóminas cerradas ni tramita recuperaciones de salario pagado incorrectamente. Una corrección de ingresos cerrados debe revisarse con contabilidad y requiere un procedimiento adicional. Si la renta ya se declaró o pagó, el registro local no rectifica esa declaración ni recupera fondos de Hacienda.

Los informes son control/provisión: no sustituyen la factura o planilla CCSS, no presentan declaraciones ni incorporan automáticamente bases mínimas contributivas o todas las reglas de licencias/subsidios. Contraste los importes con contabilidad antes de pagar.

## Producción

El aguinaldo está en `2e3acad` y su migración es `003-aguinaldo.sql`. Esta mejora utiliza `004-deductions.sql`, sin editar las migraciones anteriores. Conserva periodos previos como manuales y agrega columnas con cero/null; configuración sin activar hasta que el administrador ingrese sus reglas.

Preferencia de entrega: actualizar y comprobar primero aguinaldo; después subir el commit de deducciones, respaldar el servidor, descargar, migrar y comprobar. Siga [ACTUALIZACIONES.md](ACTUALIZACIONES.md). Si ambas versiones llegan juntas, `db:migrate` ejecuta 003 y luego 004, omitiendo las ya aplicadas. No restaure datos de desarrollo ni reemplace .env/.local del servidor.

Esta versión pasó cálculo, integración, navegador y respaldo/restauración con datos ficticios en bases separadas. No se configuraron tasas reales aquí ni se actualizó producción.

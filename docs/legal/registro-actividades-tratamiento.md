# Registro básico de actividades de tratamiento

Versión: 2026-08-30. Responsable: pendiente de completar con NIF y domicilio profesional.

## 1. Consultas y potenciales clientes

- Interesados: personas que contactan voluntariamente por formulario, correo, teléfono o WhatsApp.
- Datos: nombre, correo o número de teléfono, nombre o alias de perfil y contenido de la consulta que la persona decide facilitar.
- Finalidad: responder y, cuando se solicita información sobre un programa, aplicar medidas precontractuales.
- Base: artículo 6.1.b RGPD para medidas precontractuales; artículo 6.1.f para consultas generales, sujeto a ponderación.
- Origen: la propia persona.
- Destinatarios: Vercel como infraestructura, Resend como envío, el proveedor del buzón receptor y Meta/WhatsApp cuando la persona inicia una conversación mediante sus aplicaciones.
- Transferencias: revisar y documentar las garantías vigentes de cada proveedor.
- Conservación: gestión de la consulta y hasta 12 meses desde la última comunicación; bloqueo posterior solo si existe obligación o reclamación.
- Medidas: HTTPS, validación y límites, honeypot, limitación de intentos, sin contenido personal en logs de aplicación, acceso restringido al buzón.
- Regla: el contacto no autoriza publicidad y se solicita no enviar datos sensibles por ninguno de estos canales.

## 2. Newsletter

- Interesados: personas mayores de 18 años que solicitan la suscripción.
- Datos: correo, fecha, origen y versión del consentimiento, token temporal, confirmación y estado de baja.
- Finalidad: enviar artículos y novedades de Olympus Theon.
- Base: consentimiento, artículo 6.1.a RGPD y artículos 21–22 LSSI.
- Origen: la propia persona.
- Destinatarios: base PostgreSQL, Vercel y Resend.
- Transferencias: revisar y documentar DPA, subencargados y garantías vigentes.
- Conservación: mientras esté activa; tras la baja, mínimo de supresión y prueba necesario para no volver a enviar y atender responsabilidades.
- Medidas: casilla separada no premarcada, doble opt-in, token almacenado solo como hash, caducidad de 24 horas y enlace firmado de baja en cada correo.

## 3. Seguridad, administración y registros técnicos

- Interesados: visitantes y persona administradora.
- Datos: IP y metadatos técnicos tratados por infraestructura; cookie técnica de sesión del panel; acciones técnicas y errores sin contenido deliberadamente personal.
- Finalidad: seguridad, autenticación, disponibilidad y diagnóstico.
- Base: interés legítimo en proteger el servicio, artículo 6.1.f RGPD.
- Destinatarios: Vercel y proveedores vinculados de infraestructura.
- Conservación: el mínimo configurable y necesario; revisar la retención real del plan trimestralmente.
- Medidas: área privada, credenciales secretas, cookies seguras, no indexación del panel/API y limitación de intentos en endpoints públicos.

## 4. Métricas agregadas y lecturas

- Datos: página, procedencia aproximada, dispositivo, Core Web Vitals y contador agregado por contenido.
- Finalidad: medir uso y rendimiento para mejorar el sitio.
- Base: interés legítimo con minimización; no se crean perfiles ni decisiones automatizadas.
- Proveedores: Vercel Web Analytics y Speed Insights; contador propio en PostgreSQL.
- Medidas: analítica sin cookies publicitarias, sin identificador persistente propio y sin reconstrucción de sesiones.

## 5. Contenidos, imágenes y biblioteca

- Interesados: autor y personas identificables en materiales autorizados.
- Datos: textos, autoría, imágenes, nombre y metadatos editoriales.
- Finalidad: publicación del blog, libros y presentación profesional.
- Base: derechos propios, autorización o licencia; consentimiento cuando proceda para imagen personal.
- Destinatarios: publicación abierta, Vercel y Vercel Blob.
- Conservación: mientras el contenido siga publicado; revisar y eliminar archivos huérfanos al retirar material.
- Medidas: saneado de HTML, bloqueo previo de YouTube, restricción de recursos externos y control del panel.

## Tratamientos todavía no implantados

Contratación, pagos, facturación, expedientes de clientes y datos de salud no están cubiertos por este registro como procesos activos. Antes de iniciarlos deben añadirse con su base, información por capas, contrato, conservación y análisis de riesgo propios.

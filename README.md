# Olympus Theon v2 — Blog + Libros + Admin (Front-end)

Este proyecto separa **Blog** y **Libros** y añade un **editor tipo Substack** 100% front‑end:
- Crea/edita entradas y libros desde `admin.html`.
- Guarda en `localStorage` (no requiere backend).
- Importa/Exporta JSON y opcionalmente **publica a GitHub** (sin servidores).
- Páginas individuales: `post.html?id=...` y `libro.html?id=...`.

## Rutas
- `index.html` — Quiénes somos
- `blog.html` — Listado Blog
- `libros.html` — Listado Libros
- `post.html` — Vista de entrada
- `libro.html` — Vista de libro
- `admin.html` — Editor front‑end
- `contacto.html` — Contacto

## Cómo usar el Admin
1. Abre `admin.html` (mejor con Live Server en VS Code).
2. Rellena el formulario de **Entrada** o **Libro** y pulsa **Guardar**. Se almacena en tu navegador.
3. Ve a `blog.html` o `libros.html` para ver el nuevo contenido.
4. Usa **Exportar JSON** para descargar todo y subirlo a tu hosting estático.
5. (Opcional) En la sección **GitHub**: escribe `owner/repo`, rama y tu **token** → **Publicar a GitHub** para subir `assets/data/*.json`.

> Nota: Sin backend, las ediciones solo viven en tu navegador hasta que exportes/subas los JSON a tu hosting o publiques a GitHub.

## Suscripciones
El formulario de la home guarda emails en `localStorage`. Desde `admin.html` puedes **exportar CSV**.

## Estética 2025 (B/N)
- Tipografía grande y ligera, glass header, texturas sutiles, animaciones de entrada **con respeto a `prefers-reduced-motion`**.
- Tarjetas monocromas con micro‑interacciones y sombras suaves.
- Diseño responsive con `clamp()` y grillas fluidas.

¡Listo!
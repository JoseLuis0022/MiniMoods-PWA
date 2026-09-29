# Mini Moods — PWA

Versión web instalable (PWA) de [Mini Moods](https://github.com/CampbellMG/MiniMoods): un registro de ánimo minimalista, sin anuncios, sin cuentas y con tus datos guardados solo en tu dispositivo.

## Funciones

- Registrar el ánimo del día con un toque (tocar el mismo lo quita).
- Elegir cualquier fecha con el selector o desde el calendario.
- Gráfica de tendencia del mes y calendario con colores.
- Exportar a CSV (menú de compartir en móvil, descarga en escritorio).
- Importar CSV exportado por la app Android o por esta PWA.
- Tema claro, oscuro o el del sistema.
- 14 idiomas (sigue el idioma del navegador; RTL en árabe).
- Funciona sin conexión y se puede instalar en la pantalla de inicio.

No incluye el widget ni notificaciones de la versión Android.

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm test         # pruebas (Vitest)
npm run check    # tipos (svelte-check + tsc)
npm run build    # genera dist/
npm run preview  # sirve dist/ localmente
```

## Despliegue

`npm run build` genera `dist/`, un sitio estático. Súbelo a cualquier servidor web (por ejemplo, Caddy o Nginx en un VPS).

El build usa rutas **relativas**, así que el mismo `dist/` funciona tanto en la raíz de un dominio (`https://moods.tudominio.com/`) como en una subcarpeta (`https://sites.imperioon.com/MiniMoods/`), sin recompilar. Si alguien entra sin la diagonal final (`/MiniMoods`), la página se redirige sola a `/MiniMoods/`.

Si prefieres fijar una ruta absoluta:

```bash
BASE_PATH=/MiniMoods/ npm run build
```

Requisitos para que funcione como PWA:

- **HTTPS** (obligatorio para el service worker y para poder instalarla).
- Servir `sw.js` sin caché larga (`Cache-Control: no-cache`) para que las actualizaciones lleguen.

Ejemplo con Caddy:

```caddy
moods.tudominio.com {
  root * /srv/mini-moods
  file_server
  @sw path /sw.js /registerSW.js /manifest.webmanifest
  header @sw Cache-Control "no-cache"
}
```

## Datos

Los ánimos se guardan en IndexedDB del navegador (base `mini-moods`) con la fecha como `YYYY-MM-DD` local. No se envía nada a ningún servidor. Exporta de vez en cuando como respaldo.

## Licencia

MIT. Basado en el trabajo original de CampbellMG.

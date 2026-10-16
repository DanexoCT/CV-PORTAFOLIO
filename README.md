# `<davm />` · CV y portafolio

Mi sitio personal para compartir mi experiencia, formación y proyectos de desarrollo web y automatización. También lo uso para probar ideas de interfaz y mostrar ejemplos de lo que puedo construir con frontend.

Soy **Dan Alejandro Valle Mendoza**, de Guadalajara, México. Me interesa especialmente el frontend: cómo se organiza el contenido, cómo responde una interfaz y cómo se siente al usarla.

## Qué incluye

- Experiencia profesional y proyectos con una descripción de mi participación.
- Galería de capturas del rediseño web realizado durante mi estadía en Icono Asesores.
- Formación, tecnologías, descarga del CV y opciones de contacto.
- Diseño adaptable a escritorio, tablet y móvil.
- Animaciones al hacer scroll, transiciones entre apartados y efectos de interacción con el cursor.
- Ajustes para respetar la preferencia de movimiento reducido del dispositivo.

## Demos interactivas

La sección de demos permite probar pequeñas interfaces dentro del sitio:

| Demo | Qué se puede probar |
| --- | --- |
| Catálogo | Buscar, combinar filtros, ordenar por precio, seleccionar productos y calcular el total. Incluye estados simulados de carga, error y recuperación. |
| Tarjeta con inclinación | Ajustar la intensidad del efecto y cambiar el ancho de la tarjeta. |
| Galería expandible | Seleccionar tarjetas y modificar la velocidad de la transición. |
| Botón magnético | Probar la atracción hacia el cursor y la respuesta al pulsarlo. |
| Comparador | Deslizar entre la estructura de una interfaz y su diseño visual. |
| Tablero de tareas | Crear tareas, filtrar por prioridad, moverlas entre estados y deshacer el último cambio. |
| Formulario por pasos | Validar campos, conservar los datos al volver y revisar un resumen antes de terminar. |

Las demos funcionan en el navegador con datos de ejemplo. No envían solicitudes, procesan pagos ni guardan información en un servidor. Los cambios se mantienen mientras la página permanece abierta.

Los controles incluyen alternativas de teclado y uso táctil. Los efectos que dependen del cursor, como el magnetismo y la inclinación, se reservan para dispositivos con ratón.

## Tecnologías

- **React y JavaScript:** componentes, estado y lógica de las interfaces.
- **CSS y Tailwind CSS:** estilos, composición adaptable y efectos visuales.
- **Motion:** animaciones y transiciones.
- **Lucide React:** iconos.
- **Vite:** entorno de desarrollo y compilación.
- **ESLint y Node Test Runner:** revisión del código y pruebas de lógica.

## Ejecutar en local

Necesitas Node.js y npm. Desde la carpeta del proyecto:

```bash
npm install
npm run dev
```

Abre la dirección que indique Vite en la terminal.

Para generar y revisar la versión de producción:

```bash
npm run build
npm run preview
```

En PowerShell, si la política de ejecución bloquea `npm`, puedes usar `npm.cmd` en los mismos comandos.

## Validaciones

```bash
npm run lint
node --test tests/catalog.test.js tests/workflow.test.js
```

Las pruebas comprueban la búsqueda y los filtros del catálogo, los límites de cantidades, los totales, las actualizaciones del tablero y la validación del formulario.

## Organización

```text
src/
  components/          Secciones y componentes compartidos
  demos/               Interfaces de ejemplo y su lógica
  index.css            Estilos generales
  mobile-compact.css   Ajustes de distribución para móvil
public/
  projects/            Capturas de proyectos
  tech/                Iconos de tecnologías
  cv.pdf               CV descargable
tests/                 Pruebas de lógica
```

## Contacto

- [GitHub · DanexoCT](https://github.com/DanexoCT)
- [LinkedIn · Dan Valle Mendoza](https://www.linkedin.com/in/dan-valle-mendoza-205086443/)
- [danexo@outlook.com](mailto:danexo@outlook.com)

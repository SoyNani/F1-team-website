# Parrilla 26

Lienzo interactivo sobre Ferrari, Mercedes y McLaren. No es una página de secciones: un único escenario fijo
sobre el que el scroll va añadiendo capas.

**Stack:** Next.js · React Three Fiber · Three.js · Drei · GSAP (ScrollTrigger) · Lenis · postprocessing · Tailwind.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Arquitectura: Atomic Design

```
src/
├─ app/                 Rutas de Next.js, sin lógica propia
├─ components/
│  ├─ atoms/            Piezas indivisibles: Button, Eyebrow, StartLight...
│  │  └─ three/         Un solo elemento 3D: Backdrop, WindTunnel, Studio...
│  ├─ molecules/        Grupos de átomos: DriverCard, MilestoneCard, MapPin...
│  │  └─ three/         Grupos de mallas: Wheel, Helmet
│  ├─ organisms/        Bloques completos: TeamHero, HistoryStack, Hud...
│  │  └─ three/         Car, HelmetPair, PostEffects, WorldCanvas
│  ├─ templates/        Esqueleto de la pantalla, sin contenido
│  └─ pages/            Une plantilla, datos y comportamiento
├─ data/                Contenido: escuderías, pilotos, historia
├─ hooks/               useScrollExperience: Lenis, GSAP y puntero
├─ lib/                 Línea de tiempo, estado compartido y geometría 3D
├─ shaders/             GLSL
└─ styles/              Un CSS por nivel, más los temas de cada escudería
```

**Regla de dependencias:** cada nivel solo importa de niveles inferiores. Los átomos no importan otros componentes.
Un organismo puede componer otros organismos, como hace `TeamChapter`. La lógica sin interfaz va en `hooks/` o
`lib/`, nunca en un átomo o una molécula.

Los componentes 3D siguen el mismo criterio: un átomo es un único elemento autónomo de la escena, aunque su shader
sea complejo. Por eso `WindTunnel` es un átomo y `Wheel`, que agrupa varias mallas, una molécula.

## Cómo se anima

Una sola línea de tiempo GSAP, atada al scroll, mueve el DOM y escribe en `world`, un objeto plano que la escena
WebGL lee en cada frame. El scroll nunca provoca renders de React.

La línea de tiempo encuentra las capas por sus atributos `data-*`, como `data-card` o `data-driver`. Si cambias
uno en un componente, cámbialo también en `src/lib/timeline.ts`.

| Archivo | Función |
| --- | --- |
| `src/data/teams.ts` | Todo el contenido: historia, pilotos, monoplazas |
| `src/lib/timeline.ts` | La coreografía completa, en unidades de scroll |
| `src/lib/world.ts` | Estado compartido entre GSAP y WebGL |
| `src/shaders/backdrop.ts` | Fondo de cada escudería y fusión de colores en Oklab |
| `src/lib/three/carGeometry.ts` | Monoplaza procedural |
| `src/lib/three/livery.ts` | Libreas y fundido entre ellas |
| `src/lib/three/SpeedEffect.ts` | Postproceso propio ligado a la velocidad del scroll |

## Tareas habituales

- **Cambiar un piloto o un texto:** edita `src/data/teams.ts`.
- **Cambiar una foto de piloto:** sustituye el archivo en `public/drivers/`, en proporción 4:5, y actualiza su autor y licencia en `src/data/teams.ts`. Si sigues viendo la anterior, borra `.next/cache/images`.
- **Ajustar la duración del recorrido:** cambia `UNIT_VH` en `src/lib/timeline.ts`.
- **Cambiar colores:** `PALETTE` en `atoms/three/Backdrop.tsx` (fondo), `LIVERIES` en `lib/three/livery.ts` (coche) y `styles/themes.css` (interfaz).

## A tener en cuenta

Con R3F 9, `<shaderMaterial uniforms={...}>` copia los uniforms. Si se van a actualizar en cada frame, crea el
`THREE.ShaderMaterial` con `useMemo` y pásalo con `material={...}`, como hacen los componentes de este proyecto.

## Avisos

Proyecto de aficionado para uso privado, sin relación oficial con la Fórmula 1 ni con los equipos. Los monoplazas y
cascos son recreaciones artísticas, no los modelos reales. Las fotos muestran marcas y patrocinadores en la ropa de
los pilotos: si algún día se publica, revisa antes el uso de imagen, nombres y marcas.

### Fotos de pilotos

Procedentes de Wikimedia Commons y recortadas a 4:5. El crédito también aparece sobre cada foto.

| Piloto | Autor | Licencia | Fuente |
| --- | --- | --- | --- |
| Leclerc | Steffen Prößdorf | CC BY-SA 4.0 | [Original](https://commons.wikimedia.org/wiki/File:2026-08-22_Motorsport,_Formel_1,_Gro%C3%9Fer_Preis_der_Niederlande_2026_STP_2348.jpg) |
| Hamilton | Liauzh | CC BY-SA 4.0 | [Original](https://commons.wikimedia.org/wiki/File:2026_Chinese_GP_-_Qualifying_Top_3.jpg) |
| Russell | Steffen Prößdorf | CC BY-SA 4.0 | [Original](https://commons.wikimedia.org/wiki/File:2026-08-22_Motorsport,_Formel_1,_Gro%C3%9Fer_Preis_der_Niederlande_2026_STP_2555.jpg) |
| Antonelli | Steffen Prößdorf | CC BY-SA 4.0 | [Original](https://commons.wikimedia.org/wiki/File:2026-08-23_Motorsport,_Formel_1,_Gro%C3%9Fer_Preis_der_Niederlande_2026_STP_3010.jpg) |
| Norris | Steffen Prößdorf | CC BY-SA 4.0 | [Original](https://commons.wikimedia.org/wiki/File:2026-08-22_Motorsport,_Formel_1,_Gro%C3%9Fer_Preis_der_Niederlande_2026_STP_2354.jpg) |
| Piastri | Liauzh | CC BY 4.0 | [Original](https://commons.wikimedia.org/wiki/File:2026_Chinese_GP_-_Oscar_Piastri_(cropped)_(cropped).jpg) |

Datos actualizados a noviembre de 2026: Antonelli ya es campeón de pilotos y el Mundial de constructores sigue en juego. Cuando se decida, revisa los títulos de Mercedes en `src/data/teams.ts`.

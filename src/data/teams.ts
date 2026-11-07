export type TeamId = "ferrari" | "mercedes" | "mclaren";

export interface Milestone {
  year: string;
  title: string;
  text: string;
}

export interface DriverPhotoData {
  src: string;
  author: string;
  license: string;
  source: string;
}

export interface Driver {
  number: string;
  first: string;
  last: string;
  country: string;
  since: string;
  bio: string;
  honor?: string;
  photo: DriverPhotoData;
}

export interface Team {
  id: TeamId;
  name: string;
  kicker: string;
  tagline: string;
  stats: { value: string; label: string }[];
  history: Milestone[];
  feature: {
    eyebrow: string;
    title: string;
    text: string;
    chips: { term: string; meaning: string }[];
  };
  car: {
    name: string;
    line: string;
    specs: { label: string; value: string }[];
  };
  drivers: [Driver, Driver];
  ui: { accent: string; ink: string; panel: string; panelInk: string };
}

const REGS = [
  { label: "Ancho máximo", value: "1.900 mm" },
  { label: "Batalla máxima", value: "3.400 mm" },
  { label: "Potencia eléctrica", value: "350 kW" },
];

export const TEAMS: Team[] = [
  {
    id: "ferrari",
    name: "Ferrari",
    kicker: "Scuderia · Maranello, Italia",
    tagline: "La única escudería presente en todas las temporadas de la Fórmula 1.",
    stats: [
      { value: "1929", label: "Fundación" },
      { value: "16", label: "Mundiales de constructores" },
      { value: "15", label: "Mundiales de pilotos" },
    ],
    history: [
      {
        year: "1929",
        title: "Nace la Scuderia",
        text: "Enzo Ferrari funda en Módena un equipo para correr con Alfa Romeo. Los coches con su propio nombre llegarían en 1947.",
      },
      {
        year: "1951",
        title: "Primera victoria",
        text: "Froilán González gana en Silverstone. Un año después, Alberto Ascari trae a Italia el primer título de pilotos.",
      },
      {
        year: "1975",
        title: "La era Lauda",
        text: "Niki Lauda devuelve a Maranello el campeonato tras once años de espera, y lo repite en 1977.",
      },
      {
        year: "2000",
        title: "Dinastía Schumacher",
        text: "Michael Schumacher encadena cinco títulos consecutivos, de 2000 a 2004, y convierte al rojo en sinónimo de victoria.",
      },
    ],
    feature: {
      eyebrow: "L'Italia",
      title: "Forza Ferrari",
      text: "Ferrari no representa a una fábrica: representa a un país. Cuando el rojo gana en Monza, Italia entera celebra.",
      chips: [
        { term: "Rosso Corsa", meaning: "El rojo que Italia asignó a sus coches de carreras." },
        { term: "Giallo Modena", meaning: "El amarillo de la ciudad natal de Enzo Ferrari." },
        { term: "Tifosi", meaning: "La afición que tiñe de rojo las gradas de Monza." },
        { term: "Il Tempio della Velocità", meaning: "Así llaman a Monza, el templo de la velocidad." },
      ],
    },
    car: {
      name: "SF-26",
      line: "Monoplaza 2026",
      specs: [{ label: "Unidad de potencia", value: "Ferrari · V6 híbrido" }, ...REGS],
    },
    drivers: [
      {
        number: "16",
        first: "Charles",
        last: "Leclerc",
        photo: {
          src: "/drivers/leclerc.webp",
          author: "Steffen Prößdorf",
          license: "CC BY-SA 4.0",
          source: "https://commons.wikimedia.org/wiki/File:2026-08-22_Motorsport,_Formel_1,_Gro%C3%9Fer_Preis_der_Niederlande_2026_STP_2348.jpg",
        },
        country: "Mónaco",
        since: "En Ferrari desde 2019",
        bio: "Formado en la academia de Maranello y ganador en Monza en 2019 y 2024, ante los tifosi.",
      },
      {
        number: "44",
        first: "Lewis",
        last: "Hamilton",
        photo: {
          src: "/drivers/hamilton.webp",
          author: "Liauzh",
          license: "CC BY-SA 4.0",
          source: "https://commons.wikimedia.org/wiki/File:2026_Chinese_GP_-_Qualifying_Top_3.jpg",
        },
        country: "Reino Unido",
        since: "En Ferrari desde 2025",
        bio: "Siete veces campeón del mundo. Eligió el rojo para el capítulo final de su carrera.",
      },
    ],
    ui: { accent: "#ff2a1f", ink: "#fff6ec", panel: "#f3e9d6", panelInk: "#1c0d08" },
  },
  {
    id: "mercedes",
    name: "Mercedes",
    kicker: "Flechas de Plata · Brackley, Reino Unido",
    tagline: "De la leyenda de 1934 al campeón más joven de la historia.",
    stats: [
      { value: "1954", label: "Debut en F1" },
      { value: "8", label: "Mundiales de constructores" },
      { value: "2026", label: "Antonelli, campeón del mundo" },
    ],
    history: [
      {
        year: "1934",
        title: "Nacen las Flechas",
        text: "El W25 debuta en Nürburgring. Desde entonces, los coches de carreras de Mercedes se conocen por su color plata.",
      },
      {
        year: "1954",
        title: "Fangio y el W196",
        text: "Mercedes entra en la F1 ganando. Juan Manuel Fangio conquista los títulos de 1954 y 1955 antes de que la marca se retire.",
      },
      {
        year: "2014",
        title: "Era híbrida",
        text: "De vuelta desde 2010 tras comprar Brawn GP, Mercedes encadena ocho títulos de constructores, el récord absoluto de la F1.",
      },
      {
        year: "2026",
        title: "Antonelli, campeón",
        text: "Con 20 años y 68 días, Kimi Antonelli se corona en México y se convierte en el campeón más joven de la historia.",
      },
    ],
    feature: {
      eyebrow: "La leyenda",
      title: "Debajo de la pintura",
      text: "Cuenta la leyenda que en 1934 el coche superó el peso máximo por un kilo. El equipo lijó su pintura blanca durante la noche y el aluminio desnudo salió a la pista.",
      chips: [
        { term: "750 kg", meaning: "El límite de peso de aquel reglamento." },
        { term: "Silberpfeil", meaning: "«Flecha de plata», en alemán." },
      ],
    },
    car: {
      name: "W17",
      line: "Monoplaza 2026",
      specs: [{ label: "Unidad de potencia", value: "Mercedes · V6 híbrido" }, ...REGS],
    },
    drivers: [
      {
        number: "63",
        first: "George",
        last: "Russell",
        photo: {
          src: "/drivers/russell.webp",
          author: "Steffen Prößdorf",
          license: "CC BY-SA 4.0",
          source: "https://commons.wikimedia.org/wiki/File:2026-08-22_Motorsport,_Formel_1,_Gro%C3%9Fer_Preis_der_Niederlande_2026_STP_2555.jpg",
        },
        country: "Reino Unido",
        since: "En Mercedes desde 2022",
        bio: "Salido de la academia del equipo, es el piloto con más experiencia del garaje del campeón.",
      },
      {
        number: "12",
        first: "Kimi",
        last: "Antonelli",
        photo: {
          src: "/drivers/antonelli.webp",
          author: "Steffen Prößdorf",
          license: "CC BY-SA 4.0",
          source: "https://commons.wikimedia.org/wiki/File:2026-08-23_Motorsport,_Formel_1,_Gro%C3%9Fer_Preis_der_Niederlande_2026_STP_3010.jpg",
        },
        country: "Italia",
        since: "En Mercedes desde 2025",
        honor: "Campeón del mundo 2026",
        bio: "El campeón más joven de la historia y el primer italiano con el título desde Alberto Ascari en 1953.",
      },
    ],
    ui: { accent: "#27e6d2", ink: "#eef3f6", panel: "#0d1216", panelInk: "#e8eef2" },
  },
  {
    id: "mclaren",
    name: "McLaren",
    kicker: "Papaya · Woking, Reino Unido",
    tagline: "De un taller fundado por un neozelandés a campeón del mundo.",
    stats: [
      { value: "1963", label: "Fundación" },
      { value: "10", label: "Mundiales de constructores" },
      { value: "2025", label: "Doble título más reciente" },
    ],
    history: [
      {
        year: "1963",
        title: "Bruce McLaren",
        text: "El piloto neozelandés funda su equipo. Debuta en Mónaco en 1966 y gana en Spa en 1968, con él al volante.",
      },
      {
        year: "1981",
        title: "Fibra de carbono",
        text: "El MP4/1 estrena el primer monocasco de fibra de carbono de la F1. Hoy lo usan todos los coches de la parrilla.",
      },
      {
        year: "1988",
        title: "Senna y Prost",
        text: "El MP4/4 gana 15 de las 16 carreras de la temporada, una de las hazañas más grandes de este deporte.",
      },
      {
        year: "2024",
        title: "El regreso papaya",
        text: "Primer título de constructores desde 1998. En 2025 lo revalida y Lando Norris se proclama campeón del mundo.",
      },
    ],
    feature: {
      eyebrow: "Túnel de viento",
      title: "Pintado por el aire",
      text: "El color papaya llegó en los años sesenta para que los coches destacaran en televisión. Hoy, cada línea de la carrocería se esculpe en el túnel de viento de Woking.",
      chips: [
        { term: "Papaya", meaning: "El naranja histórico del equipo." },
        { term: "Woking", meaning: "La sede del McLaren Technology Centre." },
      ],
    },
    car: {
      name: "MCL40",
      line: "Monoplaza 2026",
      specs: [{ label: "Unidad de potencia", value: "Mercedes · V6 híbrido" }, ...REGS],
    },
    drivers: [
      {
        number: "1",
        first: "Lando",
        last: "Norris",
        photo: {
          src: "/drivers/norris.webp",
          author: "Steffen Prößdorf",
          license: "CC BY-SA 4.0",
          source: "https://commons.wikimedia.org/wiki/File:2026-08-22_Motorsport,_Formel_1,_Gro%C3%9Fer_Preis_der_Niederlande_2026_STP_2354.jpg",
        },
        country: "Reino Unido",
        since: "En McLaren desde 2019",
        bio: "Campeón del mundo en 2025. Dejó su histórico 4 para defender el título con el número 1.",
      },
      {
        number: "81",
        first: "Oscar",
        last: "Piastri",
        photo: {
          src: "/drivers/piastri.webp",
          author: "Liauzh",
          license: "CC BY 4.0",
          source: "https://commons.wikimedia.org/wiki/File:2026_Chinese_GP_-_Oscar_Piastri_(cropped)_(cropped).jpg",
        },
        country: "Australia",
        since: "En McLaren desde 2023",
        bio: "Campeón de F3 y F2 en años consecutivos antes de llegar a la F1 con McLaren.",
      },
    ],
    ui: { accent: "#ff8000", ink: "#fffaf3", panel: "#111113", panelInk: "#fff4e6" },
  },
];

export const ITALY_PINS = [
  { id: "monza", name: "Monza", note: "Tempio della Velocità", lonLat: [9.27, 45.58], side: "left", dy: 0 },
  { id: "maranello", name: "Maranello", note: "Casa de la Scuderia", lonLat: [10.87, 44.53], side: "left", dy: 0 },
  { id: "imola", name: "Imola", note: "Autodromo Enzo e Dino Ferrari", lonLat: [11.71, 44.35], side: "right", dy: -2.4 },
  { id: "mugello", name: "Mugello", note: "Circuito propiedad de Ferrari", lonLat: [11.37, 44.0], side: "right", dy: 1.3 },
] as const;

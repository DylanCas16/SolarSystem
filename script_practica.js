import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

let scene, renderer, camera, camcontrols;
let info;
let estrella,
  Planetas = [],
  Lunas = [];
let t0 = 0;
let accglobal = 0.001;
let velocidad = 1;
const ROT = 60;
let simTime = 0;
let last = performance.now();

let asteroides = [];
let asteroidData = [];
const dummy = new THREE.Object3D();

let sombra = true;

// Textura Sol
const sunTex = new THREE.TextureLoader().load("templates/sun.jpg");

// Textura Mercurio
const mercuryTex = new THREE.TextureLoader().load("templates/mercury.jpg");

// Textura Venus
const venusTex = new THREE.TextureLoader().load("templates/venus.jpg");

// Textura Tierra
const earthTex = new THREE.TextureLoader().load("templates/earthmap1k.jpg");
const earthBump = new THREE.TextureLoader().load("templates/earthbump1k.jpg");
const earthSpec = new THREE.TextureLoader().load("templates/earthspec1k.jpg");
const earthClouds = new THREE.TextureLoader().load("templates/earthcloudmap.jpg");

// Textura Luna
const moonTex = new THREE.TextureLoader().load("templates/moon.jpg");

// Textura Marte
const marsTex = new THREE.TextureLoader().load("templates/mars.jpg");

// Textura Asteroides
const asteroidTex = new THREE.TextureLoader().load("templates/asteroid.jpg");

// Textura Júpiter
const jupiterTex = new THREE.TextureLoader().load("templates/jupiter.jpg");

// Textura Saturno
const saturnTex = new THREE.TextureLoader().load("templates/saturn.jpg");

// Textura Urano
const uranusTex = new THREE.TextureLoader().load("templates/uranus.jpg");

// Textura Neptuno
const nepturneTex = new THREE.TextureLoader().load("templates/neptune.jpg");

// Textura fondo estrellado
const spaceTex = new THREE.TextureLoader().load("templates/stars.jpg", (t) => {
  t.mapping = THREE.EquirectangularReflectionMapping;
  if (THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
  scene.background = t;
});
const tmp = new THREE.Vector3();
let cuerpos = {};
let planet = null;

const params = {
  Velocity: 1,
  Pause: false,
  Planet: "None",
  View: "Free",
};

const planetData = {
  Sun: {
    radius: 696340, distance: 0, rotation: 609.12, translation: 0, temperature: 5505,
    dato: "El Sol contiene el 99,86 % de la masa de todo el Sistema Solar. Su núcleo alcanza unos 15 millones de °C y la luz que ves tarda unos 8 minutos y 20 segundos en llegar a la Tierra.",
    data: "The Sun contains 99.86% of the mass of the entire Solar System. Its core reaches about 15 million °C, and the light you see takes about 8 minutes and 20 seconds to reach Earth."
  },
  Mercury: {
  radius: 2439.7, distance: 57909000, rotation: 1407.6, translation: 87.97, temperature: 167,
  dato: "Un día solar en Mercurio (de amanecer a amanecer) dura 176 días terrestres, el doble que su año, porque rota muy despacio mientras orbita deprisa. Además, pese a estar tan cerca del Sol, tiene hielo de agua en cráteres que nunca reciben luz solar.",
  data: "A solar day on Mercury (sunrise to sunrise) lasts 176 Earth days, twice as long as its year, because it rotates very slowly while orbiting quickly. Despite being so close to the Sun, it also has water ice in craters that never receive sunlight."
},
Venus: {
  radius: 6051.8, distance: 108208000, rotation: -5832.5, translation: 224.7, temperature: 464,
  dato: "Como gira al revés, en Venus el Sol sale por el oeste. Además, su atmósfera es tan densa que la presión en superficie equivale a estar a 900 m bajo el mar.",
  data: "Because it spins backwards, the Sun rises in the west on Venus. Its atmosphere is also so dense that surface pressure equals being 900 m underwater."
},
  Earth: {
    radius: 6371, distance: 149598000, rotation: 23.934, translation: 365.256, temperature: 15,
    dato: "La Tierra es el planeta más denso del Sistema Solar y el único con agua líquida en superficie. Su campo magnético nos protege del viento solar y genera las auroras polares.",
    data: "Earth is the densest planet in the Solar System and the only one with liquid water on its surface. Its magnetic field shields us from the solar wind and creates the polar auroras."
  },
  Mars: {
    radius: 3389.5, distance: 227956000, rotation: 24.623, translation: 686.98, temperature: -63,
    dato: "Marte alberga el Monte Olimpo, el volcán más grande conocido (unos 22 km de altura, casi 2,5 veces el Everest). Su color rojizo se debe al óxido de hierro presente en su superficie.",
    data: "Mars is home to Olympus Mons, the largest known volcano (about 22 km high, nearly 2.5 times Everest). Its reddish color comes from the iron oxide on its surface."
  },
  Jupiter: {
    radius: 69911, distance: 778479000, rotation: 9.925, translation: 4332.59, temperature: -108,
    dato: "Júpiter es tan masivo que contiene más del doble de masa que todos los demás planetas juntos. Su Gran Mancha Roja es una tormenta que lleva siglos activa y es más grande que la Tierra.",
    data: "Jupiter is so massive it holds more than twice the mass of all the other planets combined. Its Great Red Spot is a storm that has raged for centuries and is larger than Earth."
  },
  Saturn: {
    radius: 58232, distance: 1433530000, rotation: 10.656, translation: 10759.22, temperature: -139,
    dato: "Saturno es menos denso que el agua: flotaría en un océano suficientemente grande. Sus anillos miden hasta 280.000 km de ancho, pero en la mayoría de zonas tienen apenas unas decenas de metros de grosor.",
    data: "Saturn is less dense than water: it would float in a big enough ocean. Its rings span up to 280,000 km across, yet are only tens of meters thick in most places."
  },
  Uranus: {
    radius: 25362, distance: 2870972000, rotation: -17.24, translation: 30688.5, temperature: -197,
    dato: "Urano gira prácticamente 'tumbado', con una inclinación axial de 98°, por lo que sus polos pasan 42 años seguidos a la luz del Sol y otros 42 a oscuras. Además, registra la temperatura atmosférica más baja medida en un planeta: -224 °C.",
    data: "Uranus spins almost on its side, with an axial tilt of 98°, so its poles get 42 years of continuous sunlight followed by 42 years of darkness. It also holds the record for the lowest atmospheric temperature measured on a planet: -224 °C."
  },
  Neptune: {
    radius: 24622, distance: 4498252000, rotation: 16.11, translation: 60182, temperature: -201,
    dato: "Neptuno tiene los vientos más rápidos del Sistema Solar, de más de 2.000 km/h. Fue el primer planeta descubierto mediante cálculos matemáticos antes de ser observado con telescopio (1846).",
    data: "Neptune has the fastest winds in the Solar System, over 2,000 km/h. It was the first planet found through mathematical predictions before being observed with a telescope (1846)."
  }
};

let currentLang = "es";
let currentPlanet = null;
const card = document.getElementById("planet-info");

const es = () => currentLang === "es";
const num = (n, digits = 1) =>
  n.toLocaleString(es() ? "es-ES" : "en-US", { maximumFractionDigits: digits });

function formatDistance(km) {
  if (km === 0) return "—";
  return km >= 1e6
    ? `${num(km / 1e6)} ${es() ? "millones de km" : "million km"}`
    : `${num(km)} km`;
}

function formatRotation(hours) {
  const abs = Math.abs(hours);
  const text = abs >= 48
    ? `${num(abs / 24)} ${es() ? "días" : "days"}`
    : `${num(abs)} ${es() ? "horas" : "hours"}`;
  return hours < 0 ? `${text} (${es() ? "retrógrada" : "retrograde"})` : text;
}

function formatTranslation(days) {
  if (days === 0) return "—";
  return days >= 730
    ? `${num(days / 365.25)} ${es() ? "años" : "years"}`
    : `${num(days)} ${es() ? "días" : "days"}`;
}

function showPlanetInfo(nombre) {
  const p = planetData[nombre];
  if (!p) return hidePlanetInfo(); // por ejemplo "Moon", que no tiene datos
  currentPlanet = nombre;

  document.getElementById("planet-name").textContent = nombre;
  document.getElementById("planet-data").textContent = es() ? p.dato : p.data;
  document.getElementById("planet-radius").textContent = `${num(p.radius)} km`;
  document.getElementById("planet-distance").textContent = formatDistance(p.distance);
  document.getElementById("planet-rotation").textContent = formatRotation(p.rotation);
  document.getElementById("planet-translation").textContent = formatTranslation(p.translation);
  document.getElementById("planet-temperature").textContent = `${num(p.temperature, 0)} °C`;

  card.classList.remove("hidden");
}

function hidePlanetInfo() {
  currentPlanet = null;
  card.classList.add("hidden");
}

function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll("#lang-switch button").forEach(b =>
    b.classList.toggle("active", b.dataset.lang === lang)
  );
  if (currentPlanet) showPlanetInfo(currentPlanet);
}

document.querySelectorAll("#lang-switch button").forEach(btn =>
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang))
);

function createGUI() {
  cuerpos = {
    Sun: estrella,
    Mercury: Planetas[0], Venus: Planetas[1], Earth: Planetas[2], Mars: Planetas[3],
    Jupiter: Planetas[4], Saturn: Planetas[5], Uranus: Planetas[6], Neptune: Planetas[7],
    Moon: Lunas[0],
  };

  const gui = new GUI();
  const fTiempo = gui.addFolder("Time");
  fTiempo.add(params, "Velocity", 0, 5, 0.1);
  fTiempo.add(params, "Pause");

  const fCam = gui.addFolder("Camera control");
  fCam.add(params, "Planet", ["None", ...Object.keys(cuerpos)]).onChange(seleccionarObjetivo).listen();
  fCam.add(params, "View", ["Free", "Overhead", "Lateral"]).onChange(cambiarVista);
}

function seleccionarObjetivo(nombre) {
  planet = cuerpos[nombre] ?? null;
  if (!planet) {
    camcontrols.minDistance = 0;
    camcontrols.target.set(0, 0, 0);
    hidePlanetInfo();
    return;
  }
  planet.getWorldPosition(tmp);
  const r = planet.geometry.parameters.radius;
  camcontrols.minDistance = r * 1.5;
  camera.position.copy(tmp).add(new THREE.Vector3(0, -r * 5, r * 2));
  camcontrols.target.copy(tmp);

  showPlanetInfo(nombre);
}

function cambiarVista(v) {
  params.Planet = "None";
  planet = null;
  hidePlanetInfo();   // <-- nueva
  camcontrols.minDistance = 0;
  camcontrols.target.set(0, 0, 0);
  if (v === "Overhead") camera.position.set(0, -0.01, 90);
  if (v === "Lateral") camera.position.set(0, -90, 5);
  if (v === "Free") camera.position.set(0, -80, 50);
}

init();
animationLoop();

function init() {
  info = document.createElement("div");
  info.style.position = "absolute";
  info.style.top = "30px";
  info.style.width = "100%";
  info.style.textAlign = "center";
  info.style.color = "#fff";
  info.style.fontWeight = "bold";
  info.style.backgroundColor = "transparent";
  info.style.zIndex = "1";
  info.style.fontFamily = "Monospace";
  info.innerHTML = "Dylan Castrillón Suárez - Solar System";
  document.body.appendChild(info);

  //Defino cámara
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.up.set(0, 0, 1);
  camera.position.set(0, -80, 50);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  camcontrols = new OrbitControls(camera, renderer.domElement);

  const Lamb = new THREE.AmbientLight(0xffffff, 0.05);
  scene.add(Lamb);

  const Lpunt = new THREE.PointLight(0xffffff, 3, 0, 0);
  Lpunt.position.set(0, 0, 0);
  if (sombra) {
    Lpunt.castShadow = true;
    Lpunt.shadow.mapSize.set(2048, 2048);
    Lpunt.shadow.camera.near = 0.5;
    Lpunt.shadow.camera.far = 120;
    Lpunt.shadow.bias = -0.0005;
    Lpunt.shadow.normalBias = 0.05;
  }
  scene.add(Lpunt);

  //Objetos
  Estrella(3, 0xffff00, 0.0008, sunTex);
  Planeta(0.342, 5.8, 2.4, 0xffffff, 1.0, 1.0, 0.00034, mercuryTex); // Mercurio
  Planeta(0.855, 10.8, 1.6, 0xffffff, 1.0, 1.0, -0.00008, venusTex); // Venus
  Planeta(0.9, 15, 1.0, 0xffffff, 1.0, 1.0, 0.02, earthTex, earthBump, earthSpec); // Tierra
  Planeta(0.477, 22.8, 0.8, 0xffffff, 1.0, 1.0, 0.0194, marsTex); // Marte

  Planeta(1.8, 42, 0.4, 0xffffff, 1.0, 1.0, 0.0482, jupiterTex); // Jupiter
  Planeta(1.6, 48, 0.3, 0xffffff, 1.0, 1.0, 0.0449, saturnTex); // Saturno
  Planeta(1.2, 53, 0.2, 0xffffff, 1.0, 1.0, -0.0278, uranusTex); // Urano
  Planeta(1.15, 58, 0.15, 0xffffff, 1.0, 1.0, 0.0297, nepturneTex); // Neptuno

  // Tierra
  Luna(Planetas[2], 0.25, 2.2, 3.5, 0xffffff, 0.0, 0, 0.0583, moonTex); // Luna

  // Marte
  Luna(Planetas[3], 0.05, 0.9, 6.0, 0x8b7d6b, Math.PI / 12, 0, 0.1); // Fobos
  Luna(Planetas[3], 0.035, 1.3, 3.0, 0xa89a85, 0.0, 0, 0.05); // Deimos

  // Jupiter
  Luna(Planetas[4], 0.04, 2.3, 6.5, 0xb5533c, 0.0, 0, 0.1083); // Amaltea
  Luna(Planetas[4], 0.12, 2.8, 5.0, 0xe5d36b, 0.0, 0, 0.0833); // Io
  Luna(Planetas[4], 0.1, 3.3, 3.5, 0xd9cdb5, Math.PI / 90, 0, 0.0583); // Europa
  Luna(Planetas[4], 0.17, 3.9, 2.5, 0x9a8f80, Math.PI / 90, 0, 0.0417); // Ganímedes
  Luna(Planetas[4], 0.15, 4.5, 1.6, 0x5c5248, Math.PI / 90, 0, 0.0267); // Calisto

  // Saturno
  Luna(Planetas[5], 0.05, 2.1, 5.5, 0xbdbdbd, 0.0, 0, 0.0917); // Mimas
  Luna(Planetas[5], 0.06, 2.4, 4.8, 0xf2f2f2, 0.0, 0, 0.08); // Encelado
  Luna(Planetas[5], 0.08, 2.7, 4.2, 0xd9d9d9, 0.0, 0, 0.07); // Tethis
  Luna(Planetas[5], 0.09, 3.0, 3.6, 0xcfcfcf, 0.0, 0, 0.06); // Dione
  Luna(Planetas[5], 0.11, 3.4, 3.0, 0xc4c4c4, 0.0, 0, 0.05); // Rhea
  Luna(Planetas[5], 0.2, 3.9, 2.2, 0xd9902f, 0.0, 0, 0.0367); // Titan
  Luna(Planetas[5], 0.06, 4.3, 1.8, 0xb09a7a, Math.PI / 24, 0.03, 0.05); // Hiperion
  Luna(Planetas[5], 0.09, 4.7, 1.2, 0x8a7a66, Math.PI / 12, 0, 0.02); // Japeto

  // Urano
  Luna(Planetas[6], 0.06, 1.8, 4.5, 0xb0b0b0, Math.PI / 2, 0, 0.075); // Miranda
  Luna(Planetas[6], 0.09, 2.1, 3.8, 0xc8c8c8, Math.PI / 2, 0, 0.0633); // Ariel
  Luna(Planetas[6], 0.09, 2.4, 3.2, 0x6e6e6e, Math.PI / 2, 0, 0.0533); // Umbriel
  Luna(Planetas[6], 0.12, 2.8, 2.5, 0xb5a89a, Math.PI / 2, 0, 0.0417); // Titania
  Luna(Planetas[6], 0.11, 3.2, 2.0, 0x9a8a80, Math.PI / 2, 0, 0.0333); // Oberon

  // Neptuno
  Luna(Planetas[7], 0.15, 2.2, -3.0, 0xd8c9c0, Math.PI / 6, 0, 0.05); // Triton
  Luna(Planetas[7], 0.05, 3.4, 0.8, 0xaaaaaa, Math.PI / 12, 0.01, 0.02); // Nereida

  CinturonAsteroides(1000, 28, 36, asteroidTex);

  createGUI();

  //Inicio tiempo
  t0 = Date.now();
  //EsferaChild(objetos[0],3.0,0,0,0.8,10,10, 0x00ff00);
}

function Estrella(rad, col, rotation, texture) {
  let geometry = new THREE.SphereGeometry(rad, 10, 10);
  geometry.rotateX(Math.PI / 2);

  let material = new THREE.MeshBasicMaterial({ color: col });

  if (texture != undefined) {
    material.map = texture;
  }

  estrella = new THREE.Mesh(geometry, material);
  estrella.userData.rotation = rotation * ROT;
  scene.add(estrella);
}

function Planeta(radio, dist, vel, col, f1, f2, rotation, texture, texbump, texspec, texalpha) {
  let geom = new THREE.SphereGeometry(radio, 10, 10);
  geom.rotateX(Math.PI / 2);

  let material = new THREE.MeshPhongMaterial({ color: col });

  if (texture != undefined) {
    material.map = texture;
  }

  if (texbump != undefined) {
    material.bumpMap = texbump;
    material.bumpScale = 1;
  }

  if (texspec != undefined) {
    material.specularMap = texspec;
    material.specular = new THREE.Color("white");
  }

  if (texalpha != undefined) {
    //Con mapa de transparencia
    material.alphaMap = texalpha;
    material.transparent = true;
    material.side = THREE.DoubleSide;
    material.opacity = 1.0;

    //Sin mapa de transparencia
    /*material.alphaMap = texalpha;
    material.transparent = true;
    material.side = THREE.DoubleSide;
    material.opacity = 0.8;
    material.transparent = true;
    material.depthWrite = false;*/
  }

  let planeta = new THREE.Mesh(geom, material);
  planeta.userData.dist = dist;
  planeta.userData.speed = vel;
  planeta.userData.f1 = f1;
  planeta.userData.f2 = f2;
  planeta.userData.rotation = rotation * ROT;

  planeta.castShadow = true;
  planeta.receiveShadow = true;

  Planetas.push(planeta);
  scene.add(planeta);

  //Dibuja trayectoria, con
  let curve = new THREE.EllipseCurve(
    0,
    0, // centro
    dist * f1,
    dist * f2 // radios elipse
  );
  //Crea geometría
  let points = curve.getPoints(50);
  let geome = new THREE.BufferGeometry().setFromPoints(points);
  let mate = new THREE.LineBasicMaterial({ color: 0xffffff });
  // Objeto
  let orbita = new THREE.Line(geome, mate);
  scene.add(orbita);
}

function Luna(planeta, radio, dist, vel, col, angle, rotationX, rotationY, texture) {
  var pivote = new THREE.Object3D();
  pivote.rotation.x = angle; //si no nulo, rotación suera de plano
  planeta.add(pivote);
  
  var geom = new THREE.SphereGeometry(radio, 10, 10);
  geom.rotateX(Math.PI / 2);

  var material = new THREE.MeshPhongMaterial({ color: col });

  if (texture != undefined) {
    material.map = texture;
  }

  var luna = new THREE.Mesh(geom, material);
  luna.userData.dist = dist;
  luna.userData.speed = vel;
  luna.userData.rotationX = rotationX * ROT;
  luna.userData.rotationY = rotationY * ROT;

  luna.castShadow = true;
  luna.receiveShadow = true;

  Lunas.push(luna);
  pivote.add(luna);
}

function CinturonAsteroides(n, rMin, rMax, texture) {
  const geom = new THREE.IcosahedronGeometry(0.08, 0);
  const mat = new THREE.MeshPhongMaterial({ color: 0x8a7f73 });

    if (texture != undefined) {
    mat.map = texture;
  }

  asteroides = new THREE.InstancedMesh(geom, mat, n);
  asteroides.frustumCulled = false;

  for (let i = 0; i < n; i++) {
    const d = THREE.MathUtils.randFloat(rMin, rMax);
    asteroidData.push({
      d,
      ang: Math.random() * Math.PI * 2,
      speed: 18.24 / d,
      z: THREE.MathUtils.randFloatSpread(1.5),
      s: THREE.MathUtils.randFloat(0.4, 1.6),
      rot: Math.random() * Math.PI,
    });
  }

  asteroides.castShadow = true;
  asteroides.receiveShadow = true;

  scene.add(asteroides);
}

//Bucle de animación
function animationLoop() {
  requestAnimationFrame(animationLoop);

  const now = performance.now();
  const dtMs = Math.min(now - last, 100); // evita saltos al volver a la pestaña
  last = now;
  if (!params.Pause) simTime += dtMs * accglobal * params.Velocity;

  estrella.rotation.z = simTime * estrella.userData.rotation;

  for (const object of Planetas) {
    object.position.x =
      Math.cos(simTime * object.userData.speed) *
      object.userData.f1 *
      object.userData.dist;

    object.position.y =
      Math.sin(simTime * object.userData.speed) *
      object.userData.f2 *
      object.userData.dist;

    object.rotation.z = simTime * object.userData.rotation;
  }

  for (const object of Lunas) {
    object.position.x =
      Math.cos(simTime * object.userData.speed) * object.userData.dist;
    object.position.y =
      Math.sin(simTime * object.userData.speed) * object.userData.dist;

    object.rotation.x = simTime * object.userData.rotationX;
    object.rotation.y = simTime * object.userData.rotationY;
  }

  asteroidData.forEach((a, i) => {
    const t = a.ang + simTime * a.speed;
    dummy.position.set(Math.cos(t) * a.d, Math.sin(t) * a.d, a.z);
    dummy.rotation.set(a.rot + simTime * 0.5, a.rot, 0);
    dummy.scale.setScalar(a.s);
    dummy.updateMatrix();
    asteroides.setMatrixAt(i, dummy.matrix);
  });
  asteroides.instanceMatrix.needsUpdate = true;

  if (planet) {
    planet.getWorldPosition(tmp);
    const delta = tmp.clone().sub(camcontrols.target);
    camcontrols.target.copy(tmp);
    camera.position.add(delta);
  }
  camcontrols.update();

  renderer.render(scene, camera);
}

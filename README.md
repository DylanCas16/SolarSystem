# Mapa interactivo del sistema solar

Se ha implementado un mapa 3D del sistema solar con Three.js donde muestra todos los planetas que lo conforman acompañado de sus lunas.

En primer lugar, se importaron todos los cuerpos del sistema, añadiendo sus traslaciones y rotaciones en una textura simple. Los movimientos de estos son proporcionales a los reales hasta cierto punto, debido a que intentar añadir las distancias reales habría resultado en un mapa enorme y vacío, por lo que se decidió compactarlo. Además, se utilizó una malla "InstancedMesh()" para el cinturón de asterioides, con un total de 1000 asteriodes en el sistema solar.

Una vez finalizada la primera parte, se pasó con la implementación de la iluminación. En este aspecto, solo aparecen en la maqueta dos tipos de luces: la ambiental y una puntual (el Sol), ambas siendo completamente blancas. Para complementar este aspecto, decidí que todos los cuerpos podrán generar y recibir sombra, lo que crea un efecto que simula el ciclo diurno de los planetas.

Posteriormente, se procedió a importar todas las texturas: para el Sol, los planetas, la Luna, los asteroides y el fondo estrellado; el resto de satelites se quedaron con un color liso debido a la complejidad a la hora de encontrar texturas válidas. Todas estas fueron obtenidas de la página [solarsystemscope.com](https://www.solarsystemscope.com/textures/) a excepción de las de La Tierra, que se extrajeron del repositorio de codesandbox [ig-s7](https://codesandbox.io/p/sandbox/ig-s7-36r8mq?file=%2Fsrc%2Findex.html). Todas las imágenes se encuentran en el directorio "templates/".
Finalmente, se implementó una interfaz de usuario con la dependencia "lil-gui", que permite realizar las siguientes acciones:

- Time: permiten controlar el transcurso del tiempo.
    - Velocity: permite modificar la velocidad del tiempo en la que se mueven los cuerpos, esto incluye rotación y traslación.
    - Pause: si se activa, se paralizan todos los objetos del escenario.
- Camera control: permite seleccionar entre distintos puntos de vista.
    - Planet: posiciona la cámara en el planeta seleccionado, siguiendo el movimiento de este.
    - View: permite intercambiar entre tres vistas: una libre en la que el usuario se puede mover en todas las direcciones y ángulos, otra con una vista completa del sistema desde arriba y una última que se aleja lateralmente.

Y, complementario a esto, se diseñó una interfaz en HTML que muestra información relevante sobre el planeta que se esté siguiendo a través del control "Planet" anteriormente mencionado. La información que muestra es: su nombre, algún dato o aspecto interestante, radio del planeta, distancia al sol, duración de una rotación completa, duración de una vuelta al sol (traslación) y su temperatura media. La información se encuentra disponible en inglés y español, pudiéndose cambiar en cualquier momento a través del interruptor ubicado en la esquina superior izquierda.

A continuación, se podrá observar un video de la maqueta en funcionamiento: [Video prueba final](https://youtu.be/RtfO9q3tT84)

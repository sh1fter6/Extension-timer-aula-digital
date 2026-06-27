# Extensión Alarma Aula Digital

Una extensión de navegador diseñada para alertar al usuario antes de que transcurran 30 minutos en la plataforma de Aula Digital, evitando así que el sistema deje de registrar el tiempo y se pierda el acumulado.

---

## El Problema

La plataforma de Aula Digital contabiliza el tiempo de permanencia del usuario. No obstante, al alcanzar los 30 minutos de inactividad, el sistema deja de registrar el tiempo transcurrido, provocando la pérdida de todo el tiempo acumulado en esa sesión.

Esta extensión actúa como una alarma para avisar al usuario cuándo debe interactuar (hacer click) en la plataforma antes de que se cumpla ese límite, garantizando que el tiempo siga acumulándose de manera continua.

---

## Funcionamiento

* **Temporizador:** Mantiene una cuenta regresiva de 29 minutos.
* **Reinicio Inteligente:** Se reinicia de forma automática al detectar navegación, clicks o cambios de página dentro del dominio de Aula Digital.
* **Alerta Preventiva:** Si el temporizador llega a cero (29 minutos sin interacción), el navegador emite una notificación nativa del sistema indicando que es necesario hacer click en la plataforma.

---

## Instalación

### 🦊 Mozilla Firefox (Versión Oficial Recomendada)

La extensión ya está disponible de manera oficial en la tienda de complementos de Mozilla. Puedes instalarla directamente desde el siguiente enlace:

👉 **[Instalar Alarma Aula Digital en Firefox](https://addons.mozilla.org/es-CL/firefox/addon/alarma-aula-digital/)**

---

### 💻 Instalación Manual (Desarrollo)

Si deseas probar o modificar el código localmente, puedes instalarla manualmente en modo desarrollador:

#### Navegadores Basados en Chromium (Chrome, Brave, Edge, Opera)

*Nota: No se publica en la Chrome Web Store oficial debido a que Google cobra una tarifa de registro de desarrollador. La carpeta `Chromium` está aquí para instalación manual.*

1. Descargue o clone este repositorio en su equipo.
2. Abra el navegador y acceda a la dirección `chrome://extensions/`.
3. Active el **Modo de desarrollador** (esquina superior derecha).
4. Haga click en **Cargar descomprimida** (Load unpacked).
5. Seleccione la carpeta `Chromium` en el directorio de este proyecto.

#### Mozilla Firefox (Desarrollo Temporal)

1. Descargue o clone este repositorio en su equipo.
2. Abra Firefox y acceda a la dirección `about:debugging`.
3. En el menú lateral izquierdo, seleccione **Este Firefox** (This Firefox).
4. Haga click en **Cargar complemento temporal...** (Load Temporary Add-on...).
5. Seleccione el archivo `manifest.json` dentro de la carpeta `Mozilla` de este proyecto.

---

## Uso

1. La extensión funciona de forma automática al ingresar a la plataforma de Aula Digital.
2. Al navegar o realizar clicks en el sitio, el contador se restablece a la duración configurada.
3. Puede consultar el tiempo restante en cualquier momento haciendo click en el ícono de la extensión en la barra de herramientas.
4. Si transcurre el tiempo sin interacción y queda un minuto restante, se emitirá la alerta sonora y la notificación del sistema.

---

## Personalización y Ajustes

La extensión incluye un panel de configuración discreto al que puedes acceder haciendo click en el ícono de engranaje (**⚙️**) en la esquina superior derecha del popup de la extensión.

Desde este panel puedes ajustar:

1. **Duración de la Alarma:** Un selector deslizante para ajustar el tiempo del temporizador (desde 1 hasta un máximo de **29 minutos**).
2. **Color de Fondo:** Personaliza el color de fondo del popup.
3. **Color del Reloj:** Cambia el color de los dígitos del temporizador.

#### ¿Cómo ingresar los colores?
Ambas cajas de color son altamente flexibles y aceptan múltiples formatos:
* **Valores RGB (Recomendado):** Simplemente ingresa los tres números de color separados por comas o espacios. Ejemplo: `30, 41, 59` (gris oscuro) o `255, 255, 255` (blanco).
* **Formatos Estándar Web:** También acepta formatos hexadecimales (ej. `#1e293b`) o nombres de colores CSS estándar (ej. `darkred`, `black`, `teal`).

*Nota: La extensión cuenta con detección automática de contraste. Si eliges un fondo muy claro, los textos secundarios de la configuración se oscurecerán automáticamente para asegurar una visibilidad y lectura perfectas.*

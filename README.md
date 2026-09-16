# Simulador de Diagnóstico de LEDs y Motor

Herramienta interactiva para visualizar el estado de funcionamiento, fallas y configuraciones de motores a través del comportamiento de sus indicadores LED (Verde, Rojo, Azul) y el estado de rotación.

Diseñado como prototipo visual y lógica de prueba para su posterior integración en una aplicación móvil en Cordova / Android Studio.

## 🚀 Características

- **Simulador Visual:** Animaciones CSS en tiempo real para la rotación del motor y comportamientos de LEDs (fijo, parpadeo, PWM/respiración).
- **Motor de Diagnóstico:** Búsqueda dinámica de estados basados en una tabla de verdad cargada en `diagnosticos.json`.
- **Despliegue Web:** Compatible con GitHub Pages y ejecución local vía Live Server.

## 🛠️ Tecnologías Utilizadas

- **HTML5 & CSS3:** Estructura e interfaz visual con animaciones nativas.
- **JavaScript (ES6):** Manipulación del DOM, eventos en vivo y consumo de datos mediante `fetch`.
- **JSON:** Base de datos ligera para la mapeación de diagnósticos.

## 📂 Estructura del Proyecto

```text
├── index.html          # Interfaz principal y selectores
├── styles.css          # Estilos y animaciones del motor y LEDs
├── script.js            # Lógica de interacción y búsqueda de diagnósticos
└── diagnosticos.json   # Tabla de verdad mapeada a JSON

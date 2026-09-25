const selectMotor = document.getElementById('select-motor');
const selectVerde = document.getElementById('select-verde');
const selectRojo = document.getElementById('select-rojo');
const selectAzul = document.getElementById('select-azul');

const motor = document.getElementById('motor');
const ledVerde = document.getElementById('led-verde');
const ledRojo = document.getElementById('led-rojo');
const ledAzul = document.getElementById('led-azul');

let listaDiagnosticos = [];

// Función para mapear estados complejos de animación a clases CSS simples
function obtenerClaseAnimacion(valorSelect) {
  const val = valorSelect.toLowerCase();
  if (val.includes('encendido')) return 'encendido';
  if (val.includes('parpadeo atenuado')) return 'pwm';
  if (val.includes('intercalado')) return 'intercalado';
  if (val.includes('parpadeo rápido') ||val.includes('rápido') || val.includes('rapido')) return 'parpadeo-rapido';
  if (val.includes('3 veces') || val.includes('triple')) return 'destello-triple';
  if (val.includes('2 veces') || val.includes('doble')) return 'destello-doble';
  if (val.includes('destello') || val.includes('destella')) return 'destello';
  if (val.includes('parpadeo') || val.includes('parpadea')) return 'parpadeo';
  return 'apagado';
}

function actualizarVisuales() {
  // 1. Motor
  motor.className = 'motor ' + (selectMotor.value === 'Encendido' ? 'encendido' : 'apagado');

  // 2. Apagamos temporalmente todos los LEDs para limpiar las animaciones
  ledVerde.className = 'led verde apagado';
  ledRojo.className = 'led rojo apagado';
  ledAzul.className = 'led azul apagado';

  // 3. Forzamos un 'reflow' del navegador para que procese el reinicio
  void ledVerde.offsetWidth;

  // 4. Asignamos las nuevas clases a todos al mismo milisegundo
  ledVerde.className = `led verde ${obtenerClaseAnimacion(selectVerde.value)}`;
  ledRojo.className = `led rojo ${obtenerClaseAnimacion(selectRojo.value)}`;
  
  if (modeloAmbar) {
    ledAzul.className = `led ambar ${obtenerClaseAnimacion(selectAzul.value)}`;
  } else {
    ledAzul.className = `led azul ${obtenerClaseAnimacion(selectAzul.value)}`;
  }
}

function buscarDiagnostico() {
  const mVal = selectMotor.value.trim().toLowerCase();
  const vVal = selectVerde.value.trim().toLowerCase();
  const rVal = selectRojo.value.trim().toLowerCase();
  const aVal = selectAzul.value.trim().toLowerCase();

  const encontrado = listaDiagnosticos.find(item => 
    item.motor.trim().toLowerCase() === mVal &&
    item.verde.trim().toLowerCase() === vVal &&
    item.rojo.trim().toLowerCase() === rVal &&
    item.azul.trim().toLowerCase() === aVal
  );

  const cajaResultado = document.getElementById('resultado-diagnostico');
  
  if (encontrado) {
    cajaResultado.textContent = encontrado.diagnostico;
    cajaResultado.style.color = '#00ff00';
  } else {
    // Si no hay combinación exacta, generamos recomendaciones por lógica
    const recomendacion = generarRecomendacion(mVal, vVal, rVal, aVal);
    cajaResultado.innerHTML = recomendacion;
    cajaResultado.style.color = '#ffaa00'; // Color naranja para diferenciarlo de un diagnóstico firme
  }
}

function ejecutarTodo() {
  actualizarVisuales();
  buscarDiagnostico();
}


function generarRecomendacion(motor, verde, rojo, azul) {
  // Regla 1: Motor apagado pero el LED Verde indica marcha
  let recomendacion = '';

  if (motor === 'apagado' && verde === 'apagado'&& rojo === 'apagado'&& azul === 'apagado') {

    recomendacion = '<br><strong>Equipo desenergizado.</strong>';
    return recomendacion;

  }

  if (motor === 'apagado' && verde === 'encendido') {

    recomendacion = '<span style="color: #ff4d4d; font-weight: bold;">El motor debería estar encendido</span>';
    recomendacion += '<br><strong>Recomendación:</strong>';
    recomendacion += '<br>• Revisar la conexión de alimentación del motor.';
    recomendacion += '<br>• Revisar la conexión del capacitor.';
    recomendacion += '<br>• Verificar que el motor no esté bloqueado mecánicamente.';

    return recomendacion;
  }

  // Regla 2: Motor encendido pero el LED Verde no lo indica
  if (motor === 'encendido' && verde !== 'encendido') {
    if (rojo === 'intercalado' || rojo === 'parpadeo intercalado') {
    recomendacion = '<span style="color: #ff4d4d; font-weight: bold;"> Precaución </span>';
    recomendacion += '<br><strong>Podria dañar su instalación.</strong>';
    recomendacion += '<br>• El equipo se encuentra en sobrepresión y detecta consumo.';
    recomendacion += '<br> En el caso de que no desee detener el caudal de consumo el equipo se detendra luego de varios minutos.';
    } else {
    recomendacion = '<span style="color: #ff4d4d; font-weight: bold;"> Posible falla </span>';
    recomendacion += '<br><strong>Si el motor no se detiene es posible que tenga una de estas fallas.</strong>';
    recomendacion += '<br>• Falla en el teclado membrana, pruebe su equipo con el teclado desconectado.';
    recomendacion += '<br>• Falla en la placa electronica, es posible que tenga un LED quemado o problemas la parte de potencia.';  
    recomendacion += '<br>• Falla en la conexión.';
    }
  return recomendacion;
  }

  // Regla 3: Hay presencia de fallas (Rojo) con el motor queriendo andar
  if (rojo !== 'apagado' && motor === 'encendido') {
    return 'Recomendación: Estado inconsistente. El motor intenta operar bajo una condición de falla activa. Revisar sensores de protección.';
  }

  // Regla 4: Caso genérico si no entra en ninguna regla anterior

  recomendacion = '<br><strong>La combinación de estados no coincide con ninguna regla conocida.</strong>';
  recomendacion += '<br>Asegurese que la combinación cargada coincida con lo que ve en el equipo.';

  return recomendacion;
}

// Escuchar cambios
selectMotor.addEventListener('change', ejecutarTodo);
selectVerde.addEventListener('change', ejecutarTodo);
selectRojo.addEventListener('change', ejecutarTodo);
selectAzul.addEventListener('change', ejecutarTodo);

let modeloAmbar = false;
const btnModelo = document.getElementById('btn-cambiar-modelo');
const labelAzul = document.querySelector('label[for="select-azul"]');
const spanAzul = document.querySelector('.led-wrapper:nth-child(3) span');

btnModelo.addEventListener('click', () => {
  modeloAmbar = !modeloAmbar;
  
  if (modeloAmbar) {
    btnModelo.textContent = 'Cambiar a PRESS WiFi';
    if (labelAzul) labelAzul.textContent = 'LED Ambar:';
    if (spanAzul) spanAzul.textContent = 'Ambar';
  } else {
    btnModelo.textContent = 'Cambiar a PRESS e';
    if (labelAzul) labelAzul.textContent = 'LED Azul:';
    if (spanAzul) spanAzul.textContent = 'Azul';
  }
  ejecutarTodo();
});

const selectPreset = document.getElementById('select-preset');

// Cargar JSON y poblar el selector de casos predefinidos dinámicamente
fetch('diagnosticos.json')
  .then(response => response.json())
  .then(data => {
    listaDiagnosticos = data;

    // Llenamos el combo de casos predefinidos a partir del JSON
    listaDiagnosticos.forEach((item, index) => {
      const option = document.createElement('option');
      option.value = index; // Guardamos el índice del array
      option.textContent = item.diagnostico; // El texto visible es la descripción
      selectPreset.appendChild(option);
    });

    ejecutarTodo();
  })
  .catch(error => {
    console.error('Error al cargar JSON:', error);
    document.getElementById('resultado-diagnostico').textContent = 'Error al cargar diagnosticos.json';
  });

// Evento al elegir un caso del selector predefinido
selectPreset.addEventListener('change', (e) => {
  const indexElegido = e.target.value;

  if (indexElegido !== "") {
    const caso = listaDiagnosticos[indexElegido];

    // Seteamos los combos con los valores exactos del caso
    selectMotor.value = caso.motor;
    selectVerde.value = caso.verde;
    selectRojo.value = caso.rojo;
    selectAzul.value = caso.azul;

    // Forzamos la actualización visual y el diagnóstico
    ejecutarTodo();
  }
});

// Función genérica para avanzar al siguiente valor en un desplegable (<select>)
function alternarSiguienteEstado(selectElement) {
  const opciones = Array.from(selectElement.options);
  const indiceActual = selectElement.selectedIndex;
  
  // Pasa a la siguiente opción (y si llega al final, vuelve a la primera)
  const siguienteIndice = (indiceActual + 1) % opciones.length;
  selectElement.selectedIndex = siguienteIndice;

  // Dispara el evento 'change' para actualizar animaciones y diagnóstico
  selectElement.dispatchEvent(new Event('change'));
}

// Vinculamos los clics usando las variables que ya tenías declaradas arriba
motor.addEventListener('click', () => {
  alternarSiguienteEstado(selectMotor);
});

ledVerde.addEventListener('click', () => {
  alternarSiguienteEstado(selectVerde);
});

ledRojo.addEventListener('click', () => {
  alternarSiguienteEstado(selectRojo);
});

ledAzul.addEventListener('click', () => {
  alternarSiguienteEstado(selectAzul);
});
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
  if (val.includes('rápido') || val.includes('rapido')) return 'parpadeo-rapido';
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
    cajaResultado.textContent = 'Combinación no encontrada';
    cajaResultado.style.color = '#ff5555';
  }
}

function ejecutarTodo() {
  actualizarVisuales();
  buscarDiagnostico();
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

// Cargar JSON
fetch('diagnosticos.json')
  .then(response => response.json())
  .then(data => {
    listaDiagnosticos = data;
    ejecutarTodo();
  })
  .catch(error => {
    console.error('Error al cargar JSON:', error);
    document.getElementById('resultado-diagnostico').textContent = 'Error al cargar diagnosticos.json';
  });
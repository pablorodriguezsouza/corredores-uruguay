google.charts.load('current', { 'packages':['geochart'] });

// después de que la liberia se cargo, ejecutta el draw
google.charts.setOnLoadCallback(drawRegionsMap);

// redibuja si cambia el tamaño la ventana
window.addEventListener('resize', drawRegionsMap);

// redibuja cuando hacemos click en botones
window.addEventListener("load",inicio);

function inicio() {
    document.getElementById("btnEstadisticas").addEventListener("click", drawRegionsMap);
    document.getElementById("MapaC").addEventListener("click", drawRegionsMap);
    document.getElementById("MapaI").addEventListener("click", drawRegionsMap);
}

function drawRegionsMap() {

const tipoMapa = document.getElementById("MapaC").checked ? "MapaC" : "MapaI";
let conteo;

if(tipoMapa === "MapaC")
    conteo = sistema.contarCarrerasPorDepartamento();
  else 
    conteo = sistema.contarInscripcionesPorDepartamento();

const dataArray = [['Departamento', 'Cantidad de carreras']];   // ej {UY-MO, 2}

for (let nombreDpto in conteo) {
    dataArray.push([nombreDpto, conteo[nombreDpto]]); // Pusheamos el nombre del dpto, y el conteo de ese dpto
}

const data = google.visualization.arrayToDataTable(dataArray);

const options = {
region: 'UY',
resolution: 'provinces',
colorAxis: {colors: ['#c9e6ff', '#034694']},
legend: {textStyle: {color: 'black', fontSize: 12}}
};

const chart = new google.visualization.GeoChart(document.getElementById('mapa'));
chart.draw(data, options);
}

// Funkcja tworząca wykres strategii w podanym kontenerze
function createStrategyChart(containerId, chartData, markerData, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Nie znaleziono elementu o id: ${containerId}`);
    return null;
  }
  
  // Domyślne opcje wykresu
  const defaultOptions = {
    width: 600,
    height: 400,
  };

  const chart = LightweightCharts.createChart(container, Object.assign({}, defaultOptions, options));
  const series = chart.addLineSeries({
    color: 'red',
    lineWidth: 2,
  });

  series.setData(chartData);

  if (markerData && markerData.length > 0) {
    series.setMarkers(markerData);
  }
  
  return { chart, series };
}

// Przykładowe dane dla strategii "1A"
const strategy1AData = [
  { time: '2023-03-01', value: 100 },
  { time: '2023-03-02', value: 105 },
  { time: '2023-03-03', value: 102 },
];

const strategy1AMarkers = [
  { time: '2023-03-02', position: 'aboveBar', color: 'green', shape: 'arrow_up', text: 'Buy' },
  { time: '2023-03-03', position: 'belowBar', color: 'red', shape: 'arrow_down', text: 'Sell' },
];

// Inicjalizacja wykresu strategii "1A" po załadowaniu DOM
document.addEventListener('DOMContentLoaded', function() {
  createStrategyChart('chart-1A', strategy1AData, strategy1AMarkers);
});

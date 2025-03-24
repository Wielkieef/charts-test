// strategies/Strategy-1A-markers.js
export function getStrategy1AMarkers() {
  return [
    {
      time: '2023-03-01',
      position: 'belowBar',
      color: 'blue',
      shape: 'arrowUp',
      text: 'LONG',
    },
    {
      time: '2023-03-03',
      position: 'aboveBar',
      color: 'purple',
      shape: 'arrowDown',
      text: 'CLOSE',
    },
    {
      time: '2023-03-02',
      position: 'aboveBar',
      color: 'purple',
      shape: 'arrowDown',
      text: 'SL', // stop-loss
    },
  ];
}

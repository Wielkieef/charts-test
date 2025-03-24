document.addEventListener('DOMContentLoaded', () => {
  const strategy = '1A'; // <- możesz to dynamicznie zmieniać później
  const script = document.createElement('script');
  script.src = `strategies/${strategy}.js`;
  script.onload = () => console.log(`Strategia ${strategy} załadowana`);
  document.body.appendChild(script);
});

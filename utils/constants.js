const loadStatesList = [
  "En route to Pick Up",
  "Arrived to Pick Up",
  "En route to delivery",
  "Arrived to delivery",
];

const dimensionsObject = {
  SPRINTER: { width: 300, length: 250, height: 170, payload: 1700 },
  "SMALL STRAIGHT": { width: 500, length: 250, height: 170, payload: 2500 },
  "LARGE STRAIGHT": { width: 700, length: 350, height: 200, payload: 4000 },
};

const getRandomTruck = (arr) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};
module.exports = { loadStatesList, dimensionsObject, getRandomTruck };

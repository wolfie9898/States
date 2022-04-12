// generate a list of random numbers
export const generateRandomNumbers = () => {
  const numbers = [];
  for (let i = 0; i < 2; i++) {
    numbers.push(Math.floor(Math.random() * 100));
  }
  return numbers;
};

// generate Mean and Standard Deviation and mode and median
export const generateStatistics = (numbers: number[]) => {
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const standardDeviation = Math.sqrt(
    numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length
  );
  const median = numbers.sort((a, b) => a - b)[Math.floor(numbers.length / 2)];
  // mode
  const mode = numbers.reduce(
    (a, b) => {
      const count = numbers.filter((x) => x === b).length;
      return count > a.count ? { count, value: b } : a;
    },
    { count: 0, value: 0 }
  );

  return { mean, standardDeviation, mode, median };
};

export const getMedian = (numbers: number[]) => {
  return numbers.sort((a, b) => a - b)[Math.floor(numbers.length / 2)];
};
export const getMode = (numbers: number[]) => {
  const mode = numbers.reduce(
    (a, b) => {
      const count = numbers.filter((x) => x === b).length;
      return count > a.count ? { count, value: b } : a;
    },
    { count: 0, value: 0 }
  );
  return mode.value;
};
export const getStandardDeviation = (numbers: number[], meanValue: number) => {
  const variance =
    numbers.reduce((a, b) => a + Math.pow(b - meanValue, 2), 0) /
    numbers.length;
  return Math.sqrt(variance);
};

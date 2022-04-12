import { useEffect, useState } from "react";
import { database } from "./FirebaseConfig";
import { getMedian, getMode, getStandardDeviation } from "./Utils/Math";

function App() {
  const [Numbers, setNumbers] = useState<number[]>([]);
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState("");
  const [MathData, setMathData] = useState({
    mean: 0,
    median: 0,
    mode: 0,
    standardDeviation: 0,
  });

  useEffect(() => {
    setLoading(true);
    try {
      database.ref("numbers").on("value", (snapshot) => {
        let numbers: number[] = [];
        snapshot.forEach((childSnapshot) => {
          numbers.push(childSnapshot.val());
        });
        setNumbers(numbers);
        if (numbers.length > 0) {
          const meanValue = numbers.reduce((a, b) => a + b) / numbers.length;
          setMathData({
            mean: meanValue,
            median: getMedian(numbers),
            mode: getMode(numbers),
            standardDeviation: getStandardDeviation(numbers, meanValue),
          });
        }
      });
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  }, []);

  if (Loading) {
    return <div>Loading...</div>;
  }
  if (Error) {
    return <div>{Error}</div>;
  }
  if (Numbers.length === 0) {
    return (
      <div>
        <h1>No Numbers</h1>
      </div>
    );
  }
  return (
    <div>
      <h1>Statistics</h1>
      <ul>
        <li>
          <strong>Mean:</strong> {MathData.mean}
        </li>
        <li>
          <strong>Median:</strong> {MathData.median}
        </li>
        <li>
          <strong>Mode:</strong> {MathData.mode}
        </li>
        <li>
          <strong>Standard Deviation:</strong> {MathData.standardDeviation}
        </li>
      </ul>
    </div>
  );
}

export default App;

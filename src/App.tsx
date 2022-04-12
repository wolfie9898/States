import { useEffect, useState } from "react";
import { database } from "./FirebaseConfig";
import {
  generateRandomNumbers,
  getMedian,
  getMode,
  getStandardDeviation,
} from "./Utils/Math";
import "./Styles.css";

function App() {
  const [NewNumber, setNewNumber] = useState("");
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
          const meanValue = parseInt(
            (numbers.reduce((a, b) => a + b) / numbers.length).toFixed(2)
          );
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

  const SubmitNewNumber = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    database.ref("numbers").push(NewNumber);
    setNewNumber("");
  };
  const NewData = () => {
    // generate a list of random numbers
    const numbers = generateRandomNumbers();
    // push the numbers to firebase
    numbers.forEach((number) => {
      database.ref("numbers").push(number);
    });
  };

  if (Loading) {
    return <div>Loading...</div>;
  }
  if (Error) {
    return <div>{Error}</div>;
  }
  return (
    <div>
      <h1 className="heading">Statistics</h1>
      {Numbers.length > 0 && (
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
      )}

      <form onSubmit={SubmitNewNumber}>
        <label>Add Number:</label>

        <input
          value={NewNumber}
          type="number"
          onChange={(e: any) => setNewNumber(e.target.value)}
        />
        <button>Add Number</button>
      </form>
      <button onClick={NewData}>
        Load <code>numbers</code> to Firebase
      </button>
    </div>
  );
}

export default App;

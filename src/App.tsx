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
    } finally {
      setLoading(false);
    }
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
  console.log(Loading);
  if (Loading) {
    return <div>Loading...</div>;
  }
  if (Error) {
    return <div>{Error}</div>;
  }
  return (
    <div className="bg-base-300 h-screen py-5">
      <h1 className="text-6xl text-center">Statistics</h1>
      {Numbers.length > 0 && (
        <ul className="container  flex flex-col md:flex-row bg-base-200 p-10 justify-center mt-5 gap-5">
          <li className="tile bg-base-100 ">
            <strong>Mean:</strong> {MathData.mean}
          </li>
          <li className="tile bg-base-100">
            <strong>Median:</strong> {MathData.median}
          </li>
          <li className="tile bg-base-100">
            <strong>Mode:</strong> {MathData.mode}
          </li>
          <li className="tile bg-base-100">
            <strong>Standard Deviation:</strong> {MathData.standardDeviation}
          </li>
        </ul>
      )}
      <div className="mx-28 mt-10 flex flex-col md:flex-row justify-around">
        <form onSubmit={SubmitNewNumber}>
          <div className="p-5 bg-slate-500 rounded-xl text-gray-300 flex flex-col">
            <label className="uppercase mb-1">New Number:</label>
            <input
              value={NewNumber}
              type="number"
              className="px-5 py-3 text-black"
              onChange={(e: any) => setNewNumber(e.target.value)}
            />
          </div>
          <button className="bg-base-100 p-5 rounded-xl mt-5 ">
            Add Number
          </button>
        </form>
        <div className="flex justify-center">
          <button
            className="bg-base-400 p-10 text-3xl rounded-xl "
            onClick={NewData}
          >
            Load <code>numbers</code> to Firebase
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState(null);

  // Set the document title to your roll number
  useEffect(() => {
    document.title = "21BCE3058";
  }, []);

  const handleSubmit = async () => {
    try {
      const parsedJson = JSON.parse(jsonInput); // Parse the JSON input

      const response = await fetch("http://127.0.0.1:5000/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedJson), // Send the parsed JSON as a string
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Parse the response JSON
      setApiResponse(data); // Set the API response in state
      setError(null); // Clear any previous errors
    } catch (e) {
      setError("Invalid JSON or failed to fetch data"); // Set error message if JSON is invalid or fetch fails
      setApiResponse(null); // Clear the API response if there's an error
    }
  };

  const renderData = () => {
    if (!apiResponse) return {}; // Return empty object if no API response

    let filteredData = {}; // Object to store filtered data

    if (selectedOptions.includes("alphabets")) {
      filteredData.alphabets = apiResponse.alphabets; // Add alphabets to filtered data
    }
    if (selectedOptions.includes("numbers")) {
      filteredData.numbers = apiResponse.numbers; // Add numbers to filtered data
    }
    if (selectedOptions.includes("highest_lowercase_alphabet")) {
      filteredData.highest_lowercase_alphabet =
        apiResponse.highest_lowercase_alphabet; // Add highest lowercase alphabet to filtered data
    }

    return filteredData; // Return the filtered data
  };

  return (
    <div className="App">
      <div className="input-container">
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter JSON here: { "data": ["M","1","334","4","B","Z","a"] }'
        />
        <button onClick={handleSubmit}>Submit</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      {apiResponse && (
        <div className="result-container">
          <Select
            isMulti
            options={[
              { value: "alphabets", label: "Alphabets" },
              { value: "numbers", label: "Numbers" },
              {
                value: "highest_lowercase_alphabet",
                label: "Highest Lowercase Alphabet",
              },
            ]}
            onChange={(selected) =>
              setSelectedOptions(selected.map((option) => option.value))
            }
          />
          <h3>Filtered Response:</h3>
          <pre>{JSON.stringify(renderData(), null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;

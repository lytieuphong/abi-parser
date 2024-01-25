import { useRef, useState } from "react";

import "./App.css";
interface ABIFunction {
  name: string;
  type: string;
  types: any;
  inputs: any;
  constant: boolean;
  outputs: { name: string; type: string }[];
  // ...other properties from your ABI
}
function App() {
  const [abiFunctions, setABIFunctions] = useState<ABIFunction[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedABIFunctions, setSelectedABIFunctions] = useState<
    ABIFunction[]
  >([]);
  const [filterType, setFilterType] = useState(""); // Initial filter is empty

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedABIFunctions((prevSelected: ABIFunction[]) => {
      // Update selectedABIFunctions based on checkbox state
      const newSelected = prevSelected.filter(
        (func) => func.name !== event.target.id
      );
      if (event.target.checked) {
        newSelected.push(
          abiFunctions.find((func) => func.name === event.target.id)!
        );
      }
      return newSelected;
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event?.target || event.target === null || !event?.target?.files) {
      return;
    }
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setSelectedABIFunctions([]);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          if (event.target) {
            const tmp = JSON.parse(event.target.result as string);
            const abiData = tmp.filter((item: any) => item);
            console.log("abiData,", abiData);
            const data = abiData.sort((a: any, b: any) =>
              // a?.name.localeCompare(b.name)
              {
                const typeComparison = a.type.localeCompare(b.type);
                if (typeComparison !== 0) {
                  return typeComparison;
                }
                return a.name.localeCompare(b.name);
              }
            );
            setABIFunctions(data);
          }
        } catch (error) {
          console.error("Error parsing ABI JSON:", error);
          // Handle parsing errors appropriately
        }
      };
      reader.readAsText(selectedFile);
    }
  };
  const filterABIElements = (elements: ABIFunction[] | any[]): any[] => {
    if (!filterType) {
      return elements; // If no filter, return all elements
    }
    return elements.filter((element) => element.type === filterType);
  };

  return (
    <main id="app">
      <h1>ABI Functions</h1>
      <p>Select your abi.json file</p>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} />

      <div className="main">
        <div className="d-flex">
          <div className="col">
            <h3>List functions and events</h3>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All</option>
              <option value="function">Functions</option>
              <option value="event">Events</option>
            </select>
            <ul>
              {abiFunctions &&
                filterABIElements(abiFunctions).map((functionData) => (
                  <li key={`method-${functionData.name}`}>
                    {functionData.type !== "constructor" && (
                      <input
                        type="checkbox"
                        id={functionData.name}
                        onChange={handleCheckboxChange}
                      />
                    )}
                    <label htmlFor={functionData.name}>
                      <span className="text-method">{functionData.type} </span>
                      <span className="text-muted">
                        {functionData?.stateMutability ?? ""}{" "}
                      </span>
                      <span className="text-function">{functionData.name}</span>{" "}
                      (
                      {functionData.inputs &&
                        functionData.inputs.map((arg: any, i: number) => (
                          <span
                            className="me-1"
                            key={`arg-${functionData.name}-${i}`}
                          >
                            <span className="text-var">
                              {arg.name || `arg${i}`}
                            </span>
                            : <span className="text-type">{arg.type}</span>
                            {i < functionData.inputs.length - 1 ? (
                              <span className="text-muted">, </span>
                            ) : (
                              ""
                            )}
                          </span>
                        ))}
                      )
                      {functionData.outputs &&
                        functionData.outputs.length > 0 && (
                          <span>
                            → (
                            {functionData.outputs.map(
                              (output: any, i: number) => (
                                <span key={`output-${functionData.name}`}>
                                  {output.name && (
                                    <span className="text-var">
                                      {output.name}:{" "}
                                    </span>
                                  )}
                                  <span className="text-type">
                                    {output.type}
                                  </span>
                                  {i < functionData.outputs.length - 1 ? (
                                    <span className="text-muted">, </span>
                                  ) : (
                                    ""
                                  )}
                                </span>
                              )
                            )}
                            )
                          </span>
                        )}
                    </label>
                  </li>
                ))}
            </ul>
          </div>
          <div className="col">
            <h3>Selected abi methods</h3>
            <textarea
              value={JSON.stringify(selectedABIFunctions, null, 2)}
              readOnly
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;

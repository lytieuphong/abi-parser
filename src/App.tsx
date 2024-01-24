import { useRef, useState } from "react";

import "./App.css";
interface ABIFunction {
  name: string;
  type: string;
  types: any;
  inputs: any;
  // ...other properties from your ABI
}
function App() {
  const [abiFunctions, setABIFunctions] = useState<ABIFunction[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedABIFunctions, setSelectedABIFunctions] = useState<
    ABIFunction[]
  >([]);

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
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          if (event.target) {
            const abiData = JSON.parse(event.target.result as string);
            console.log("abiData,", abiData);
            const data = abiData.sort((a: any, b: any) =>
              a.name.localeCompare(b.name)
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

  return (
    <main id="app">
      <h1>ABI Functions</h1>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} />

      <div className="main">
        <ul>
          {abiFunctions &&
            abiFunctions.map((functionData, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  id={functionData.name}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={functionData.name}>
                  <span className="text-blue">{functionData.name}</span> (
                  {functionData.inputs.map((arg: any) => (
                    <span className="me-1">
                      {arg.name}: <span className="text-muted">{arg.type}</span>
                    </span>
                  ))}
                  )
                </label>
              </li>
            ))}
        </ul>
        <h3>Selected abi methods</h3>
        <textarea
          value={JSON.stringify(selectedABIFunctions, null, 2)}
          readOnly
        />
      </div>
    </main>
  );
}

export default App;

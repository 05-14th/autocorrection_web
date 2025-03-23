import React, { useState } from "react";
import axios from "axios";

const Main: React.FC = () => {
  const [text, setText] = useState("");
  const [resultText, setResultText] = useState("");
  const [current, setCurrent] = useState("");
  const maxWords = 500;
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const words = e.target.value.split(/\s+/).filter((word) => word.length > 0); // Count words correctly
    if (words.length <= maxWords) {
      setText(e.target.value);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
      let correctedText = "";
      for (const sentence of sentences) {
        const response = await axios.post(`${serverUrl}/correct_grammar`, {
          text: sentence.trim(),
          current: current,
        });
        correctedText += response.data.corrected + " ";
        setResultText(correctedText.trim());
      }
      setCurrent(resultText);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-black-900">
      <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row w-full h-full max-w-screen-lg space-y-4 md:space-y-0 md:space-x-4">
        {/* Input Section */}
        <section className="w-full md:w-1/2 flex flex-col flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-2 flex-1">
            <textarea
              className="w-full h-80 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none flex-grow"
              placeholder="Enter text to correct here..."
              value={text}
              onChange={handleTextChange}
            ></textarea>
            <p className="text-sm text-gray-500">
              {text.split(/\s+/).filter((word) => word.length > 0).length}/{maxWords} words
            </p>
            <input
              type="submit"
              value="Submit"
              className="bg-purple-500 text-white font-semibold py-2 rounded-md cursor-pointer hover:bg-purple-700 transition"
            />
          </form>
        </section>

        {/* Output Section */}
        <section className="w-full md:w-1/2 flex flex-col flex-1">
          <textarea
            className="w-full h-80 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none flex-grow"
            placeholder="Corrected text will display here..."
            value={resultText}
            onChange={(e) => setResultText(e.target.value)}
            readOnly
          ></textarea>
          <p className="text-sm text-gray-500">
              {resultText.split(/\s+/).filter((word) => word.length > 0).length}/{maxWords} words
            </p>
        </section>
      </div>
    </div>
  
    </div>
  );
};

export default Main;

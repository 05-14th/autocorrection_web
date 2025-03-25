import React, { useState } from "react";
import axios from "axios";

const Main: React.FC = () => {
  const [text, setText] = useState("");
  const [resultText, setResultText] = useState("");
  const [current, setCurrent] = useState("");
  const [isClicked, setIsClicked] = useState(false);
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
      console.log("Clicked");
      setResultText("");
      setIsClicked(true);
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
      setIsClicked(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-4">
    <div className="flex flex-col md:flex-row w-full max-w-screen-lg space-y-6 md:space-y-0 md:space-x-6 p-6 bg-gray-900 rounded-lg shadow-lg">
      {/* Input Section */}
      <section className="w-full md:w-1/2 flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <textarea
            className="w-full h-[60dvh] p-4 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Enter text to correct here..."
            value={text}
            onChange={handleTextChange}
          />
          <p className="text-sm text-gray-400">
            {text.split(/\s+/).filter((word) => word.length > 0).length}/{maxWords} words
          </p>
          <input
            type="submit"
            value="Submit"
            className={`text-white font-semibold py-3 rounded-md transition ${
              isClicked ? "bg-gray-500 cursor-not-allowed" : "cursor-pointer bg-purple-500 hover:bg-purple-700"
            }`}
            disabled={isClicked}
            />
        </form>
      </section>

      {/* Output Section */}
      <section className="w-full md:w-1/2 flex flex-col">
        <textarea
          className="w-full h-[60dvh] p-4 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          placeholder="Corrected text will display here..."
          value={resultText}
          readOnly
        />
        <p className="text-sm text-gray-400">
          {resultText.split(/\s+/).filter((word) => word.length > 0).length}/{maxWords} words
        </p>
      </section>
    </div>
  </div>
  );
};

export default Main;

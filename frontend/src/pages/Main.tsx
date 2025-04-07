import React, { useState } from "react";
import axios from "axios";

type PunctuationChange = {
  position: number;
  original: string;
  corrected: string;
  before_word: string;
  after_word: string;
};


type PunctuationChangeGroup = PunctuationChange[][];


const Main: React.FC = () => {
  const [text, setText] = useState("");
  const [resultText, setResultText] = useState("");
  const [current, setCurrent] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [punctuationChanges, setPunctuationChanges] = useState<PunctuationChangeGroup[]>([]);
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
      setResultText(""); // Clear displayed text
      setIsClicked(true);
  
      let updatedText = ""; // ✅ Track corrected sentences here
      let allPunctuationChanges: PunctuationChangeGroup[] = []; // <-- Collect all changes
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
      for (const sentence of sentences) {
        const response = await axios.post(`${serverUrl}/correct_grammar`, {
          text: sentence.trim(),
          current: "", // ✅ Send empty to prevent duplicates
        });
  
        const newSentence = response.data.corrected.trim();
        updatedText += newSentence + " "; // ✅ Accumulate properly
  
        // ✅ Dynamically update resultText correctly
        setResultText(prev => `${prev} ${newSentence}`.trim());

        // Push punctuation changes to temp array
        const changes: PunctuationChangeGroup = response.data.punctuation_changes;
        if (changes && changes.length > 0) {
          allPunctuationChanges.push(changes);
        }
      }
      
      setPunctuationChanges(allPunctuationChanges);
      console.log(punctuationChanges);
      setCurrent(updatedText.trim()); // ✅ Store the latest correct text
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
              className="w-full h-[80dvh] p-4 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
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
            className="w-full h-[80dvh] p-4 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Corrected text will display here..."
            value={resultText}
            readOnly
          />
          <p className="text-sm text-gray-400">
            {resultText.split(/\s+/).filter((word) => word.length > 0).length}/{maxWords} words
          </p>
        </section>
        {/*Suggested Correction*/}
        <section className="w-full md:w-1/2 flex flex-col">
          <div className="w-full h-[80dvh] p-4 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none overflow-y-auto">
            <h2 className="text-center border border-gray-500 rounded-md bg-black mb-4">
              Suggested Correct Punctuation
            </h2>
            <ul className="p-2 space-y-4">
              {punctuationChanges.map((sentenceGroup, sentenceIndex) => (
                <li key={sentenceIndex} className="space-y-2">
                  <h3 className="text-white font-semibold">Sentence {sentenceIndex + 1}</h3>
                  {sentenceGroup.map((changes, groupIndex) => (
                    <div key={groupIndex} className="space-y-2">
                      {changes.map((change, changeIndex) => (
                        <div key={changeIndex} className="border-b border-gray-600 pb-2">
                          <span className="text-yellow-400">Position:</span> {change.position},{" "}
                          <span className="text-red-400">Incorrect:</span> "{change.original}" →{" "}
                          <span className="text-green-400">Corrected:</span> "{change.corrected}"
                          <br />
                          <span className="text-purple-500">Before:</span> "{change.before_word}",{" "}
                          <span className="text-blue-500">After:</span> "{change.after_word}"
                        </div>
                      ))}
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Main;

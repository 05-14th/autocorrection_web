import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";

type PunctuationChange = {
  position: number;
  original: string;
  corrected: string;
  before_word: string;
  after_word: string;
};

const Main: React.FC = () => {
  const [text, setText] = useState("");
  const [resultText, setResultText] = useState("");
  //const [current, setCurrent] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [punctuationChanges, setPunctuationChanges] = useState<PunctuationChange[]>([]);
  const maxWords = 500;
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;

  // Function to highlight punctuation in the result text
  const highlightedText = useMemo(() => {
    if (!text || !resultText) return resultText;

    const punctuation = new Set([
      ".", ",", ";", ":", "!", "?", "(", ")", "[", "]",
      "-", "–", "—", "'", '"', "…", "‘", "’", "“", "”"
    ]);
    const result: React.ReactNode[] = [];

    const minLength = Math.min(text.length, resultText.length);
    let i = 0;

    while (i < minLength) {
      const originalChar = text[i]?.normalize("NFC");
      const correctedChar = resultText[i]?.normalize("NFC");

      if (originalChar !== correctedChar && punctuation.has(correctedChar)) {
        result.push(
          <span key={i} className="bg-green-600 text-white px-1 rounded">
            {correctedChar}
          </span>
        );
      } else {
        result.push(<span key={i}>{correctedChar}</span>);
      }
      i++;
    }

    // Add remaining characters if resultText is longer
    if (resultText.length > minLength) {
      for (let j = minLength; j < resultText.length; j++) {
        const char = resultText[j];
        if (punctuation.has(char)) {
          result.push(
            <span key={j} className="bg-green-600 text-white px-1 rounded">
              {char}
            </span>
          );
        } else {
          result.push(<span key={j}>{char}</span>);
        }
      }
    }

    return result;
  }, [text, resultText]);

  const [safeToRender, setSafeToRender] = useState(false);
  useEffect(() => {
    setSafeToRender(true);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const words = e.target.value.split(/\s+/).filter((word) => word.length > 0);
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
      setPunctuationChanges([]);
  
      let updatedText = "";
      let allPunctuationChanges: PunctuationChange[] = [];
      const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
      let positionOffset = 0;

      for (const sentence of sentences) {
        const response = await axios.post(`${serverUrl}/correct_grammar`, {
          text: sentence.trim(),
          current: "",
        });

        const newSentence = response.data.corrected.trim();
        updatedText += newSentence + " ";
        
        const sentenceChanges = response.data.punctuation_changes.flat();
        const adjustedChanges = (sentenceChanges as PunctuationChange[]).map((change) => ({
          ...change,
          position: change.position + positionOffset,
        }));
        
        allPunctuationChanges = [...allPunctuationChanges, ...adjustedChanges];
        positionOffset += newSentence.length + 1;

        setResultText(updatedText.trim());
        setPunctuationChanges(prev => [...prev, ...adjustedChanges]);
      }
      
      allPunctuationChanges.sort((a, b) => a.position - b.position);
      setPunctuationChanges(allPunctuationChanges);
      //setCurrent(updatedText.trim());
      setIsClicked(false);
    } catch (error) {
      console.error(error);
      setIsClicked(false);
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

        {/* Output Section with Highlighted Punctuation */}
        <section className="w-full md:w-1/2 flex flex-col">
          <div className="w-full h-[80dvh] p-4 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none overflow-y-auto whitespace-pre-wrap">
            {safeToRender && highlightedText.length > 0 ? (
              highlightedText
            ) : (
              <p className="text-gray-400">Corrected text will display here...</p>
            )}
          </div>
          <p className="text-sm text-gray-400">
            {resultText.split(/\s+/).filter((word) => word.length > 0).length}/{maxWords} words
          </p>
        </section>

        {/* Suggested Correction Section */}
        <section className="w-full md:w-1/2 flex flex-col">
          <div className="w-full h-[80dvh] p-4 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none overflow-y-auto">
            <h2 className="text-center border border-gray-500 rounded-md bg-black mb-4">
              Punctuation Corrections ({punctuationChanges.length})
            </h2>
            {punctuationChanges.length > 0 ? (
              <ul className="space-y-4">
                {punctuationChanges.map((change, index) => (
                  <li key={index} className="border-b border-gray-600 pb-3">
                    <div className="mb-2">
                      <span className="text-yellow-400">Position:</span> {change.position}
                    </div>
                    <div className="mb-2">
                      <span className="text-red-400">Original:</span> "{change.before_word}"
                      <span className="text-red-500 mx-1">{change.original}</span>
                      "{change.after_word}"
                    </div>
                    <div>
                      <span className="text-green-400">Corrected:</span> "{change.before_word}"
                      <span className="text-green-500 mx-1">{change.corrected}</span>
                      "{change.after_word}"
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center mt-4">
                No punctuation corrections found
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Main;
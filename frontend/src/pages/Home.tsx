import React, { useState } from "react";
import axios from "axios";

const Home: React.FC = () => {

  const [text, setText] = useState("");
  const maxWords = 500;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const words = e.target.value.split(/\s+/).filter(word => word.length > 0); // Count words correctly
    if (words.length <= maxWords) {
      setText(e.target.value);
    }
  };

  const handleSubmit= async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        ServerURL + "/employee-login",
        text,
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-screen-lg space-y-4 md:space-y-0 md:space-x-4">
        <section className="w-full md:w-1/2 flex flex-col">
          <form action="" method="post" className="flex flex-col space-y-2">
            <textarea
              className="w-full h-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter text to correct here..."
              value={text}
              onChange={handleTextChange}
            ></textarea>
            <p className="text-sm text-gray-500">{text.split(/\s+/).filter(word => word.length > 0).length}/{maxWords} words</p>
            <input 
              type="submit" 
              value="Submit" 
              className="bg-blue-500 text-white font-semibold py-2 rounded-md cursor-pointer hover:bg-blue-700 transition"
            />
          </form>
        </section>
        <section className="w-full md:w-1/2">
          <textarea 
            className="w-full h-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Corrected text will display here..."
            readOnly
          ></textarea>
        </section>

      </div>
    </div>
  );
};

export default Home;

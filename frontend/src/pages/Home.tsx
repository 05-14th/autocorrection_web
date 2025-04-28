import React from "react";
import { ParallaxBanner } from "react-scroll-parallax";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full">
       <ParallaxBanner
          layers={[
            { image: "/src/assets/first_parallax.jpg", speed: -20 },
            {
              speed: -10,
              children: (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <h1 className="text-white text-6xl font-bold text-center">
                    Welcome to Puncto-Ai
                  </h1>
                </div>
              ),
            },
            { image: "/images/foreground.png", speed: -5 },
          ]}
          className="relative w-full h-[100dvh] object-cover"
        />
      <section className="min-h-[100dvh] bg-black/40 px-6 py-10 text-white flex flex-col justify-center items-center text-center">
        <div className="w-full max-w-screen-lg mx-auto p-4 sm:p-6 md:p-8 lg:p-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Overview
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed text-justify">
            The <strong>Punctuation Corrector</strong> is a web-based grammar
            correction tool designed to detect and fix punctuation errors,
            ensuring clear and professional writing. Unlike traditional grammar
            checkers, this app specializes in improving the use of commas,
            periods, quotation marks, apostrophes, colons, semicolons, and other
            punctuation marks. Users can paste or type their text into the
            editor, where the app scans for errors, highlights incorrect
            punctuation, and provides smart suggestions with explanations.
          </p>
          <div className="flex justify-center sm:justify-end mt-6">
            <button
              onClick={() => navigate("/main")}
              className="px-5 py-2 sm:px-6 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-base sm:text-lg rounded-lg shadow-md transition-all duration-300 flex items-center gap-2 group"
            >
              <span className="group-hover:underline">Proceed</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Parallax Banner with Punctuation Chart */}
      <ParallaxBanner
        layers={[
          { image: "/src/assets/third_parallax.jpg", speed: -20 },
          {
            speed: -10,
            children: (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-4 sm:p-6">
                {/* Responsive Punctuation Chart */}
                <div className="bg-transparent p-4 sm:p-6 rounded-lg w-full max-w-5xl">
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 text-center">
                    Common Punctuation Chart
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="table-auto border-collapse border border-gray-300 text-white w-full text-xs sm:text-sm md:text-base">
                      <thead>
                        <tr className="bg-white/20 text-xs sm:text-sm">
                          <th className="border border-gray-300 px-3 py-2">Punctuation</th>
                          <th className="border border-gray-300 px-3 py-2">Use</th>
                          <th className="border border-gray-300 px-3 py-2">Example</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Period (.)", "Ends a sentence", "She loves coding."],
                          ["Comma (,)", "Separates ideas", "I bought apples, oranges, and bananas."],
                          ["Question Mark (?)", "Ends a question", "Where is the library?"],
                          ["Exclamation Mark (!)", "Shows excitement", "Wow! That’s amazing!"],
                          ["Colon (:)", "Introduces a list", "She bought: apples, bananas, and grapes."],
                          ["Semicolon (;)", "Joins sentences", "I love coffee; it keeps me awake."],
                          ["Quotation Marks (\" \")", "Indicates speech", "She said, \"Hello!\""],
                          ["Apostrophe (’)", "Shows possession", "John’s book is here."]
                        ].map(([punctuation, use, example], index) => (
                          <tr
                            key={index}
                            className={index % 2 === 0 ? "bg-white/10" : "bg-white/20"}
                          >
                            <td className="border border-gray-300 px-3 py-2 text-center">{punctuation}</td>
                            <td className="border border-gray-300 px-3 py-2">{use}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">{example}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ),
          },
          { image: "/images/foreground.png", speed: -5 },
        ]}
        className="relative w-full h-[100dvh] object-cover"
      />
    </div>
  );
};

export default Home;

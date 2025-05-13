import React from "react";
import { ParallaxBanner } from "react-scroll-parallax";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <ParallaxBanner
        layers={[
          { image: "/assets/first_parallax.jpg", speed: -20 },
          {
            speed: -10,
            children: (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <h1 className="text-white text-6xl font-bold text-center drop-shadow-lg">
                  Welcome to Puncto-Ai
                </h1>
              </div>
            ),
          },
          { image: "/images/foreground.png", speed: -5 },
        ]}
        className="relative w-full h-[100dvh]"
      />

      {/* Overview Section */}
      <section
        id="about-section"
        className="min-h-[100dvh] bg-black/60 px-6 py-10 text-white flex flex-col justify-center items-center text-center"
      >
        <div className="w-full max-w-screen-xl mx-auto p-6 sm:p-10 bg-black/50 rounded-xl shadow-lg">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Overview
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-justify">
            <strong>PUNCTO-AI</strong> is a web-based grammar correction tool designed to detect and fix
            punctuation errors, ensuring clear and professional writing. Unlike traditional grammar checkers,
            this app specializes in improving the use of commas, periods, quotation marks, apostrophes, colons,
            semicolons, and other punctuation marks. Users can paste or type their text into the editor, where
            the app scans for errors and highlights incorrect punctuation, making it easy to check and refine
            writing for clarity and precision.
          </p>
          <div className="flex justify-center sm:justify-end mt-6">
            <button
              onClick={() => navigate("/main")}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg rounded-lg shadow-md transition-all duration-300 flex items-center gap-2 group"
            >
              <span className="group-hover:underline">Proceed</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Punctuation Chart Section */}
      <section
        id = "table-section"
        className="min-h-[100dvh] bg-cover bg-center text-white flex flex-col justify-center items-center px-4 py-10"
        style={{ backgroundImage: "url('/assets/third_parallax.jpg')" }}
      >
        <div className="w-full max-w-screen-xl bg-black/50 backdrop-blur-md p-6 sm:p-10 rounded-xl shadow-xl overflow-x-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">Punctuation Reference Chart</h2>
          <table className="table-auto w-full text-sm sm:text-base border border-gray-400 border-collapse">
            <thead>
              <tr className="bg-white/10">
                <th className="border border-gray-400 px-4 py-3 text-left">Punctuation</th>
                <th className="border border-gray-400 px-4 py-3 text-left">Use</th>
                <th className="border border-gray-400 px-4 py-3 text-left">Example</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Period (.)", "Ends a sentence", "Most sentences end in a period."],
                ["Question Mark (?)", "Indicates a question", `"What time is it?" she asked.`],
                ["Exclamation Mark (!)", "Expresses emotion", `"I love you!" she shouted.`],
                ["Semicolon (;)", "Joins related independent clauses", "It is raining; the dog is wet."],
                ["Comma + Conjunction (, and)", "Joins independent clauses", "It is raining, and the dog is wet."],
                ["Comma (,)", "Separates list items", "I bought apples, oranges, and bananas."],
                ["Comma vs. Semicolon", "Separates complex list items", "My dinner was salad of spinach, carrots, and tomatoes; pasta; and breadsticks."],
                ['Quotation Marks (" ")', "Indicates speech or quote", `"To be or not to be" is from Hamlet.`],
                ["Colon (:)", "Introduces a list or explanation", "There are three things I want: surf, skydive, cruise."],
                ["Comma (,)", "Sets off non-essential info", "Elaine, my roommate, is from Chicago."],
                ["Parentheses (())", "Adds secondary info", "There is an exception to every rule (even this one)."],
                ["Ellipsis (...)", "Shows omitted info", '"... was really good at public speaking."'],
                ["Brackets ([ ])", "Adds info inside a quote", `"[Churchill] was great at speaking."`],
                ["Hyphen (-)", "Joins compound words", "Mother-in-law, five-year-old son."],
                ["En Dash (–)", "Shows range or score", "The score is 14–21."],
                ["Em Dash (—)", "Emphasizes or interrupts", "Never steal — never."],
                ["Apostrophe (’)", "Shows possession or contraction", "Why is Lisa’s wallet in Ben’s backpack?"],
              ].map(([punctuation, use, example], index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white/5" : "bg-white/10"}
                >
                  <td className="border border-gray-400 px-4 py-3">{punctuation}</td>
                  <td className="border border-gray-400 px-4 py-3">{use}</td>
                  <td className="border border-gray-400 px-4 py-3">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ParallaxBanner
        layers={[
          { image: "/assets/third_parallax.jpg", speed: -20 },
          {
            speed: -10,
            children: (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="space-y-6">
                  <h1 className="text-white text-6xl font-bold text-center drop-shadow-lg">
                    "I'm tired of wasting letters when punctuation will do, period."
                  </h1>
                  <h2 className="text-white text-4xl font-bold text-center drop-shadow-lg">
                    - Steve Martin
                  </h2>
                </div>
              </div>
            ),
          },
          { image: "/images/foreground.png", speed: -5 },
        ]}
        className="relative w-full h-[100dvh]"
      />
    </div>
  );
};

export default Home;

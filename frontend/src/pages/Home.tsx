import React, { useState } from "react";
import { ParallaxBanner } from "react-scroll-parallax";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="">
        <section className="h-[600px] bg-black/40 p-10 text-white flex flex-col justify-center items-center text-center">
          <div className="max-w-4xl">
            <h1 className="text-6xl font-bold mb-6">Overview</h1>
            <p className="text-lg leading-relaxed text-justify">
              The <strong>Punctuation Corrector</strong> is a web-based grammar correction tool designed to detect and fix punctuation errors, ensuring clear and professional writing. Unlike traditional grammar checkers, this app specializes in improving the use of commas, periods, quotation marks, apostrophes, colons, semicolons, and other punctuation marks. Users can paste or type their text into the editor, where the app scans for errors, highlights incorrect punctuation, and provides smart suggestions with explanations. With a user-friendly interface, it supports various text formats, including essays, emails, and formal documents. Designed for students, professionals, writers, and content creators, the app helps users refine their writing with precise punctuation. Features like real-time correction, one-click fixes, and easy text export make it a valuable tool for anyone looking to enhance their written communication.
            </p>
            <div className="flex justify-end">
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
       <ParallaxBanner
          layers={[
            { image: "/src/assets/third_parallax.jpg", speed: -20 },
            {
              speed: -10,
              children: (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-6">
                {/* Punctuation Chart */}
                <div className="bg-transparent p-6 rounded-lg">
                  <h2 className="text-white text-2xl font-bold mb-4 text-center">
                    Common Punctuation Chart
                  </h2>
                  <table className="table-auto border-collapse border border-gray-300 text-white w-full">
                    <thead>
                      <tr className="bg-white/20">
                        <th className="border border-gray-300 px-4 py-2">Punctuation</th>
                        <th className="border border-gray-300 px-4 py-2">Use</th>
                        <th className="border border-gray-300 px-4 py-2">Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white/10">
                        <td className="border border-gray-300 px-4 py-2 text-center">Period (.)</td>
                        <td className="border border-gray-300 px-4 py-2">Ends a sentence</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">She loves coding.</td>
                      </tr>
                      <tr className="bg-white/20">
                        <td className="border border-gray-300 px-4 py-2 text-center">Comma (,)</td>
                        <td className="border border-gray-300 px-4 py-2">Separates ideas</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          I bought apples, oranges, and bananas.
                        </td>
                      </tr>
                      <tr className="bg-white/10">
                        <td className="border border-gray-300 px-4 py-2 text-center">Question Mark (?)</td>
                        <td className="border border-gray-300 px-4 py-2">Ends a question</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">Where is the library?</td>
                      </tr>
                      <tr className="bg-white/20">
                        <td className="border border-gray-300 px-4 py-2 text-center">Exclamation Mark (!)</td>
                        <td className="border border-gray-300 px-4 py-2">Shows excitement</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">Wow! That’s amazing!</td>
                      </tr>
                      <tr className="bg-white/10">
                        <td className="border border-gray-300 px-4 py-2 text-center">Colon (:)</td>
                        <td className="border border-gray-300 px-4 py-2">Introduces a list</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          She bought: apples, bananas, and grapes.
                        </td>
                      </tr>
                      <tr className="bg-white/20">
                        <td className="border border-gray-300 px-4 py-2 text-center">Semicolon (;)</td>
                        <td className="border border-gray-300 px-4 py-2">Joins sentences</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          I love coffee; it keeps me awake.
                        </td>
                      </tr>
                      <tr className="bg-white/10">
                        <td className="border border-gray-300 px-4 py-2 text-center">Quotation Marks (" ")</td>
                        <td className="border border-gray-300 px-4 py-2">Indicates speech</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          She said, "Hello!"
                        </td>
                      </tr>
                      <tr className="bg-white/20">
                        <td className="border border-gray-300 px-4 py-2 text-center">Apostrophe (’)</td>
                        <td className="border border-gray-300 px-4 py-2">Shows possession</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">John’s book is here.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              ),
            },
            { image: "/images/foreground.png", speed: -5 },
          ]}
          className="relative w-full h-[800px] object-cover"
        />
    </div>
  );
};

export default Home;

import React from "react";
import { Mail } from "lucide-react";

const Contact: React.FC = () => {
  const openGmailCompose = (email: string) => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-black p-6">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl max-w-2xl w-full text-white">
        <h2 className="text-4xl font-bold mb-8 text-center">Contact Us</h2>

        {/* Project Heads */}
        <div className="mb-10">
          <h3 className="text-2xl font-semibold mb-4 border-b border-purple-400 pb-2">Project Heads</h3>
          <div className="space-y-4">
            {[
              "princeslagumen1@gmail.com",
              "Arejoy04@gmail.com",
              "saysonjaja5@gmail.com",
              "clementegrace64@gmail.com",
              "aculajoan19@gmail.com",
            ].map((email, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-purple-300" />
                <button
                  onClick={() => openGmailCompose(email)}
                  className="hover:underline text-lg text-left"
                >
                  {email}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Developer */}
        <div>
          <h3 className="text-2xl font-semibold mb-4 border-b border-purple-400 pb-2">Developer</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-purple-300" />
              <button
                onClick={() => openGmailCompose("gerryvienlifeflores@gmail.com")}
                className="hover:underline text-lg text-left"
              >
                gerryvienlifeflores@gmail.com
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;

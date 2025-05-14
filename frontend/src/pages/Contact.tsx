import React from "react";
import { Mail } from "lucide-react";

const Contact: React.FC = () => {
  const openGmailCompose = (email: string) => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, "_blank");
  };

  // Project Heads with unique image URLs
  const projectHeads = [
    {
      name: "Princess Anne Lagumen",
      email: "princeslagumen1@gmail.com",
      image: "/pictures/lagumen.jpg",
    },
    {
      name: "Joy Ann Arendain",
      email: "arejoy04@gmail.com",
      image: "/pictures/arendain.jpg",
    },
    {
      name: "Janine Faye F. Sayson",
      email: "saysonjaja5@gmail.com",
      image: "/pictures/sayson.png",
    },
    {
      name: "Grace Ann C. De Vela",
      email: "clementegrace64@gmail.com",
      image: "/pictures/de_vela.png",
    },
    {
      name: "Joan R. Acula",
      email: "aculajoan19@gmail.com",
      image: "/pictures/acula.png",
    },
  ];

  // Developer with a distinct image
  const developer = {
    name: "Gerry Vien Flores",
    email: "gerryvienlifeflores@gmail.com",
    image: "/pictures/flores.png",
  };

  const renderContact = ({
    name,
    email,
    image,
  }: {
    name: string;
    email: string;
    image: string;
  }) => (
    <div className="flex items-center gap-4 md:gap-6 p-3 md:p-4 hover:bg-white/10 rounded-2xl md:rounded-lg transition-all">
      <img
        src={image}
        alt={name}
        className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-purple-300 object-cover"
      />
      <div>
        <p className="font-bold text-lg md:text-xl mb-1">{name}</p>
        <div className="flex items-center gap-2 md:gap-3">
          <Mail className="w-5 h-5 md:w-6 md:h-6 text-purple-300" />
          <button
            onClick={() => openGmailCompose(email)}
            className="hover:underline text-left text-base md:text-lg"
          >
            {email}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-black p-4 md:p-8">
      <div className="bg-white/10 backdrop-blur-lg p-6 md:p-10 rounded-3xl md:rounded-2xl shadow-2xl max-w-4xl w-full text-white mx-4 md:mx-0">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 md:mb-12 text-center">Contact Us</h2>

        {/* Project Heads */}
        <div className="mb-10 md:mb-12">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 border-b-2 border-purple-400 pb-2 md:pb-3">
            Project Heads
          </h3>
          <div className="space-y-6 md:space-y-8">
            {projectHeads.map((contact, idx) => (
              <div key={idx}>{renderContact(contact)}</div>
            ))}
          </div>
        </div>

        {/* Developer */}
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 border-b-2 border-purple-400 pb-2 md:pb-3">
            Developer
          </h3>
          <div className="space-y-4 md:space-y-6">{renderContact(developer)}</div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
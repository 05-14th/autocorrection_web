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
      name: "Joy Arendain",
      email: "Arejoy04@gmail.com",
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
    <div className="flex items-center gap-6 p-4 hover:bg-white/10 rounded-lg transition-all">
      <img
        src={image}
        alt={name}
        className="w-20 h-20 rounded-full border-4 border-purple-300 object-cover"
      />
      <div>
        <p className="font-bold text-xl mb-1">{name}</p>
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-purple-300" />
          <button
            onClick={() => openGmailCompose(email)}
            className="hover:underline text-left text-lg"
          >
            {email}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-black p-8">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl max-w-4xl w-full text-white">
        <h2 className="text-5xl font-bold mb-12 text-center">Contact Us</h2>

        {/* Project Heads */}
        <div className="mb-12">
          <h3 className="text-3xl font-semibold mb-6 border-b-2 border-purple-400 pb-3">Project Heads</h3>
          <div className="space-y-8">
            {projectHeads.map((contact, idx) => (
              <div key={idx}>{renderContact(contact)}</div>
            ))}
          </div>
        </div>

        {/* Developer */}
        <div>
          <h3 className="text-3xl font-semibold mb-6 border-b-2 border-purple-400 pb-3">Developer</h3>
          <div className="space-y-6">{renderContact(developer)}</div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
import React from "react";
import { Mail } from "lucide-react";

const Contact: React.FC = () => {
  const openGmailCompose = (email: string) => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, "_blank");
  };

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
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 p-3 sm:p-4 hover:bg-white/10 rounded-2xl transition-all">
      <img
        src={image}
        alt={name}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-purple-300 object-cover shrink-0"
      />
      <div className="min-w-0">
        <p className="font-bold text-lg sm:text-xl mb-1 truncate">{name}</p>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
          <button
            onClick={() => openGmailCompose(email)}
            className="hover:underline text-left text-base sm:text-lg break-all"
          >
            {email}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-black p-4 sm:p-8">
      <div className="bg-white/10 backdrop-blur-lg p-6 sm:p-10 rounded-3xl shadow-2xl max-w-4xl w-full text-white mx-4 sm:mx-0">
        <h2 className="text-4xl sm:text-5xl font-bold mb-8 sm:mb-12 text-center">Contact Us</h2>

        {/* Project Heads */}
        <div className="mb-10 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 border-b-2 border-purple-400 pb-2 sm:pb-3">
            Project Heads
          </h3>
          <div className="space-y-6 sm:space-y-8">
            {projectHeads.map((contact, idx) => (
              <div key={idx}>{renderContact(contact)}</div>
            ))}
          </div>
        </div>

        {/* Developer */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 border-b-2 border-purple-400 pb-2 sm:pb-3">
            Developer
          </h3>
          <div className="space-y-4 sm:space-y-6">{renderContact(developer)}</div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

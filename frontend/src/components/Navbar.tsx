import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
            <nav className="bg-purple-600 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <img src="/src/assets/ai_logo.jpg" alt="Logo" className="w-10 h-10" />
                    <h1 className="text-white text-2xl font-bold">Puncto-Ai</h1>
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                    <Menu className="w-8 h-8" />
                </button>
            </div>
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)}></div>}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: isOpen ? 0 : "100%" }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 h-full w-64  shadow-lg z-50 bg-black"
            >
                <div className="flex items-center h-16 bg-purple-600">
                    <button onClick={() => setIsOpen(false)} className="text-white p-2 rounded-full focus:outline-none">
                        <X className="w-8 h-8" />
                    </button>
                </div>
                <div className="p-6">
                    <ul className="flex flex-col space-y-4">
                        <li>
                            <Link to="/" className="text-white hover:underline" onClick={() => setIsOpen(false)}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="text-white hover:underline" onClick={() => setIsOpen(false)}>
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="text-white hover:underline" onClick={() => setIsOpen(false)}>
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>
            </motion.div>
        </nav>
    );
};

export default Navbar;

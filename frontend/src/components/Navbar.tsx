import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () =>{
    return (
        <nav className="bg-blue-600 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-2xl font-bold">Grammar Corrector</h1>
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/" className="text-white hover:underline">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="text-white hover:underline">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className="text-white hover:underline">
                            Contact
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
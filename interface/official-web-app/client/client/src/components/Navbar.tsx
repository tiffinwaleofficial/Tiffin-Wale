import React from "react";
import { Link } from "wouter";

const Navbar = () => {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="font-bold text-2xl cursor-pointer">TiffinWale</div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/menu">
              <span className="hover:text-primary cursor-pointer">Menu</span>
            </Link>
            <Link href="/meal-plans">
              <span className="hover:text-primary cursor-pointer">Meal Plans</span>
            </Link>
            <Link href="/corporate-plans">
              <span className="text-primary font-medium cursor-pointer">Corporate</span>
            </Link>
            <Link href="/about">
              <span className="hover:text-primary cursor-pointer">About Us</span>
            </Link>
            <Link href="/contact">
              <span className="hover:text-primary cursor-pointer">Contact</span>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <span className="py-2 px-4 border rounded-md hover:bg-gray-50 cursor-pointer">Login</span>
            </Link>
            <Link href="/signup">
              <span className="py-2 px-4 bg-primary text-white rounded-md cursor-pointer">Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

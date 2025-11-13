"use client";
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { FaCircleUser } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import BtnLink from "./BtnLink";
import SearchPopup from "./SearchPopUp";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"], // choose the weights you want
  display: "swap",
});

const Navbar = () => {
  const pathName = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "Products",
      path: "/products",
    },
    {
      title: "Categories",
      path: "/categories",
    },
    {
      title: "Contact Us",
      path: "/contact",
    },
  ];

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <div>
      <header
        className="top-0 right-2 left-2 bg-white dark:bg-gray-900/80 backdrop-blur-md border-b
        border-gray-200 dark:border-gray-800 rounded-full fixed z-50 mt-6 shadow-xl "
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo Section */}
            <div>
              <div className="flex-shrink-0">
                <Link className="hidden lg:block" href="/">
                  <Image
                    src="/logo/logo.png"
                    alt="logo"
                    height={60}
                    width={80}
                  />
                </Link>
              </div>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks?.map((navLink) => (
                <Link
                  className={` ${
                    pathName === navLink.path
                      ? "text-[#C6E824] underline playfair.className"
                      : ""
                  } ${playfair.className} font-bold text-[#088347] text-xl 
                        dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300`}
                  href={navLink.path}
                  key={navLink.path}
                >
                  {navLink.title}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-5">
              {user ? (
                <div className="flex items-center space-x-5">
                  <button onClick={() => setIsOpen(true)} className="p-2 rounded-full text-green-600 cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Search className="h-6 w-6" />
                  </button>
                  <Link href="/profile" className="rounded-full cursor-pointer shadow-sm text-green-600">
                    <FaCircleUser className="h-7 w-7" />
                  </Link>
                </div>
              ) : (
                <div className="flex gap-5">
                  <BtnLink
                    text="Sign Up"
                    className="border-[2px] border-solid [border-image-source:linear-gradient(90deg,#088347_0%,#C6E824_100%)] [border-image-slice:1] bg-[linear-gradient(90deg,#088347_0%,#C6E824_100%)] bg-clip-text text-transparent rounded-md"
                    link="/signup"
                  />
                  <BtnLink text="Log in" link="/login" />
                </div>
              )}
            </div>

            {/* -------------------------------------------------Mobile Menu Button -----------------------------*/}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                aria-label="Toggle menu"
              >
                <Menu
                  className={`h-6 w-6 transition-transform duration-300 ${
                    isMenuOpen ? "rotate-90 scale-0" : "rotate-0 scale-100"
                  }`}
                />
                <X
                  className={`h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ${
                    isMenuOpen ? "rotate-0 scale-100" : "-rotate-90 scale-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-sm z-50 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <a href="#">
                <Image
                  src="/sign-up-images/Logo.svg"
                  alt="logo"
                  height={100}
                  width={100}
                />
              </a>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-500 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-grow p-4">
            <div className="flex flex-col space-y-2">
              {navLinks?.map((navLink) => (
                <Link
                  className={` ${
                    pathName === navLink.path ? "text-[#C6E824] underline" : ""
                  } px-3 py-2 text-base font-medium text-[#088347] dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800`}
                  href={navLink.path}
                  key={navLink.path}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {navLink.title}
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <a href="#" className="rounded-full shadow-sm text-green-600">
              <FaCircleUser className="h-10 w-10" />
            </a>
          </div>
        </div>
      </div>
      <SearchPopup isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Navbar;

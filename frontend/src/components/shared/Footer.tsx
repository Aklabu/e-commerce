"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const FacebookIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);
const LinkedInIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);
const TwitterIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.594 0-6.492 2.901-6.492 6.492 0 .512.057 1.01.173 1.496-5.405-.271-10.187-2.86-13.387-6.795-.56.96-.883 2.077-.883 3.256 0 2.254 1.147 4.243 2.887 5.419-.847-.025-1.649-.26-2.35-.647-.029.749.208 1.45.746 2.005.679.679 1.574 1.186 2.603 1.307-.207.056-.424.086-.647.086-.159 0-.315-.015-.467-.045.767 2.405 2.989 4.168 5.636 4.217-2.868 2.247-6.49 3.586-10.462 3.586-.681 0-1.35-.039-2.006-.118 3.692 2.378 8.016 3.766 12.692 3.766 15.232 0 23.52-12.69 23.52-23.52 0-.357-.012-.71-.031-1.063z" />
  </svg>
);

export default function Footer() {
  return (
    <motion.footer
      initial={{ y: 300, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{
        delay: 0.3,
        type: "keyframes",
        stiffness: 60,
        duration: 2,
      }}
      className="bg-gradient-to-r from-[#088347]/30 to-[#C6E824]/30 dark:from-gray-900 dark:to-black text-gray-900
     dark:text-white py-12 px-4"
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-items-center lg:grid-cols-5 gap-10 mt-10">
        <div className="lg:col-span-5">
          <Link href={"/"}>
            <Image src="/logo/logo.png" alt="logo" height={100} width={100} />
          </Link>
        </div>
        <div className="flex flex-col space-x-5 pt-2">
          <div className="flex space-x-5">
            <a
              href="#"
              className="text-[#07484A] hover:text-blue-600 dark:text-gray-400 dark:hover:text-teal-400 
                    transition-transform transform hover:scale-110"
            >
              <FacebookIcon size={28} />
            </a>
            <a
              href="#"
              className="text-[#07484A] hover:text-blue-600 dark:text-gray-400 dark:hover:text-teal-400 
                    transition-transform transform hover:scale-110"
            >
              <InstagramIcon size={28} />
            </a>
            <a
              href="#"
              className="text-[#07484A] hover:text-blue-600 dark:text-gray-400 dark:hover:text-teal-400 
                    transition-transform transform hover:scale-110"
            >
              <LinkedInIcon size={28} />
            </a>
            <a
              href="#"
              className="text-[#07484A] hover:text-blue-600 dark:text-gray-400 dark:hover:text-teal-400 
                    transition-transform transform hover:scale-110"
            >
              <TwitterIcon size={28} />
            </a>
          </div>
          <div className="space-y-1.5 mt-4">
            <h3 className="font-openSans font-bold text-[#07484A] dark:text-gray-100">
              Address
            </h3>
            <p className="font-openSans text-[#07484A] dark:text-gray-300">
              +123 654 987
            </p>
            <p className="font-openSans text-[#07484A] dark:text-gray-300">
              877 The Bronx, NY
            </p>
            <p className="font-openSans text-[#07484A] dark:text-gray-300">
              14568, USA
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-openSans font-bold text-[#07484A] dark:text-gray-100">
            My Account
          </h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="/login"
                className="font-openSans text-[#07484A] dark:text-gray-300 hover:text-blue-600 
                        dark:hover:text-teal-400 transition-colors duration-300"
              >
                Sign in
              </Link>
            </li>
            <li>
              <Link
                href="signup"
                className="font-openSans text-[#07484A] dark:text-gray-300 hover:text-blue-600 
                        dark:hover:text-teal-400 transition-colors duration-300"
              >
                Sign up
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="font-openSans text-[#07484A] dark:text-gray-300 hover:text-blue-600 
                        dark:hover:text-teal-400 transition-colors duration-300"
              >
                Order status
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-openSans font-bold text-[#07484A] dark:text-gray-100">
            Help
          </h3>
          <ul className="space-y-3">
            <li>
              <a
                href="#"
                className="font-openSans text-[#07484A] dark:text-gray-300 hover:text-blue-600 
                        dark:hover:text-teal-400 transition-colors duration-300"
              >
                Shipping
              </a>
            </li>
            <li>
              <a
                href="#"
                className="font-openSans text-[#07484A] dark:text-gray-300 hover:text-blue-600 
                        dark:hover:text-teal-400 transition-colors duration-300"
              >
                Returns
              </a>
            </li>
            <li>
              <a
                href="#"
                className="font-openSans text-[#07484A] dark:text-gray-300 hover:text-blue-600 
                        dark:hover:text-teal-400 transition-colors duration-300"
              >
                Sizing
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-openSans font-bold text-[#07484A] dark:text-gray-100">
            Shop
          </h3>
          <ul className="space-y-3">
            <li>
              <a
                href="#"
                className="font-openSans text-[#07484A] dark:text-gray-300 hover:text-blue-600 
                        dark:hover:text-teal-400 transition-colors duration-300"
              >
                All Products
              </a>
            </li>
            <li>
              <a
                href="#"
                className="font-openSans text-[#07484A] dark:text-gray-300 hover:text-blue-600 
                        dark:hover:text-teal-400 transition-colors duration-300"
              >
                Bedroom
              </a>
            </li>
            <li>
              <a
                href="#"
                className="font-openSans text-[#07484A] dark:text-gray-300 hover:text-blue-600 
                        dark:hover:text-teal-400 transition-colors duration-300"
              >
                Dinning Room
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-openSans font-bold text-[#07484A] dark:text-gray-100">
            Legal Stuff
          </h3>
          <ul className="space-y-3">
            <li>
              <a
                href="#"
                className="font-openSans text-[#07484A] dark:text-gray-300 hover:text-blue-600 
                        dark:hover:text-teal-400 transition-colors duration-300"
              >
                Shipping & Delivery
              </a>
            </li>
            <li>
              <a
                href="#"
                className="font-openSans text-[#07484A] dark:text-gray-300 hover:text-blue-600 
                        dark:hover:text-teal-400 transition-colors duration-300"
              >
                Terms & Conditions
              </a>
            </li>
            <li>
              <a
                href="#"
                className="font-openSans text-[#07484A] dark:text-gray-300 hover:text-blue-600 
                        dark:hover:text-teal-400 transition-colors duration-300"
              >
                Privacy & Policy
              </a>
            </li>
          </ul>
        </div>
        <p
          className="sm:col-span-2 font-openSans text-[#07484A] mt-8 dark:text-gray-300 hover:text-blue-600 
              dark:hover:text-teal-400 transition-colors duration-300"
        >
          Copyright &copy; {new Date().getFullYear()} INWOOD. All Rights
          Reserved
        </p>
      </div>
    </motion.footer>
  );
}

"use client";
import React from "react";

import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div>
      <div className="bg-[#FDFBF8] mb-24">
        <motion.div
          initial={{ y: 300, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.3,
            type: "keyframes",
            stiffness: 60,
            duration: 2,
          }}
          className="relative w-full h-[750px] bg-[url(/home/hero.png)]
                    bg-cover bg-center rounded-b-[100px] z-30"
        >
          <div className="absolute w-full h-full z-10 bg-gray-900/50 rounded-b-[100px]" />{" "}
          {/*Overlay*/}
          <div className="absolute top-64 left-24 z-50">
            <motion.div
              initial={{ x: -200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{
                delay: 0.3,
                type: "keyframes",
                stiffness: 60,
                duration: 2,
              }}
            >
              <h1 className="font-bold font-playFairDisplay text-6xl text-[#FFFFFF]">
                Exclusive Deals of
              </h1>
              <h1 className="font-bold font-playFairDisplay text-6xl text-[#FFFFFF]">
                Furniture Collection.
              </h1>
              <p className="font-normal font-openSans text-2xl text-[#FFFFFF] mt-6">
                Explore different categories. Find the best deals.
              </p>
              <div className="mt-8">
                <button
                  className="h-10 text-white font-bold text-xl bg-linear-to-r px-3 from-[#088347]
                            to-[#C6E824] cursor-pointer font-openSans rounded-lg "
                >
                  Shop Now
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;

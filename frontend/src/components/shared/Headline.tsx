import React from 'react';
import { Playfair_Display } from "next/font/google";

interface HeadlineProps {
    text : string,
    className?: string
}

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const Headline: React.FC<HeadlineProps>= (
    {
        text = "please add text",
        className= "my-10 font-semibold text-center text-5xl text-[#07484A] "
    }
) => {
  return (
    <h1 className={` ${playfair.className} ${ className}`}
      >
        {text}
      </h1>
  );
};
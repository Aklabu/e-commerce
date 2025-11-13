import Link from 'next/link';
import React from 'react';
import {  FaArrowRight } from "react-icons/fa";


type BtnLinkProps = {
    link : string;
    text : string;
    className? : string;
    isIcone ?: boolean;

}


const BtnLink: React.FC<BtnLinkProps> = ({
    link = "/",
    text = "Click Here",
    className="bg-[linear-gradient(90deg,#088347_0%,#C6E824_100%)] text-white",
    isIcone = false,
}) => {
    return (
        <Link className={`active:scale-95 px-5 py-2 rounded-lg  ${className} ${isIcone ? "flex items-center gap-2" : ""}` } href={link}>
            {text}
        {isIcone && <FaArrowRight />}
        </Link>
    );
};

export default BtnLink;
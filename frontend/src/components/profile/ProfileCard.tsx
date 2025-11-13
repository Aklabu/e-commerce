"use client";
import React, {  } from "react";

interface ProfileCardProps {
  name: string;
  email: string;
  accountType: "Trade account" | "Other"; // You can add more account types as needed
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  accountType,
}) => {
  return (
    <div className="max-w-md rounded-lg bg-white px-20 py-5 border border-[#0000001A]">
      <div className="flex flex-col items-center gap-10">
        <div className="w-24 h-24 bg-green-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {name[0]}
          {name.split(" ")[1]?.[0]}
        </div>
        <div className="flex-1 flex flex-col justify-center items-center gap-3 ">
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-[#4A5565] text-sm">{email}</p>
        </div>
      </div>
      <hr className="my-4 border-gray-200" />
      <div className="mt-4">
        <div className="flex justify-center items-center gap-2 bg-[#C6E8241F] p-2 rounded-full">
          <p className="w-2 h-2 bg-[#088347] rounded-full"></p>
          <p className="text-sm text-[#088347]">
            {accountType}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

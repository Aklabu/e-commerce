"use client";
import BillingDetails from "@/components/profile/BillingDetails";
import PersonalInfo from "@/components/profile/PersonalDetails";
import ProfileCard from "@/components/profile/ProfileCard";
import Security from "@/components/profile/Security";
import React, { useState } from "react";

const Profile = () => {
  const [option, setoption] = useState("personal");
  return (
    <div className="flex flex-col justify-center items-center w-full mt-32">
      <div>
        <ProfileCard
          name="Piyas Mojumder"
          email="prayasmazumder150@gmail.com"
          accountType="Trade account"
        />
      </div>
      <div className="flex gap-5 my-5">
        <button
          className={`p-3 rounded-lg cursor-pointer ${
            option === "personal" ? " bg-[#00C464] text-white" : "text-black"
          }`}
          onClick={() => setoption("personal")}
        >
          Personal
        </button>
        <button
          className={`p-3 rounded-lg cursor-pointer ${
            option === "billing" ? "bg-[#00C464] text-white" : "text-black"
          }`}
          onClick={() => setoption("billing")}
        >
          Billing
        </button>
        <button
          className={`p-3 rounded-lg cursor-pointer ${
            option === "security" ? "bg-[#00C464] text-white" : "text-black"
          }`}
          onClick={() => setoption("security")}
        >
          Security
        </button>
      </div>
      <div>
        {option === "personal" && (
          <PersonalInfo
            firstName="Prayas"
            lastName="Mojumder"
            email="prayasmazumder150@gmail.com"
            phone="12487953683"
          />
        )}
        {option === "billing" && (
          <BillingDetails
            firstName="Joy"
            lastName="Mojumder"
            email="prayasmazumder150@gmail.com"
            phone="12487953683"
          />
        )}
        {option === "security" && (
          <Security
            firstName="Sagor"
            lastName="Mojumder"
            email="prayasmazumder150@gmail.com"
            phone="12487953683"
          />
        )}
      </div>
    </div>
  );
};

export default Profile;

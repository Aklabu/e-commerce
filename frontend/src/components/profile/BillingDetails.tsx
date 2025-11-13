"use client";
import React, { useState } from "react";

interface PersonalInfoProps {
  companyName: string;
  vatNumber: string;
  companyReg: string;
  billingAddress: string;
  city: string;
  provine: string;
  postCode: string;
}

const BillingDetails: React.FC<PersonalInfoProps> = ({
  companyName,
  vatNumber,
  companyReg,
  billingAddress,
  city,
  provine,
  postCode,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName,
    vatNumber,
    companyReg,
    billingAddress,
    city,
    provine,
    postCode,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Save the changes (you can handle this by sending data to the backend or local storage)
    setIsEditing(false);
    console.log("Changes Saved:", formData);
  };

  return (
    <div className="w-4xl mx-auto bg-white border p-6 rounded-lg">
      <div className="space-y-4">
        <div className="">
          <label className="block text-sm font-medium text-gray-700">
            Company name
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-5">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Vat Number
            </label>
            <input
              type="text"
              name="vatNumber"
              value={formData.vatNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Company Registration
            </label>
            <input
              type="text"
              name="companyReg"
              value={formData.companyReg}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Billing Address
          </label>
          <input
            type="text"
            name="billingAddress"
            value={formData.billingAddress}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-5 items-center justify-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Provine
            </label>
            <input
              type="text"
              name="provine"
              value={formData.provine}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Postal Code
            </label>
            <input
              type="text"
              name="postCode"
              value={formData.postCode}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Billing Address
            </label>
            <input
              type="text"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        {isEditing ? (
          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={toggleEdit}
            className=" text-white p-3 rounded-lg bg-[#00C464] cursor-pointer"
          >
            Edit profile
          </button>
        )}
      </div>
    </div>
  );
};

export default BillingDetails;

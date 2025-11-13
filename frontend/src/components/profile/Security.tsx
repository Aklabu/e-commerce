"use client";
import React, { useState } from "react";

interface PersonalInfoProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const Security: React.FC<PersonalInfoProps> = ({
  firstName,
  lastName,
  email,
  phone,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName,
    lastName,
    email,
    phone,
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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current password
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <label className="block text-sm font-medium text-gray-700">
            New password
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm password
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        {isEditing ? (
          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600"
          >
            Save Changes
          </button>
        ) : <button onClick={toggleEdit} className=" text-white p-3 rounded-lg bg-[#00C464] cursor-pointer">
          Edit profile
        </button>}
      </div>
    </div>
  );
};

export default Security;

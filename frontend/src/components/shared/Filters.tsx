import React, { useEffect, useState } from "react";

const Filters = () => {
    const [filter, setFilter] = useState("All");


    const loadFilteredData = async () => {
    if (active.length > 0) {
      const response = await api.get(`/products/categories/${active}/`);
      setFilteredData(response?.data?.data.products);
    } else {
      const response = await api.get(`/products/list/`);
      console.log("product list...", response?.data.data.results);
      setFilteredData(response?.data.data.results);
    }
  };

    useEffect(() => {
        loadFilteredData();
      }, [active]);




  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 w-full ">
      <input
        type="text"
        placeholder="Search"
        className="flex-1 min-w-[250px] sm:max-w-[120px] rounded-md border px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 sticky"
      />
      <div className="flex justify-center flex-1 lg:mr-20">
        <h1 className={`${playfair.className} text-xl text-[#07484A]`}>
          {active}
        </h1>
      </div>
      <div className="relative flex-1 sm:max-w-[140px]">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full rounded-md border pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-gray-300 text-xl appearance-none"
        >
          <option value="All">Sort by</option>
          <option value="Indoor">Indoor</option>
          <option value="Outdoor">Outdoor</option>
          <option value="Electrical">Electrical</option>
          <option value="Smart Devices">Smart Devices</option>
        </select>

        {/* Filter icon on the left */}
        <BsFilterLeft
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          size={20}
        />
      </div>
    </div>
  );
};

export default Filters;

import React from "react";
import au from "./au.png";
const Header = () => {
  return (
    <div className="bg-[#22225E] text-white flex  items-center  justify-center absolute top-0 w-full">
      <img src={au} alt="atmiya university" className="h-15 ml-10 mr-3 my-1" />
      <h3 className="text-2xl font-serif font-semibold">
        ATMIYA UNIVERSITY - Knowledge Resource Center
      </h3>
    </div>
  );
};

export default Header;

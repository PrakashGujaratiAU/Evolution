import React from "react";
import { useNavigate } from "react-router-dom";
import au from "./au.png";
import rit from "./rit.png";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-[#22225E] text-white flex  items-center  justify-center absolute top-0 w-full"
      onClick={() => navigate(`/index`)}
    >
      <img src={au} alt="atmiya university" className="h-15 ml-10 mr-8 my-1" />
      <h3 className="text-2xl font-serif font-semibold">
        ATMIYA UNIVERSITY - Knowledge Resource Center
      </h3>
      <img src={rit} alt="atmiya university" className="h-15 ml-8 mr-3 my-1" />
    </div>
  );
};

export default Header;

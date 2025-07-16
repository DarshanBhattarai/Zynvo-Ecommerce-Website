import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
    const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center ">
      <h1>404 - Page Not Found</h1>
      <button onClick={() => navigate("/login") }> login</button>

    </div>
  );
};

export default PageNotFound;

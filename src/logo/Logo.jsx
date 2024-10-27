import React from "react";
import me from "../assets/me300.png";
import "./Logo.css";
export default function Logo() {
  return (
    <div className="divlogo">
      <img src={me} height={"100%"} />
    </div>
  );
}

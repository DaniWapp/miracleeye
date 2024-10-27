import React from "react";
import "./ToggleSwitch.css";
export default function ToggleSwitch(props) {
  return (
    <div className="toggle">
      <label class="switch">
        <input onClick={props.onClick} type="checkbox" checked={props.isOnWg} />
        <span class="slider round"></span>
      </label>
    </div>
  );
}

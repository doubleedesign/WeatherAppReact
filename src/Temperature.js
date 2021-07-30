import React from "react";

export default function Temperature(props) {
  return (
    <a className="today-temp">
      <div className="today-image-wrap">
        <img className="today-image" src="" alt="" />
      </div>
      <span className="amount" data-temp-amount="{props.degrees}">
        {props.degrees}&deg;
      </span>
      <span className="units" data-temp-units="{props.units}">
        {props.units}
      </span>
    </a>
  );
}

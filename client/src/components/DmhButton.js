import React from "react";
//import styles from './styles/DmhButton.module.css'

const DmhButton = props => {
  let btnStyle = "dmhbtn";
  let btnColor = "orange";
  let btnTheme = "light";
  let disabled = false;

  if (typeof props.size !== "undefined") {
    if (props.size === "xl") {
      btnStyle = ["dmhbtn", "large"].join(" ");
    }
    // TODO: need to implement other sizes
  }

  if (typeof props.color !== "undefined") {
    if (props.color === "green") {
      btnColor = "green";
    }
    if (props.color === "red") {
      btnColor = "red";
    }
    if (props.color === "solidgreen") {
      btnColor = "solidgreen"
    }
  }

  if (typeof props.dark !== "undefined") {
    if (props.dark) {
      btnTheme = "dark";
    }
  }

  if (typeof props.disabled !== "undefined") {
    disabled = props.disabled;
  }

  const btnStyleFinal = [btnStyle, btnColor, btnTheme].join(" ");

  return (
    <div className="btnWrapper">
      <button disabled={disabled} className={btnStyleFinal} title={props.title} onClick={props.clickHandler}>
        {props.value}
      </button>
    </div>
  );
};

export default DmhButton;

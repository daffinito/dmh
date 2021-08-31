import React from "react";
import DispensarySignUpContainer from "../containers/DispensarySignUpContainer";

// route /signup/dispensary
const DispensarySignUpRoute = props => {
  return <DispensarySignUpContainer token={props.match.params.token} />;
};

export default DispensarySignUpRoute;

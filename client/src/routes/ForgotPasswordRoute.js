import React from "react";
import ForgotPasswordContainer from "../containers/ForgotPasswordContainer";

// route /forgotpassword
const ForgotPasswordRoute = props => {
  return <ForgotPasswordContainer token={props.match.params.token} />;
};

export default ForgotPasswordRoute;

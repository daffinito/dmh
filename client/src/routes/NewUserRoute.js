import React from "react";
import NewUserContainer from "../containers/NewUserContainer";

// route /signup
const NewUserRoute = props => {
  return <NewUserContainer token={props.match.params.token} />;
};

export default NewUserRoute;

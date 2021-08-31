import React from "react";
import MasterAccountConsoleContainer from "../containers/MasterAccountConsoleContainer";

// route /account/:id/console
const MasterAccountConsoleRoute = props => {
  const { cookies } = props
  return <MasterAccountConsoleContainer cookies={cookies} accountId={props.match.params.id} />;
};

export default MasterAccountConsoleRoute;

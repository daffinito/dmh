import React from "react";
import AccountConsoleContainer from "../containers/AccountConsoleContainer";

// route /account/:id/console
const AccountConsoleRoute = props => {
  const { cookies } = props
  return <AccountConsoleContainer key={props.match.params.id} cookies={cookies} accountId={props.match.params.id} />;
};

export default AccountConsoleRoute;

import React from "react";
import AdminConsoleContainer from "../containers/AdminConsoleContainer";

// route /admin/console
const AdminConsoleRoute = props => {
  const { cookies } = props;
  return <AdminConsoleContainer cookies={cookies} />;
};

export default AdminConsoleRoute;

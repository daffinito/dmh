import React from "react";
import ResultsContainer from "../containers/ResultsContainer";

// route /results
const ResultsRoute = ({ location, cookies }) => {
  const isDev = /[?]dev/i.test(location.search);

  return <ResultsContainer cookies={cookies} isDev={isDev} />;
};

export default ResultsRoute;

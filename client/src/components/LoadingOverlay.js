import React from "react";
import styles from "./styles/LoadingOverlay.module.css";

const LoadingOverlay = props => {
  let c = styles.notLoading;
  let showMessage = null;
  if (props.show) {
    c = styles.loading;
    showMessage = <div className={styles.message}>{props.message}</div>;
  }

  return (
    <div>
      <div className={c} />
      {showMessage}
    </div>
  );
};

export default LoadingOverlay;

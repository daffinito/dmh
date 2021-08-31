import React from "react";
import styles from "./styles/DispensaryChart.module.css";

const DispensaryChart = props => {
  const { src } = props;

  return (
    <div className={styles.container}>
      <iframe title={src.split().pop()} src={src} frameBorder="0" className={styles.chart} />
    </div>
  );
};

export default DispensaryChart;

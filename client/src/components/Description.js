import React from "react";
import styles from './styles/Description.module.css'

const Description = props => (
    <div className={styles.descContainer}>
        {props.desc}
    </div>
)

export default Description
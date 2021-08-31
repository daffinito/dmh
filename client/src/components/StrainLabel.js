import React from "react";
import styles from './styles/StrainLabel.module.css'

const StrainLabel = props => {
    const { type, name } = props
    const typeAndName = type !== "" ? type + ": " + name  : ""
    
    return (
        <div className={styles.strainLabel}>
            {typeAndName}
        </div>
)}

export default StrainLabel
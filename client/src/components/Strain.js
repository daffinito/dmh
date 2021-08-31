import React from "react";
import styles from './styles/Strain.module.css'

const Strain = props => {
    const { alt, img } = props

    return (
    <div className={styles.strainContainer}>
        <div className={styles.imageContainer}>
            <img className={styles.circle} alt={alt} src={img} />
        </div>
    </div>
)}

export default Strain
import React from "react";
import styles from "./styles/QuestionText.module.css"

const QuestionText = props => {
    return (
        <div className={styles.questionText}>
            {props.question}
        </div>
    )
}

export default QuestionText
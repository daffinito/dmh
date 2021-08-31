import React from "react";
//import styles from './styles/Selection.module.css'
import Dial from './Dial'

const Selection = props => (
    <div onClick={props.onClick} className="selectionContainer">
        <Dial
            className="dial"
            width={50}
            startAngle={-90}
            maxAngle={props.dialAngle}
            numberOfPositions={props.numberOfChoices}
            currentPosition={props.dialPosition}
            readonly
            flat
        />
        <div className="selectionDesc">
            {props.choice.description}
        </div>
    </div>
)

export default Selection 
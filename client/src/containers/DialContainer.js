import React, { Component } from "react";
import { connect } from "react-redux";
import { setDialPosition, setCurMaxAngle, setChoice } from "../actions";
import PropTypes from "prop-types";
import Dial from "../components/Dial";
import styles from "./styles/DialContainer.module.css";

class DialContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      containerWidth: 500,
      dialSize: 450,
      maxAngle: 45,
      choices: this.props.choices,
      numberOfChoices: this.props.choices.length
    };

    this.handleResize = this.handleResize.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setMaxAngle = this.setMaxAngle.bind(this);
  }

  saveRef = ref => (this.containerNode = ref);

  handleResize(width) {
    const dialSize = width;
    this.setState(() => ({
      containerWidth: this.containerNode.clientWidth,
      dialSize: dialSize
    }));
  }

  setMaxAngle(l) {
    const newMaxAngle = 45 * l > 150 ? 150 : 45 * l;
    this.setState(() => ({
      maxAngle: newMaxAngle
    }));
    this.props.setCurMaxAngle(newMaxAngle);
  }

  componentWillReceiveProps(nextProps) {
    // if container resized
    if (+this.state.containerWidth !== +this.containerNode.clientWidth) {
      this.handleResize(this.containerNode.clientWidth);
    }

    // update choices and number of choices
    if (this.state.choices !== nextProps.choices) {
      this.setMaxAngle(nextProps.choices.length);
      this.setState(() => ({
        choices: nextProps.choices,
        numberOfChoices: nextProps.choices.length
      }));
    }
    if (this.props.choices[0] !== nextProps.choices[0] && nextProps.dialData.position === 0) {
      this.props.setChoice(nextProps.choices[0]);
    }
  }

  componentDidMount() {
    this.handleResize(this.containerNode.clientWidth);
    this.setMaxAngle(this.props.choices.length);
  }

  handleChange(newPosition) {
    this.props.setDialPosition(newPosition);
    if (this.props.dialData.angle !== this.state.maxAngle) {
      this.props.setCurMaxAngle(this.state.maxAngle);
    }
    if (this.props.choiceData.choice !== this.props.choices[newPosition]) {
      this.props.setChoice(this.props.choices[newPosition]);
    }
  }

  render() {
    const { dialSize, maxAngle, choices, numberOfChoices } = this.state;
    const { dialData } = this.props;

    return (
      <div ref={this.saveRef} className={styles.dialContainer}>
        <Dial
          choices={choices}
          className={styles.dial}
          width={dialSize}
          startAngle={-90}
          maxAngle={maxAngle}
          numberOfPositions={numberOfChoices}
          currentPosition={dialData.position}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { ui, dialData, choiceData } = state;
  return {
    ui,
    dialData,
    choiceData
  };
}

DialContainer.propTypes = {
  setDialPosition: PropTypes.func.isRequired,
  setCurMaxAngle: PropTypes.func.isRequired,
  dialData: PropTypes.shape({
    position: PropTypes.number,
    angle: PropTypes.number
  }),
  setChoice: PropTypes.func.isRequired,
  choiceData: PropTypes.shape({
    choice: PropTypes.shape({
      id: PropTypes.number | PropTypes.string,
      description: PropTypes.string
    })
  })
};

export default connect(
  mapStateToProps,
  { setDialPosition, setCurMaxAngle, setChoice }
)(DialContainer);

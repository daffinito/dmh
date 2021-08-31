import React, { Component } from "react";
import styles from "./styles/DeleteIconButton.module.css";

class DeleteIconButton extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  click = () => {
    if (typeof this.props.onClick === "function") {
      this.props.onClick();
    }
  };

  render() {
    return (
      <div onClick={this.click}>
        <i className={["fas fa-trash-alt", styles.deleteIcon].join(" ")} />
      </div>
    );
  }
}

export default DeleteIconButton;

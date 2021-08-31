import React, { Component } from "react";
import styles from "./styles/ReloadIconButton.module.css";

class ReloadIconButton extends Component {
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
        <i className={["fas fa-sync-alt", styles.icon].join(" ")} />
      </div>
    );
  }
}

export default ReloadIconButton;

import React, { Component } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

class StrainTypeDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };
  }

  componentDidMount() {
    if (this.props.defaultValue) {
      this.setState(() => ({ value: this.props.defaultValue }));
    }
  }

  handleChange = e => {
    const val = e.target.value;
    this.setState(() => ({
      value: val
    }));
    this.props.onChange(val);
  };

  render() {
    const { value } = this.state;
    const { valid, id, disabled } = this.props;
    const isDisabled = typeof disabled === "boolean" ? disabled : false;
    const isValid = typeof valid !== "boolean" ? true : valid;

    return (
      <TextField error={!isValid} margin="normal" fullWidth id={id} select label="Type" value={value} onChange={this.handleChange} disabled={isDisabled}>
        <MenuItem key="Sativa" value="Sativa">
          Sativa
        </MenuItem>
        <MenuItem key="Hybrid" value="Hybrid">
          Hybrid
        </MenuItem>
        <MenuItem key="Indica" value="Indica">
          Indica
        </MenuItem>
      </TextField>
    );
  }
}

export default StrainTypeDropdown;

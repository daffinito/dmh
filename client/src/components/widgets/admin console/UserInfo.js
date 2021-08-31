import React, { Component } from "react";
import { Row, Col, Table } from "reactstrap";
import { withRouter } from "react-router-dom";
//import styles from "./styles/MasterAccounts.module.css";
import DeleteIconButton from "../../DeleteIconButton";

class UserInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.user !== nextProps.user) {
      this.setState(() => ({ user: nextProps.user }));
    }
  }

  deleteClick = id => {
    this.props.deleteClick(id);
  };

  getComponent = () => {
    const { user } = this.state;
    if (!user) {
      return null;
    } else {
      return (
        <Table striped borderless size="sm">
          <tbody>
            <tr>
              <th scope="row">ID</th>
              <td>{user.id}</td>
            </tr>
            <tr>
              <th scope="row">Email</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th scope="row">Name</th>
              <td>{user.name}</td>
            </tr>
            <tr>
              <th scope="row">Type</th>
              <td>{user.type}</td>
            </tr>
            <tr>
              <th scope="row">Pending?</th>
              <td>{user.pending.toString()}</td>
            </tr>
            <tr>
              <th scope="row">New Owner?</th>
              <td>{user.newOwner.toString()}</td>
            </tr>
            <tr>
              <th scope="row">Token</th>
              <td>{user.token}</td>
            </tr>
            <tr>
              <th scope="row">Delete</th>
              <td>
                <DeleteIconButton onClick={() => this.deleteClick(user.id)} />
              </td>
            </tr>
          </tbody>
        </Table>
      );
    }
  };

  render() {
    const component = this.getComponent();
    return (
      <Row>
        <Col xs="12" md="12">
          {component}
        </Col>
      </Row>
    );
  }
}

export default withRouter(UserInfo);

import React, { Component } from "react";
import { Row, Col, Table } from "reactstrap";
import DeleteIconButton from "../DeleteIconButton";

class ListUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDelete: false
    };
  }

  componentDidMount() {
    if (typeof this.props.deleteClick === "function") {
      this.setState(() => ({
        showDelete: true
      }));
    }
  }

  componentWillReceiveProps(nextProps) {}

  deleteClick = email => {
    if (typeof this.props.deleteClick === "function") {
      this.props.deleteClick(email);
    }
  };

  render() {
    const { users, currentUser } = this.props;
    let { showDelete } = this.state;
    if (users.length === 1) {
      showDelete = false;
    }
    //console.log(currentUser)
    const list = users.map(user => {
      let name = user.name;
      if (user.email === currentUser) {
        name = name + " (you)";
      }
      return (
        <tr key={user.id}>
          <td>{name}</td>
          <td>{user.email}</td>
          {showDelete ? (
            <td>
              <DeleteIconButton onClick={() => this.deleteClick(user.email)} />
            </td>
          ) : null}
        </tr>
      );
    });

    return (
      <Row>
        <Col xs="12" md="12">
           <Table striped borderless hover size="sm">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                {showDelete ? <th /> : null}
              </tr>
            </thead>
            <tbody>{list}</tbody>
          </Table>
        </Col>
      </Row>
    );
  }
}

export default ListUsers;

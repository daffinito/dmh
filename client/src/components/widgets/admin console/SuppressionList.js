import React, { Component } from "react";
import { Row, Col, Table } from "reactstrap";
import { withRouter } from "react-router-dom";
//import styles from "./styles/MasterAccounts.module.css";
import DeleteIconButton from "../../DeleteIconButton";

class SuppressionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suppressionList: this.props.suppressionList
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.suppressionList !== nextProps.suppressionList) {
      this.setState(() => ({ suppressionList: nextProps.suppressionList }));
    }
  }

  onClick = id => {
    this.props.deleteClick(id);
  };

  render() {
    const { suppressionList } = this.state;

    const list = suppressionList.map(s => (
      <tr key={s.id}>
        <td>{s.email}</td>
        <td>{JSON.stringify(s.reason)}</td>
        <td>
          <DeleteIconButton onClick={() => this.onClick(s.id)} />
        </td>
      </tr>
    ));

    return (
      <Row>
        <Col xs="12" md="12">
          <Table striped borderless size="sm">
            <thead>
              <tr>
                <th>EMAIL</th>
                <th>REASON</th>
                <th>DELETE</th>
              </tr>
            </thead>
            <tbody>{list}</tbody>
          </Table>
        </Col>
      </Row>
    );
  }
}

export default withRouter(SuppressionList);

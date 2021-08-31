import React, { Component } from "react";
import { Row, Col, Table } from "reactstrap";
import DeleteIconButton from "../../DeleteIconButton";
import CustomStrainModal from "../CustomStrainModal";
import styles from "./styles/ListCustomStrains.module.css";

class ListCustomStrains extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDelete: false,
      chosenStrain: null,
      modalOpen: false
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

  deleteClick = strain => {
    if (typeof this.props.deleteClick === "function") {
      this.props.deleteClick(strain);
    }
  };

  strainClick = strain => {
    this.setState(() => ({ chosenStrain: strain, modalOpen: true }));
  };

  toggleModal = () => {
    this.setState(s => ({ modalOpen: !s.modalOpen }));
  };

  render() {
    const { strains } = this.props;
    let { showDelete, chosenStrain, modalOpen } = this.state;

    const list = strains.map(strain => {
      strain.choices.map(c => c.description);
      return (
        <tr className={styles.link} key={strain.id}>
          <td>
            <div onClick={() => this.strainClick(strain)}>{strain.name}</div>
          </td>
          {showDelete ? (
            <td>
              <DeleteIconButton onClick={() => this.deleteClick(strain)} />
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
                {showDelete ? <th /> : null}
              </tr>
            </thead>
            <tbody>{list}</tbody>
          </Table>
        </Col>
        <CustomStrainModal strain={chosenStrain} isOpen={modalOpen} toggle={this.toggleModal} />
      </Row>
    );
  }
}

export default ListCustomStrains;

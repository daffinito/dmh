import React, { Component } from "react";
import { Alert, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { getQuestionById } from "../../../actions";
import TextInput from "../../TextInput";
import DmhButton from "../../DmhButton";
import styles from "./styles/AddCustomStrain.module.css";
import StrainTypeDropdown from "../../StrainTypeDropdown";
import StrainImagePicker from "./StrainImagePicker";
import QuestionDropdown from "../../QuestionDropdown";

class AddCustomStrain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      type: "",
      desc: "",
      strainValid: true,
      strainImgSrc: "/images/cannabis.jpg",
      strainImageFile: null,
      questions: [],
      strains: this.props.strains,
      q1Val: "",
      q2Val: "",
      q3Val: "",
      q4Val: "",
      q1Valid: true,
      q2Valid: true,
      q3Valid: true,
      q4Valid: true,
      nameValid: true,
      descValid: true,
      typeValid: true,
      conflict: false,
      conflictingStrain: null
    };
  }

  componentDidMount() {
    this.props.getQuestionById(1);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.questionData !== nextProps.questionData) {
      const { questions } = this.state;
      questions.push(nextProps.questionData);
      this.setState(() => ({ questions: questions }));
    }

    if (this.props.strains !== nextProps.strains) {
      this.setState(() => ({ strains: nextProps.strains }));
    }
  }

  nameChange = name => {
    this.setState(() => ({
      name: name,
      nameValid: true
    }));
  };

  descChange = desc => {
    this.setState(() => ({
      desc: desc
    }));
  };

  typeChange = type => {
    this.setState(() => ({
      type: type,
      typeValid: true
    }));
  };

  strainImageChange = image => {
    this.setState(() => ({
      strainImageFile: image,
      strainImgSrc: URL.createObjectURL(image)
    }));
  };

  submit = e => {
    e.preventDefault();

    const strainValid = this.validateStrain();
    //this.props.strainValid(strainValid);
    if (strainValid) {
      const { q1Val, q2Val, q3Val, q4Val, name, desc, strainImageFile, type } = this.state;

      this.props.onSubmit({
        name: name,
        type: type,
        description: desc,
        file: strainImageFile,
        choices: [q1Val.id, q2Val.id, q3Val.id, q4Val.id]
      });
    }
  };

  validateStrain = strain => {
    const { q1Val, q2Val, q3Val, q4Val, name, desc, type, strains } = this.state;
    const choices = [q1Val, q2Val, q3Val, q4Val];
    const checkForExisting = strains.filter(s => {
      const strainChoices = s.choices.map(c => c.id).sort()
      const chosenChoices = choices.map(c => c.id).sort()
      return strainChoices.toString() === chosenChoices.toString();
    });
    if (checkForExisting.length > 0) {
      this.setState(() => ({ conflict: true, conflictingStrain: checkForExisting[0] }));
      return false;
    }
    const q1Valid = !!q1Val;
    const q2Valid = !!q2Val;
    const q3Valid = !!q3Val;
    const q4Valid = !!q4Val;
    const nameValid = name.length > 0 && strains.filter(s => s.name === name).length === 0;
    const descValid = desc.length > 10;
    const typeValid = !!type;
    this.setState(() => ({
      q1Valid: q1Valid,
      q2Valid: q2Valid,
      q3Valid: q3Valid,
      q4Valid: q4Valid,
      nameValid: nameValid,
      descValid: descValid,
      typeValid: typeValid,
      conflict: false,
      conflictingStrain: null
    }));

    return q1Valid && q2Valid && q3Valid && q4Valid && nameValid && typeValid && descValid;
  };

  q1ChoiceChange = choice => {
    //console.log(choice);
    const { questions } = this.state;
    const newArr = [];
    newArr.push(questions[0]);
    this.setState(() => ({ q1Valid: true, questions: newArr, q1Val: choice, q2Val: "", q3Val: "", q4Val: "" }));
    this.props.getQuestionById(choice.followUpQuestionId);
  };

  q2ChoiceChange = choice => {
    //console.log(choice);
    const { questions } = this.state;
    const newArr = [];
    newArr.push(questions[0]);
    newArr.push(questions[1]);
    this.setState(() => ({ q2Valid: true, questions: newArr, q2Val: choice, q3Val: "", q4Val: "" }));
    this.props.getQuestionById(choice.followUpQuestionId);
  };

  q3ChoiceChange = choice => {
    // console.log(choice);
    const { questions } = this.state;
    const newArr = [];
    newArr.push(questions[0]);
    newArr.push(questions[1]);
    newArr.push(questions[2]);
    this.setState(() => ({ q3Valid: true, questions: newArr, q3Val: choice, q4Val: "" }));
    this.props.getQuestionById(choice.followUpQuestionId);
  };

  q4ChoiceChange = choice => {
    //console.log(choice);

    this.setState(() => ({ q4Valid: true, q4Val: choice }));
  };

  dismissAnswersAlert = () => {
    this.setState(() => ({ q1Valid: true, q2Valid: true, q3Valid: true, q4Valid: true }));
  };

  dismissNameAlert = () => {
    this.setState(() => ({ nameValid: true }));
  };

  dismissDescAlert = () => {
    this.setState(() => ({ descValid: true }));
  };

  dismissTypeAlert = () => {
    this.setState(() => ({ typeValid: true }));
  };

  dismissConflictAlert = () => {
    this.setState(() => ({ conflict: false, conflictingStrain: null }));
  };

  render() {
    const {
      strainImgSrc,
      questions,
      q1Valid,
      q2Valid,
      q3Valid,
      q4Valid,
      nameValid,
      descValid,
      typeValid,
      conflict,
      conflictingStrain
    } = this.state;

    return (
      <div className={styles.background}>
        <Row>
          <Col xs="12" md="12">
            <Alert color="danger" isOpen={!q1Valid || !q2Valid || !q3Valid || !q4Valid} toggle={this.dismissAnswersAlert}>
              Please use the dropdowns at the bottom to choose the 4 outcomes for this strain.
            </Alert>
            <Alert color="danger" isOpen={!nameValid} toggle={this.dismissNameAlert}>
              Name cannot be blank or match any of your other strains.
            </Alert>
            <Alert color="danger" isOpen={!descValid} toggle={this.dismissDescAlert}>
              Please write a description (minimum of 10 characters).
            </Alert>
            <Alert color="danger" isOpen={!typeValid} toggle={this.dismissTypeAlert}>
              Please choose a type for this strain.
            </Alert>
            <Alert color="danger" isOpen={conflict} toggle={this.dismissConflictAlert}>
              The choices selected conflict with {conflictingStrain ? conflictingStrain.name : null}. Only 1 custom strain per desired
              outcome is allowed at this time.
            </Alert>
          </Col>
          <Col xs="6" md="6">
            <TextInput type="text" label="Name" id="nameInput" onChange={this.nameChange} valid={nameValid} />
          </Col>
          <Col xs="6" md="6">
            <StrainTypeDropdown id="typeInput" valid={typeValid} onChange={this.typeChange} />
          </Col>
          <Col xs="12" md="12">
            <TextInput type="text" wordwrap rowsMax="3" label="Description" id="descInput" onChange={this.descChange} valid={descValid} />
          </Col>
          <Col xs="12" md="12">
            <StrainImagePicker onImageSelected={this.strainImageChange} img={strainImgSrc} />
          </Col>
          <Col xs="12" md="12">
            {questions.length > 0 ? <QuestionDropdown question={questions[0]} valid={q1Valid} onChange={this.q1ChoiceChange} /> : null}
          </Col>
          <Col xs="12" md="12">
            {questions.length > 1 ? <QuestionDropdown question={questions[1]} valid={q2Valid} onChange={this.q2ChoiceChange} /> : null}
          </Col>
          <Col xs="12" md="12">
            {questions.length > 2 ? <QuestionDropdown question={questions[2]} valid={q3Valid} onChange={this.q3ChoiceChange} /> : null}
          </Col>
          <Col xs="12" md="12">
            {questions.length > 3 ? <QuestionDropdown question={questions[3]} valid={q4Valid} onChange={this.q4ChoiceChange} /> : null}
          </Col>
          <Col xs="6" md="6">
            <DmhButton value="Add Strain" title="Submit" dark clickHandler={e => this.submit(e)} />
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { questionData } = state;
  return {
    questionData
  };
}

export default connect(
  mapStateToProps,
  { getQuestionById }
)(AddCustomStrain);

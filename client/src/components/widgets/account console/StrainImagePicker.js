import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { Alert } from "reactstrap";
import styles from "./styles/StrainImagePicker.module.css";

class StrainImagePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageInvalid: false,
      imgSrc: this.props.img,
      uploading: false
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.img !== nextProps.img) {
      if (typeof nextProps.img !== "undefined" && nextProps.img !== null) {
        this.setState(() => ({
          imgSrc: nextProps.img,
          uploading: false
        }));
      }
    }
  }

  onImageDrop = imageArr => {
    if (imageArr.length < 1) {
      this.setState(() => ({ imageInvalid: true }));
      return;
    }

    const image = imageArr[0];
    if (image.size > 250000) {
      this.setState(() => ({ imageInvalid: true }));
      return;
    }

    // this.setState(() => ({ uploading: true }));
    this.props.onImageSelected(image);
  };

  dismissImageAlert = () => {
    this.setState(() => ({ uploading: false, imageInvalid: false }));
  };

  render() {
    const { uploading, imageInvalid, imgSrc } = this.state;

    const imgOrSpinner = uploading ? (
      <div className={styles.spinner}>
        <i className="fas fa-spinner fa-spin" />
      </div>
    ) : (
      <img className={styles.image} alt="Strain" src={imgSrc} />
    );

    return (
      <div className={styles.logoContainer}>
        <Alert color="danger" isOpen={imageInvalid} toggle={this.dismissImageAlert}>
          Image is not .png or .jpg/.jpeg, or is over 250 Kb in size.
        </Alert>
        <div className={styles.imageContainer}>
          <Dropzone multiple={false} accept="image/png,image/jpeg" onDrop={this.onImageDrop}>
            {({ getRootProps, getInputProps }) => {
              return (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  {imgOrSpinner}
                </div>
              );
            }}
          </Dropzone>
        </div>
        <div className={styles.smallText}>Drag and drop or click to change image.</div>
      </div>
    );
  }
}

export default StrainImagePicker;

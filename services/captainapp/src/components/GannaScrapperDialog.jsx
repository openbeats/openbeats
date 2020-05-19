import React, { Component } from "react";
import "../assets/styles/gannascrapperdialog.css";
import { connect } from "react-redux";
import { gannaScrapper } from "../actions"
class GannaScrapperDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gannaUrl: "",
      isGannaUrl: false,
      htmlContent: "",
      isNotValid: true
    };
  }
  closeHandler = () => {
    this.props.toggleScrapperDialog(false)
  }

  gannaUrlChangeHandler = async (e) => {
    await this.setState({ gannaUrl: e.target.value });
    if (this.state.gannaUrl !== "") {
      this.setState({ isGannaUrl: true });
    } else {
      this.setState({ isGannaUrl: false });
    }
  }

  htmlContentChnageHandler = async (e) => {
    await this.setState({ htmlContent: e.target.value });
    this.checkIsNotValid();
  }

  checkIsNotValid = () => {
    (this.state.gannaUrl !== "" && this.state.htmlContent !== "") ? (this.setState({ isNotValid: false })) : (this.setState({ isNotValid: true }))
  }

  initFetchHandler = () => {
    const reqBody = {
      gannaUrl: this.state.gannaUrl,
      htmlContent: this.state.htmlContent
    };
  }

  render() {
    return (
      <div className="ganna-dialog-container">
        <div className="ganna-dialog-wrapper">
          <div className="ganna-dialog-header">
            <div className="ganna-dialog-header-left-items">
              <i className="fas fa-angle-right mr-1 right-angel mr-2"></i>
              <span>Fetch songs from Ganna Playlists</span>
            </div>
            <div className="create-album-link bg-danger cursor-pointer" onClick={this.closeHandler}>
              <i className="fas fa-times"></i>
            </div>
          </div>
          <div className="ganna-dialog-input-container">
            <div className="ganna-name-input d-flex flex-column align-items-center justify-content-center mb-4">
              <div className="font-weight-bold mb-2 ganna-input-title">Ganna Album Url</div>
              <input
                className="ganna-input input-sm rounded ganna-name-input"
                required
                value={this.state.gannaUrl}
                onChange={this.gannaUrlChangeHandler}
                placeholder=""
                type="text"
              />
            </div>
            {this.state.isGannaUrl && (
              <div className="ganna-name-input d-flex flex-column align-items-center justify-content-center mb-4">
                <div className="font-weight-bold mb-2 ganna-input-title">Go to the below link and paste the HTML content</div>
                <span>{`view-source:${this.state.gannaUrl}`}</span>
              </div>
            )}
            <div className="ganna-name-input d-flex flex-column align-items-center justify-content-center mb-4">
              <div className="font-weight-bold mb-2 ganna-input-title">Html Content</div>
              <textarea className="ganna-input" aria-label="With textarea" value={this.state.htmlContent} onChange={this.htmlContentChnageHandler}></textarea>
            </div>
            <div className="ganna-name-input d-flex flex-column align-items-center justify-content-center mb-4">
              <button type="button" class="btn btn-success" disabled={this.state.isNotValid} onClick={this.initFetchHandler} >Init Fetch</button>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

const mapStateToProps = state => {
  return {
    songsBucketCallback: state.gannaScrapper.songsBucketCallback
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleScrapperDialog: (value) => {
      const payload = { isOpened: value };
      return gannaScrapper.toggleScrapperDialog(payload);
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GannaScrapperDialog);

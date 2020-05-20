import React, { Component } from "react";
import "../assets/styles/gannascrapperdialog.css";
import { connect } from "react-redux";
import { gannaScrapper } from "../actions"
import axios from "axios";
import { variables } from "../config";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";

class GannaScrapperDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gannaUrl: "",
      isGannaUrl: false,
      htmlContent: "",
      isNotValid: true,
      isProcessing: false,
      totalTitles: null,
      fetchedTitles: null,
      scrapperReqCounter: 0,
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
    (this.state.gannaUrl !== "" || this.state.htmlContent !== "") ? (this.setState({ isNotValid: false })) : (this.setState({ isNotValid: true }))
  }

  initFetchHandler = async () => {
    const formData = new FormData();
    formData.append("playlistUrl", this.state.gannaUrl);
    formData.append("htmlContent", this.state.htmlContent);
    axios({
      method: 'post',
      url: `${variables.baseUrl}/scrapper/fetchsongs`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response) => {
        this.setState({ isProcessing: true });
        const initFetch = response.data;
        if (initFetch.status) {
          if (initFetch.processing) {
            this.initFetchHandler();
          } else {
            this.setState({ isProcessing: false });
            const songs = initFetch.data.data
            const numOfSongs = initFetch.data.audioObjsFetched
            if (Array.isArray(songs)) {
              this.props.songsBucketCallback(songs);
            }
            this.props.toggleScrapperDialog(false);
            toast.success(`${numOfSongs} songs has been added..`);
          }
          (initFetch.data.audioTitlesInGaana) && (this.setState({ totalTitles: initFetch.data.audioTitlesInGaana }));
          (initFetch.data.audioObjsFetched) && (this.setState({ fetchedTitles: initFetch.data.audioObjsFetched }));
        } else {
          this.setState({ isProcessing: false });
          this.props.toggleScrapperDialog(false);
          toast.error("Something went wrong...");
        }
      })
      .catch((err) => {
        this.setState({ isProcessing: false });
        console.error(err);
        this.props.toggleScrapperDialog(false);
        toast.error("Something went wrong...");
      })
  }

  render() {
    return (
      <div className="ganna-dialog-container">
        <div className="ganna-dialog-wrapper">
          {
            this.state.isProcessing ? (
              <div className="ganna-dialog-container">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                    </div>
                    <div class="modal-body">
                      <span>{(this.state.totalTitles && this.state.fetchedTitles) ? (`${this.state.fetchedTitles} out ${this.state.totalTitles} songs fetched..`) : ("Fetching songs...")}</span>
                      <Loader
                        type="ThreeDots"
                        color="#F32C2C"
                      />
                    </div>
                    <div class="modal-footer">
                      <strong>Please Wait !!!</strong>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
                <>
                  <div className="ganna-dialog-header">
                    <div className="ganna-dialog-header-left-items">
                      <i className="fas fa-angle-right mr-1 right-angel mr-2"></i>
                      <span>Fetch songs from Ganna/Wynk Playlists</span>
                    </div>
                    <div className="create-album-link bg-danger cursor-pointer" onClick={this.closeHandler}>
                      <i className="fas fa-times"></i>
                    </div>
                  </div>
                  <div className="ganna-dialog-input-container">
                    <div className="ganna-name-input d-flex flex-column align-items-center justify-content-center mb-4">
                      <div className="font-weight-bold mb-2 ganna-input-title">Album Url</div>
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
                      <button type="button" className="btn btn-success" disabled={this.state.isNotValid} onClick={this.initFetchHandler} >Init Fetch</button>
                    </div>
                  </div>
                </>
              )
          }
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

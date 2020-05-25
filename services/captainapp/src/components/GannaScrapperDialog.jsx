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
      htmlContentfile: {},
      htmlContentfileName: "",
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
  }

  htmlContentChnageHandler = async (e) => {
    await this.setState({ htmlContentfile: e.target.files[0], htmlContentfileName: e.target.files[0].name });
    this.checkIsNotValid();
  }

  checkIsNotValid = () => {
    (this.state.gannaUrl !== "" || this.state.htmlContentfile.name) ? (this.setState({ isNotValid: false })) : (this.setState({ isNotValid: true }))
  }
  submitHandler = (e) => {
    e.preventDefault();
    this.initFetchHandler();
  }

  initFetchHandler = async () => {
    this.setState({ isProcessing: true });
    const formData = new FormData();
    formData.append("playlistUrl", this.state.gannaUrl);
    formData.append("htmlContent", this.state.htmlContentfile);
    axios({
      method: 'post',
      url: `${variables.baseUrl}/scrapper/fetchsongs`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response) => {
        const initFetch = response.data;
        if (initFetch.status) {
          if (initFetch.processing) {
            this.initFetchHandler();
          } else {
            this.setState({ isProcessing: false });
            const songs = initFetch.data.data
            const artists = initFetch.data.artists
            const numOfSongs = initFetch.data.audioObjsFetched
            if (Array.isArray(songs)) {
              this.props.songsBucketCallback(songs);
            }
            if (Array.isArray(artists)) {
              const artistStr = artists.join(", ");
              this.props.setFetchedArtistCallback(artistStr);
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
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLongTitle">Fetch Initiated</h5>
                    </div>
                    <div className="modal-body">
                      <span>{(this.state.totalTitles && this.state.fetchedTitles) ? (`${this.state.fetchedTitles} out ${this.state.totalTitles} songs fetched..`) : ("Fetching songs...")}</span>
                      <Loader
                        type="ThreeDots"
                        color="#F32C2C"
                      />
                    </div>
                    <div className="modal-footer">
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
                  <div className="ganna-dialog-input-container m-5">
                    <div className="form-group">
                      <label htmlFor="albumUrl">Album Url</label>
                      <input type="email" className="form-control" id="albumUrl" aria-describedby="albumUrlHelp" placeholder="Enter Album Url" value={this.state.gannaUrl} onChange={this.gannaUrlChangeHandler} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="htmlFile">HTML Content</label>
                      <input type="file" className="form-control-file" id="htmlFile" onChange={this.htmlContentChnageHandler} />
                    </div>
                    <div className="d-flex justify-content-center">
                      <button type="button" className="btn btn-success" disabled={this.state.isNotValid} onClick={this.submitHandler} >Init Fetch</button>
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
    songsBucketCallback: state.gannaScrapper.songsBucketCallback,
    setFetchedArtistCallback: state.gannaScrapper.setFetchedArtistCallback,
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

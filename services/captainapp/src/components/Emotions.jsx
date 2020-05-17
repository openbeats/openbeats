import React, { Component, Fragment } from "react";
import "../assets/styles/albums.css";
import { coreActions, toggleResource } from "../actions";
import { connect } from "react-redux";
import axios from "axios";
import { variables } from "../config";
import { store } from "../store";
import { push } from "connected-react-router";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";

class Emotions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emotionsCollection: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.props.setCurrentNavItem("emotions");
    this.fetchEmotions();
  }

  async createEmotion(e) {
    try {
      const payload = {
        isOpened: true,
        resourceType: "Emotion",
      };
      const data = await this.props.toggleResourceDialog(payload);
      if (data["status"]) {
        await this.fetchEmotions();
        toast.success("Emotion Created Successfully!");
      } else {
        toast.error(data["data"]);
      }
      await this.setState({ isLoading: false });
    } catch (error) {
      toast.error(error.toString());
    }
  }

  async fetchEmotions() {
    try {
      const emotionFetchUrl = `${variables.baseUrl}/playlist/emotion/all?page=1&limit=1000`;
      const resultData = (await axios.get(emotionFetchUrl)).data;
      if (resultData.status) {
        this.setState({ emotionsCollection: resultData.data.result });
      } else {
        this.setState({ emotionsCollection: [] });
      }
      this.setState({ isLoading: false });
    } catch (error) {
      toast.error(error.toString());
    }
  }

  editPermission(createdBy) {
    return [2, 3].includes(this.props.adminDetails.accessLevel) || createdBy === this.props.adminDetails.id;
  }

  async editEmotion(index) {
    try {
      const editEmotionId = this.state.emotionsCollection[index]._id;
      const emotionName = this.state.emotionsCollection[index].name;
      const emotionUrl = this.state.emotionsCollection[index].thumbnail;
      const payload = {
        isOpened: true,
        isEdit: true,
        resourceType: "Emotion",
        resourceId: editEmotionId,
        resourceName: emotionName,
        resourceImageUrl: emotionUrl,
      };
      const data = await this.props.toggleResourceDialog(payload);
      if (data["status"]) {
        await this.fetchEmotions();
        toast.success("Emotion Updated Successfully!");
      } else {
        toast.error(data["data"]);
      }
    } catch (error) {
      toast.error(error.toString());
    }
  }

  deletePermission() {
    return [2, 3].includes(this.props.adminDetails.accessLevel);
  }

  async deleteEmotion(index) {
    try {
      const deleteEmotionId = this.state.emotionsCollection[index]._id;
      const deleteEmotionUrl = `${variables.baseUrl}/playlist/emotion/${deleteEmotionId}`;
      const resultData = (await axios.delete(deleteEmotionUrl)).data;
      if (resultData.status) {
        await this.fetchEmotions();
        toast.success("Emotion Deleted Successfully!");
      } else toast.error(resultData.data.toString());
    } catch (error) {
      toast.error(error.toString());
    }
  }

  render() {
    return (
      <div className="albums-wrapper">
        <div className="albums-header">
          <div className="album-indicator d-flex align-items-center font-weight-bold base-color h5-responsive">
            <i className="fas fa-angle-right mr-1 right-angel"></i>Emotions
					</div>
          <div className="create-album-link font-weight-bold cursor-pointer text-white" onClick={e => this.createEmotion(e)}>
            <i className="far fa-plus mr-1"></i>&nbsp;Add Emotion
					</div>
        </div>
        {this.state.isLoading ? (
          <div className="preloader-wrapper">
            <Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
          </div>
        ) : (
            <Fragment>
              <div className="albums-container">
                {this.state.emotionsCollection.map((item, key) => (
                  <div className="album-holder" style={{ backgroundImage: `url(${item.thumbnail})` }} key={key}>
                    {this.editPermission(item.createdBy) ? (
                      <div className="album-btn-rounded album-edit-button cursor-pointer" onClick={e => this.editEmotion(key)}>
                        <i className="fas fa-pencil-alt"></i>
                      </div>
                    ) : (
                        <a
                          className="album-btn-rounded album-view-button cursor-pointer"
                          title={`View on ${variables.clientUrl}`}
                          href={`${variables.clientUrl}/emotion/${item._id}`}
                          target="_blank"
                          rel="noopener noreferrer">
                          <i className="fas fa-eye"></i>
                        </a>
                      )}
                    {this.deletePermission() && (
                      <div className="album-btn-rounded album-delete-button cursor-pointer" onClick={e => this.deleteEmotion(key)}>
                        <i className="far fa-trash-alt"></i>
                      </div>
                    )}
                    <div className="album-description">
                      <div className="album-title">{item.name}</div>
                    </div>
                  </div>
                ))}
                {this.state.emotionsCollection.length === 0 && (
                  <div className="font-weight-bold h5-responsive w-100 h-100 d-flex align-items-center text-dark justify-content-center">
                    No Albums found in the Server!
                  </div>
                )}
              </div>
            </Fragment>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    adminDetails: state.auth.adminDetails,
    currentNavItem: state.core.currentNavItem,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentNavItem: item => {
      coreActions.setCurrentNavItem(item);
    },
    pushpath: path => {
      store.dispatch(push(path));
    },
    toggleResourceDialog: (payload) => {
      return toggleResource.toggleResorceDialog(payload);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Emotions);

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

class Languages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languagesCollection: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.props.setCurrentNavItem("languages");
    this.fetchLanguages();
  }

  async createLanguage() {
    try {
      const payload = {
        isOpened: true,
        resourceType: "Language",
      };
      const data = await this.props.toggleResourceDialog(payload);
      if (data["status"]) {
        await this.fetchLanguages();
        toast.success("Language Created Successfully!");
      } else {
        toast.error(data["data"]);
      }
      await this.setState({ isLoading: false });
    } catch (error) {
      toast.error(error.toString());
    }
  }

  async fetchLanguages() {
    try {
      const languageFetchUrl = `${variables.baseUrl}/playlist/language/all?page=1&limit=1000`;
      const resultData = (await axios.get(languageFetchUrl)).data;
      if (resultData.status) {
        this.setState({ languagesCollection: resultData.data.result });
      } else {
        this.setState({ languagesCollection: [] });
      }
      this.setState({ isLoading: false });
    } catch (error) {
      toast.error(error.toString());
    }
  }

  editPermission(createdBy) {
    return [2, 3].includes(this.props.adminDetails.accessLevel) || createdBy === this.props.adminDetails.id;
  }

  async editLanguage(index) {
    try {
      const editLanguageId = this.state.languagesCollection[index]._id;
      const languageName = this.state.languagesCollection[index].name;
      const languageUrl = this.state.languagesCollection[index].thumbnail;
      const payload = {
        isOpened: true,
        isEdit: true,
        resourceType: "Language",
        resourceId: editLanguageId,
        resourceName: languageName,
        resourceImageUrl: languageUrl,
      };
      const data = await this.props.toggleResourceDialog(payload);
      if (data["status"]) {
        await this.fetchLanguages();
        toast.success("Language Updated Successfully!");
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
  async deleteLanguage(index) {
    try {
      const deleteLanguageId = this.state.languagesCollection[index]._id;
      const deleteLanguageUrl = `${variables.baseUrl}/playlist/language/${deleteLanguageId}`;
      const resultData = (await axios.delete(deleteLanguageUrl)).data;
      if (resultData.status) {
        await this.fetchLanguages();
        toast.success("Language Deleted Successfully!");
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
            <i className="fas fa-angle-right mr-1 right-angel"></i>Languages
					</div>
          <div className="create-album-link font-weight-bold cursor-pointer text-white" onClick={e => this.createLanguage()}>
            <i className="far fa-plus mr-1"></i>&nbsp;Add Language
					</div>
        </div>
        {this.state.isLoading ? (
          <div className="preloader-wrapper">
            <Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
          </div>
        ) : (
            <Fragment>
              <div className="albums-container">
                {this.state.languagesCollection.map((item, key) => (
                  <div className="album-holder" style={{ backgroundImage: `url(${item.thumbnail})` }} key={key}>
                    {this.editPermission(item.createdBy) ? (
                      <div className="album-btn-rounded album-edit-button cursor-pointer" onClick={e => this.editLanguage(key)}>
                        <i className="fas fa-pencil-alt"></i>
                      </div>
                    ) : (
                        <a
                          className="album-btn-rounded album-view-button cursor-pointer"
                          title={`View on ${variables.clientUrl}`}
                          href={`${variables.clientUrl}/language/${item._id}`}
                          target="_blank"
                          rel="noopener noreferrer">
                          <i className="fas fa-eye"></i>
                        </a>
                      )}
                    {this.deletePermission() && (
                      <div className="album-btn-rounded album-delete-button cursor-pointer" onClick={e => this.deleteLanguage(key)}>
                        <i className="far fa-trash-alt"></i>
                      </div>
                    )}
                    <div className="album-description">
                      <div className="album-title">{item.name}</div>
                    </div>
                  </div>
                ))}
                {this.state.languagesCollection.length === 0 && (
                  <div className="font-weight-bold h5-responsive w-100 h-100 d-flex align-items-center text-dark justify-content-center">
                    No Languages found in the Server!
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

export default connect(mapStateToProps, mapDispatchToProps)(Languages);

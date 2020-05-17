import React, { Component, Fragment } from "react";
import "../assets/styles/albums.css";
import { coreActions, toggleResourceDialog } from "../actions";
import { connect } from "react-redux";
import axios from "axios";
import { variables } from "../config";
import { store } from "../store";
import { push } from "connected-react-router";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";

class Artists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artistsCollection: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.props.setCurrentNavItem("artists");
    this.fetchArtists();
  }

  async createArtist() {
    try {
      const payload = {
        isOpened: true,
        resourceType: "Artist",
      };
      const data = await this.props.toggleResourceDialog(payload);
      if (data["status"]) {
        await this.fetchArtists();
        toast.success("Artist Created Successfully!");
      } else {
        toast.error(data["data"]);
      }
      await this.setState({ isLoading: false });
    } catch (error) {
      console.error(error.message);
      console.log(typeof toggleResourceDialog)
      toast.error(error.toString());
    }
  }

  async fetchArtists() {
    try {
      const artistFetchUrl = `${variables.baseUrl}/playlist/artist/all?page=1&limit=1000`;
      const resultData = (await axios.get(artistFetchUrl)).data;
      if (resultData.status) {
        this.setState({ artistsCollection: resultData.data.result });
      } else {
        this.setState({ artistsCollection: [] });
      }
      this.setState({ isLoading: false });
    } catch (error) {
      toast.error(error.toString());
    }
  }

  editPermission(createdBy) {
    return [2, 3].includes(this.props.adminDetails.accessLevel) || createdBy === this.props.adminDetails.id;
  }

  async editArtist(index) {
    try {
      const editArtistId = this.state.artistsCollection[index]._id;
      const artistName = this.state.artistsCollection[index].name;
      const artistUrl = this.state.artistsCollection[index].thumbnail;
      const payload = {
        isOpened: true,
        isEdit: true,
        resourceType: "Artist",
        resourceId: editArtistId,
        resourceName: artistName,
        resourceImageUrl: artistUrl,
      };
      const data = await this.props.toggleResourceDialog(payload);
      if (data["status"]) {
        await this.fetchArtists();
        toast.success("Artist Updated Successfully!");
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
  async deleteArtist(index) {
    try {
      const deleteArtistId = this.state.artistsCollection[index]._id;
      const deleteArtistUrl = `${variables.baseUrl}/playlist/artist/${deleteArtistId}`;
      const resultData = (await axios.delete(deleteArtistUrl)).data;
      if (resultData.status) {
        await this.fetchArtists();
        toast.success("Artist Deleted Successfully!");
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
            <i className="fas fa-angle-right mr-1 right-angel"></i>Artists
					</div>
          <div className="create-album-link font-weight-bold cursor-pointer text-white" onClick={e => this.createArtist()}>
            <i className="far fa-plus mr-1"></i>&nbsp;Add Artist
					</div>
        </div>
        {this.state.isLoading ? (
          <div className="preloader-wrapper">
            <Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
          </div>
        ) : (
            <Fragment>
              <div className="albums-container">
                {this.state.artistsCollection.map((item, key) => (
                  <div className="album-holder" style={{ backgroundImage: `url(${item.thumbnail})` }} key={key}>
                    {this.editPermission(item.createdBy) ? (
                      <div className="album-btn-rounded album-edit-button cursor-pointer" onClick={e => this.editArtist(key)}>
                        <i className="fas fa-pencil-alt"></i>
                      </div>
                    ) : (
                        <a
                          className="album-btn-rounded album-view-button cursor-pointer"
                          title={`View on ${variables.clientUrl}`}
                          href={`${variables.clientUrl}/artist/${item._id}/all`}
                          target="_blank"
                          rel="noopener noreferrer">
                          <i className="fas fa-eye"></i>
                        </a>
                      )}
                    {this.deletePermission() && (
                      <div className="album-btn-rounded album-delete-button cursor-pointer" onClick={e => this.deleteArtist(key)}>
                        <i className="far fa-trash-alt"></i>
                      </div>
                    )}
                    <div className="album-description">
                      <div className="album-title">{item.name}</div>
                    </div>
                  </div>
                ))}
                {this.state.artistsCollection.length === 0 && (
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
      return toggleResourceDialog.toggleResorceDialog(payload);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Artists);

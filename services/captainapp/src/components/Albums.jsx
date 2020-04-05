import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import "../assets/styles/albums.css";
import { coreActions } from '../actions';
import { connect } from 'react-redux';
import axios from "axios";
import { variables } from '../config';
import { store } from '../store';
import { push } from 'connected-react-router';
import { toast } from 'react-toastify';

class Albums extends Component {

    constructor(props) {
        super(props);
        this.state = {
            albumsCollection: []
        }
    }

    componentDidMount() {
        this.props.setCurrentNavItem("albums");
        this.fetchAlbums();
    }

    fetchAlbums = async () => {
        const albumsFetchUrl = `${variables.baseUrl}/playlist/album/all?page=1&limit=1000`;
        const resultData = (await axios.get(albumsFetchUrl)).data;
        if (resultData.status) {
            this.setState({ albumsCollection: resultData.data.result })
        } else {
            this.setState({ albumsCollection: [] })
        }
    }

    editAlbum = (index) => {
        const editAlbumId = this.state.albumsCollection[index]._id;
        this.props.pushpath(`/albums/dashyard?editalbum=${editAlbumId}`);
    }

    deleteAlbum = async (index) => {
        const deleteAlbumId = this.state.albumsCollection[index]._id;
        const deleteAlbumUrl = `${variables.baseUrl}/playlist/album/${deleteAlbumId}`;
        const resultData = (await axios.delete(deleteAlbumUrl)).data;
        if (resultData.status) {
            toast.success("Album Deleted Successfully!");
            this.fetchAlbums();
        }
        else toast.error(resultData.data.toString());
    }

    render() {
        return (
            <div className="albums-wrapper">
                <div className="albums-header">
                    <div className="album-indicator d-flex align-items-center font-weight-bold base-color h5-responsive">
                        <i className="fas fa-angle-right mr-1 right-angel"></i>Albums
                    </div>
                    <div className="album-search-input">
                        <input className="input input-sm red-border" type="text" placeholder="Search Albums, Artists, Languages..." aria-label="Search" />
                        <i className="fas fa-search text-grey cursor-pointer" aria-hidden="true"></i>
                    </div>
                    <Link className="create-album-link font-weight-bold cursor-pointer text-white" to="/albums/dashyard"><i className="far fa-plus mr-1"></i>&nbsp;Create Album</Link>
                </div>
                <div className="albums-container">
                    {this.state.albumsCollection.map((item, key) => (
                        <div className="album-holder" style={{ backgroundImage: `url(${item.thumbnail})` }} key={key}>
                            <div className="album-btn-rounded album-edit-button cursor-pointer">
                                <i className="fas fa-pencil-alt" onClick={e => this.editAlbum(key)}></i>
                            </div>
                            <div className="album-btn-rounded album-delete-button cursor-pointer">
                                <i className="far fa-trash-alt" onClick={e => this.deleteAlbum(key)}></i>
                            </div>
                            <div className="album-btn-rounded album-song-count p-events-none">{item.totalSongs}</div>
                            <div className="album-description">
                                <div className="album-title">{item.name}</div>
                                <div className="album-creation-date">28 March 2020</div>
                                <div className="album-created-by">by OpenBeats</div>
                            </div>
                        </div>
                    ))}
                    {this.state.albumsCollection.length === 0 &&
                        <div className="font-weight-bold h5-responsive w-100 h-100 d-flex align-items-center text-dark justify-content-center">
                            No Albums found in the Server!
                        </div>
                    }
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        adminDetails: state.auth.adminDetails,
        currentNavItem: state.core.currentNavItem
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentNavItem: (item) => {
            coreActions.setCurrentNavItem(item);
        },
        pushpath: (path) => {
            store.dispatch(push(path));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Albums);
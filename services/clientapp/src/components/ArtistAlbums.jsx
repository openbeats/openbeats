import React, { Component } from 'react';
import { toastActions, coreActions } from "../actions";
import "../css/artistalbums.css";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { musicDummy } from '../images';
import { AlbumHolder } from '.';
import axios from "axios";
import Loader from 'react-loader-spinner';
import { variables } from '../config';

class ArtistAlbums extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            artistAlbums: [],
            isLoading: true
        };
        this.state = { ...this.initialState }
    }

    componentDidMount() {
        this.props.setCurrentAction("Artist Albums");
        this.fetchArtistAlbumsHandler();
    }


    fetchArtistAlbumsHandler = async () => {
        const artistsFetchUrl = `${variables.baseUrl}/playlist/artist/${this.props.match.params.id}/releases`;
        const data = (await axios.get(artistsFetchUrl)).data;
        console.log(data);
        if (data.status) {
            this.setState({ isLoading: false, artists: data.data.result });
        } else {
            this.props.notify(data.data.toString());
            this.props.push("/");
        }
    }


    componentWillUnmount() {
        this.setState({ ...this.initialState });
    }

    render() {
        return this.state.isLoading ?
            <div className="width-100 height-100 d-flex align-items-center justify-content-center">
                <Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
            </div> :
            <div className="artist-albums-wrapper">
                <div className="artist-albums-header-image-holder" style={{ backgroundImage: `url(), url(${musicDummy})` }}>
                    <div className="artist-albums-artist-name">A R Rahman</div>
                </div>
                <div className="artist-albums-main-container">
                    <AlbumHolder />
                    <AlbumHolder />
                    <AlbumHolder />
                    <AlbumHolder />
                    <AlbumHolder />
                </div>
            </div>
    }
}

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        push: (path) => {
            dispatch(push(path))
        },
        notify: (message) => {
            toastActions.showMessage(message)
        },
        featureNotify: () => {
            toastActions.featureNotify()
        },
        setCurrentAction: (action) => {
            dispatch(coreActions.setCurrentAction(action))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtistAlbums);

import React, { Component } from 'react';
import { toastActions, coreActions } from "../actions";
import "../css/artists.css";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { musicDummy } from '../images';
import axios from "axios";
import Loader from "react-loader-spinner";
import { variables } from '../config';

class Artists extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            artists: [],
            isLoading: true
        }
        this.state = { ...this.initialState };
    }

    componentDidMount() {
        this.props.setCurrentAction("Artists");
        this.fetchArtistHandler();

    }

    fetchArtistHandler = async () => {
        const artistsFetchUrl = `${variables.baseUrl}/playlist/artist/all?page=1&limit=10000`;
        const data = (await axios.get(artistsFetchUrl)).data;
        if (data.status) {
            this.setState({ isLoading: false, artists: data.data.result });
        } else {
            this.props.notify(data.data.toString());
        }
    }

    aritstClickHandler = async (id) => {
        this.props.push("/artists/" + id);
    }

    componentWillUnmount() {
        this.setState({ ...this.initialState });
    }

    render() {
        return this.state.isLoading ?
            <div className="width-100 height-100 d-flex align-items-center justify-content-center">
                <Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
            </div> :
            <div className="artists-wrapper">
                {this.state.artists.map((item, key) => (
                    <div className="artist-display-holder cursor-pointer" onClick={() => this.aritstClickHandler(item._id)} key={key}>
                        <div className="artist-rounded-circle-holder" style={{ backgroundImage: `url('${item.thumbnail}'), url(${musicDummy})` }}></div>
                        <div className="artist-name">{item.name}</div>
                        <div className="artist-description">Artist</div>
                    </div>
                ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(Artists);

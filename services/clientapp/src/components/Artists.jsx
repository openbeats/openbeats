import React, { Component } from 'react';
import { toastActions, coreActions } from "../actions";
import "../assets/css/artists.css";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import axios from "axios";
import Loader from "react-loader-spinner";
import { variables } from '../config';
import { ArtistHolder } from '.';

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
                    <ArtistHolder
                        key={key}
                        id={item._id}
                        name={item.name}
                        thumbnail={item.thumbnail}
                    />
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

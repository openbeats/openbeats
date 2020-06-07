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
            isLoading: true,
            next: true,
            previous: false,
            page: 1,
            limit: 20,
            isScrollFetchInProcess: false,
        }
        this.observer = null;
        this.intersectElement = null;
        this.state = { ...this.initialState };
    }

    async componentDidMount() {
        this.props.setCurrentAction("Artists");
        await this.fetchArtistHandler();
        this.initiateScrollFetcher();
    }

    initiateScrollFetcher() {
        let options = {
            root: document.getElementById("main-body"),
            rootMargin: '0px',
            threshold: 1
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.intersectionRatio >= 0.95) {
                        this.fetchArtistHandler();
                    }
                }
            });
        }, options);

        if (this.intersectElement)
            this.observer.observe(this.intersectElement);

    }

    fetchArtistHandler = async () => {
        if (this.state.next && !this.state.isScrollFetchInProcess) {
            this.setState({ isScrollFetchInProcess: true })
            const artistsFetchUrl = `${variables.baseUrl}/playlist/artist/all?page=${this.state.page}&limit=${this.state.limit}`;
            const data = (await axios.get(artistsFetchUrl)).data;
            if (data.status) {
                this.setState({
                    isLoading: false,
                    artists: [...this.state.artists, ...data.data.result],
                    page: data.data.next ? this.state.page + 1 : this.state.page,
                    next: data.data.next ? true : false,
                    previous: data.data.previous ? true : false,
                    isScrollFetchInProcess: false
                });
            } else {
                this.props.notify(data.data.toString());
            }
        }
    }

    componentWillUnmount() {
        this.setState({ ...this.initialState });
        if (this.observer) this.observer.disconnect();
    }

    render() {
        return this.state.isLoading ?
            <div className="width-100 height-100 d-flex align-items-center justify-content-center">
                <Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
            </div> : (
                <>
                    <div className="artists-wrapper">
                        {this.state.artists.map((item, key) => (
                            <ArtistHolder
                                key={key}
                                id={item._id}
                                name={item.name}
                                thumbnail={item.thumbnail}
                            />
                        ))}
                        <div ref={d => this.intersectElement = d} className="intersection-holder"></div>
                    </div>
                    {this.state.isScrollFetchInProcess && <div className="mt-2 width-100 d-flex align-items-center justify-content-center">
                        <Loader color="#F32C2C" type="TailSpin" height={30} width={30} />
                    </div>}
                </>
            )
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

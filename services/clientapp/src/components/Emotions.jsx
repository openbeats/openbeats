import React, { Component } from 'react';
import { toastActions, coreActions } from "../actions";
import "../assets/css/emotions.css";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import axios from "axios";
import Loader from "react-loader-spinner";
import { variables } from '../config';
import { Emotion } from '.';

class Emotions extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            emotions: [],
            isLoading: true,
            next: true,
            previous: false,
            page: 1,
            limit: 20,
            isScrollFetchInProcess: false,
        }
        this.state = { ...this.initialState };
    }

    componentDidMount() {
        this.props.setCurrentAction("Emotions");
        this.fetchLanguagesHandler();
        this.initiateScrollFetcher();
    }

    initiateScrollFetcher() {
        const mainBodyRef = document.getElementById("main-body");
        mainBodyRef.addEventListener('scroll', this.scrollFetch);
    }

    scrollFetch = (e) => {
        const totalHeight = e.target.scrollHeight - e.target.offsetHeight;
        if (e.target.scrollTop === totalHeight) {
            this.fetchLanguagesHandler();
        }
    }


    fetchLanguagesHandler = async () => {
        if (this.state.next && !this.state.isScrollFetchInProcess) {
            this.setState({ isScrollFetchInProcess: true })
            const emotionsFetchUrl = `${variables.baseUrl}/playlist/emotion/all?page=${this.state.page}&limit=${this.state.limit}`;
            const data = (await axios.get(emotionsFetchUrl)).data;
            if (data.status) {
                this.setState({
                    isLoading: false,
                    emotions: [...this.state.emotions, ...data.data.result],
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
        const mainBodyRef = document.getElementById("main-body");
        mainBodyRef.removeEventListener("scroll", this.scrollFetch);
    }

    render() {
        return this.state.isLoading ?
            <div className="width-100 height-100 d-flex align-items-center justify-content-center">
                <Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
            </div> : (<>
                <div className="emotions-wrapper">
                    {this.state.emotions.map((item, key) => (
                        <Emotion
                            key={key}
                            id={item._id}
                            name={item.name}
                            thumbnail={item.thumbnail}
                        />
                    ))}
                </div>
                {this.state.isScrollFetchInProcess && <div className="mt-2 width-100 d-flex align-items-center justify-content-center">
                    <Loader color="#F32C2C" type="TailSpin" height={30} width={30} />
                </div>}
            </>)
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

export default connect(mapStateToProps, mapDispatchToProps)(Emotions);

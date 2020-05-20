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
            isLoading: true
        }
        this.state = { ...this.initialState };
    }

    componentDidMount() {
        this.props.setCurrentAction("Emotions");
        this.fetchLanguagesHandler();

    }

    fetchLanguagesHandler = async () => {
        const emotionsFetchUrl = `${variables.baseUrl}/playlist/emotion/all?page=1&limit=10000`; // need to change
        const data = (await axios.get(emotionsFetchUrl)).data;
        if (data.status) {
            this.setState({ isLoading: false, emotions: data.data.result });
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

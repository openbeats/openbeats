import React, { Component } from 'react';
import { toastActions, coreActions } from "../actions";
import "../assets/css/emotion.css";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { musicDummy } from '../assets/images';

class Emotion extends Component {
    render() {
        return (
            <div className="emotion-holder-wrapper cursor-pointer" onClick={() => this.props.push(`/emotions/${this.props.id}`)}>
                <div className="emotion-thumbnail-holder" style={{ backgroundImage: `url('${this.props.thumbnail}'), url(${musicDummy})` }}></div>
                <div className="emotion-description-holder">
                    <div className="emotion-title">
                        {this.props.name}
                    </div>
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(Emotion);

import React, { Component } from 'react';
import { toastActions, coreActions } from "../actions";
import "../assets/css/language.css";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { musicDummy } from '../assets/images';

class Language extends Component {
    render() {
        return (
            <div className="language-holder-wrapper cursor-pointer" onClick={() => this.props.push(`/languages/${this.props.id}`)}>
                <div className="language-thumbnail-holder" style={{ backgroundImage: `url('${this.props.thumbnail}'), url(${musicDummy})` }}></div>
                <div className="language-description-holder">
                    <div className="language-title">
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

export default connect(mapStateToProps, mapDispatchToProps)(Language);

import React, { Component } from 'react';
import { toastActions, coreActions } from "../actions";
import "../assets/css/language.css";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { musicDummy } from '../assets/images';

class Language extends Component {
    Main = () => {
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

    ExploreMore = () => {
        return <div className="language-holder-wrapper album-explore-more cursor-pointer" onClick={() => this.props.push(this.props.exploreMoreUrl)}>
            <div className="explore-more-icon-holer">
                <i class="fas fa-compass"></i>
            </div>
            <div className="explore-more-text-holer">
                Explore More
            </div>
        </div>
    }


    render() {
        return !this.props.exploreMore ? <this.Main /> : <this.ExploreMore />;
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

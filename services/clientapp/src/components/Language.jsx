import React, { Component } from 'react';
import { toastActions, coreActions } from "../actions";
import "../assets/css/language.css";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { musicDummy } from '../assets/images';

class Language extends Component {

    constructor(props) {
        super(props);
        this.shareRef = null;
    }

    shareLanguage = () => {
        if (this.shareRef) {
            const url = `${window.location.origin}/languages/${this.props.id}`
            if (coreActions.copyToClipboard(url)) {
                this.shareRef.classList.add("copied-to-clipboard");
                setTimeout(() => {
                    if (this.shareRef) this.shareRef.classList.remove("copied-to-clipboard");
                }, 3000)
                this.props.notify("Language's Link copied to your clipboard!");
            } else {
                this.props.notify("Cannot Copy Language's Link to your clipboard Automatically, you can manually copy the link from the url!");
            }
        }
    }

    Main = () => {
        return (
            <div className="language-holder-wrapper cursor-pointer" onClick={(e) => {
                if (this.shareRef.contains(e.target))
                    return;
                this.props.push(`/languages/${this.props.id}`);
            }}>
                <div className="language-holer-share-icon-wrapper cursor-pointer">
                    <i className="fas fa-share-alt master-color"
                        ref={d => this.shareRef = d}
                        title="Click to copy this Language's link to your clipboard!"
                        onClick={this.shareLanguage}
                    ></i>
                </div>
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
                <i className="fas fa-compass"></i>
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

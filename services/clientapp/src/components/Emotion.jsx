import React, { Component } from 'react';
import { toastActions, coreActions } from "../actions";
import "../assets/css/emotion.css";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { musicDummy } from '../assets/images';

class Emotion extends Component {
    constructor(props) {
        super(props);
        this.shareRef = null;
    }

    shareEmotion = () => {
        if (this.shareRef) {
            const url = `${window.location.origin}/emotions/${this.props.id}`
            if (coreActions.copyToClipboard(url)) {
                this.shareRef.classList.add("copied-to-clipboard");
                setTimeout(() => {
                    if (this.shareRef) this.shareRef.classList.remove("copied-to-clipboard");
                }, 3000)
                this.props.notify("Emotion's Link copied to your clipboard!");
            } else {
                this.props.notify("Cannot Copy Emotion's Link to your clipboard Automatically, you can manually copy the link from the url!");
            }
        }
    }

    Main = () => {
        return (
            <div className="emotion-holder-wrapper cursor-pointer" onClick={(e) => {
                if (this.shareRef.contains(e.target))
                    return;
                this.props.push(`/emotions/${this.props.id}`)
            }}>
                <div className="emotion-holer-share-icon-wrapper cursor-pointer">
                    <i className="fas fa-share-alt master-color"
                        ref={d => this.shareRef = d}
                        title="Click to copy this Emotion's link to your clipboard!"
                        onClick={this.shareEmotion}
                    ></i>
                </div>
                <div className="emotion-thumbnail-holder" style={{ backgroundImage: `url('${this.props.thumbnail}'), url(${musicDummy})` }}></div>
                <div className="emotion-description-holder">
                    <div className="emotion-title">
                        {this.props.name}
                    </div>
                </div>
            </div>
        );
    }

    ExploreMore = () => {
        return <div className="emotion-holder-wrapper album-explore-more cursor-pointer" onClick={() => this.props.push(this.props.exploreMoreUrl)}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Emotion);

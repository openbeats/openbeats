import React, { Component } from 'react'
import { toastActions, coreActions } from "../actions";
import "../css/home.css"
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { musicDummy } from '../images';


class Home extends Component {
    componentDidMount() {
        this.props.setCurrentAction("Home")
    }
    render() {
        return (
            <div className="home-wrapper">
                <img src={musicDummy} alt="" srcSet="" />
                <div>
                    Home screen content is under development! <br />
                    Give a try to our new playlist feature.. (your playlist - leftnavbar)
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);

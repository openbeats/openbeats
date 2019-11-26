import React, { Component } from 'react'
import { toastActions, coreActions } from "../actions";
import { connect } from "react-redux";
import { push } from "connected-react-router";


class Home extends Component {
    componentDidMount() {
        this.props.setCurrentAction("Home")
    }
    render() {
        return (
            <div>
                Home
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

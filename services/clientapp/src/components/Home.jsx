import React, { Component } from 'react'
import { toastActions, coreActions } from "../actions";
import "../css/home.css"
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { AlbumHolder } from '.';
// import { HorizontalView, AlbumHolder } from '.';

class Home extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            artistCollection: [],
            topChartsCollection: [],
            myCollections: [],
            latestAlbums: [],
            popularAlbums: [],
            surpriseAlbums: [],
        };
        this.state = { ...this.initialState };
    }

    componentDidMount() {
        this.props.setCurrentAction("Home")
    }

    getAlbumList(arrayList) {
        return arrayList.map((item, key) => (
            <AlbumHolder key={key} albumCreatedBy={key.toString()} />
        ))
    }

    getTopChartsList(arrayList) {

    }

    getArtistsList(arrayList) {

    }

    render() {
        return (
            <div className="home-wrapper">
                {/* <HorizontalView
                    elementList={this.getElementList(this.state.sampleCollection)}
                /> */}
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

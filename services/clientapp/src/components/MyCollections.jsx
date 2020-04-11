import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import { push } from 'connected-react-router';
import { toastActions, coreActions } from '../actions';
import { connect } from 'react-redux';


class MyCollections extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            myCollections: [],
        }
    }

    async componentDidMount() {
        this.props.setCurrentAction("My Collections")
    }


    render() {
        return this.state.isLoading ?
            <div className="search-preloader">
                <Loader
                    type="ThreeDots"
                    color="#F32C2C"
                    height={80}
                    width={80}
                />
            </div> :
            <div className="my-collections-wrapper">
                My Collections
            </div>
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        push: path => {
            dispatch(push(path));
        },
        featureNotify: () => {
            toastActions.featureNotify();
        },
        setCurrentAction: (action) => {
            dispatch(coreActions.setCurrentAction(action))
        },
        fetchMyCollection: () => {
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCollections);


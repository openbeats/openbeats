import React, { Component } from "react";
import { connect } from "react-redux";
import { Helmet } from 'react-helmet';

class ReactHelmet extends Component {
    render() {
        return (
            <Helmet>
                <title>{this.props.title}</title>
                <meta name="description" content={this.props.description} />
                <meta property="og:title" content={this.props.title} />
                <meta property="og:description" content={this.props.description} />
                <meta
                    property="og:image"
                    content={this.props.thumbnail}
                />
            </Helmet>
        );
    }
}

const mapStateToProps = state => {
    return {
        title: state.helmetReducer.title,
        description: state.helmetReducer.description,
        thumbnail: state.helmetReducer.thumbnail
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ReactHelmet);

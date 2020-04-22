import React, { Component } from "react";
import "../assets/css/horizontalview.css";

export default class HorizontalView extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            isLeftButtonEnabled: false,
            isRigthButtonEnabled: false,
        };
        this.state = { ...this.initialState };
        this.scrollViewRef = null;
        this.horizontalContainerRef = null;
    }

    componentDidMount() {
        this.scrollButtonDisplayHandler();
        window.addEventListener("resize", this.scrollButtonDisplayHandler);
    }

    programmaticScroll = (scrollRight = true) => {
        var maxScrollLeft = this.scrollViewRef.scrollWidth - this.scrollViewRef.clientWidth;
        if (scrollRight) {
            let right = this.scrollViewRef.scrollLeft + 500;
            this.scrollViewRef.scrollLeft = right <= maxScrollLeft ? right : maxScrollLeft;
        } else {
            let left = this.scrollViewRef.scrollLeft - 500;
            this.scrollViewRef.scrollLeft = left >= 0 ? left : 0;
        }
    }

    scrollButtonDisplayHandler = () => {
        let leftButtonVisiblity = false;
        let rightButtonVisiblity = false;
        var maxScrollLeft = this.scrollViewRef.scrollWidth - this.scrollViewRef.clientWidth;
        if ((maxScrollLeft > 0) && (this.scrollViewRef.scrollLeft < maxScrollLeft))
            rightButtonVisiblity = true;
        if (this.scrollViewRef.scrollLeft > 0)
            leftButtonVisiblity = true
        this.setState({
            isLeftButtonEnabled: leftButtonVisiblity,
            isRigthButtonEnabled: rightButtonVisiblity
        })
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.scrollButtonDisplayHandler);
    }

    render() {
        return (
            <div className="horizontal-view-wrapper" ref={d => this.horizontalContainerRef = d}>
                {this.state.isLeftButtonEnabled && <div className="scroll-button left-scroll-button" onClick={() => this.programmaticScroll(false)}><i className="fas fa-angle-left"></i></div>}
                <div className="horizontal-scroll-view" ref={d => this.scrollViewRef = d} onScroll={this.scrollButtonDisplayHandler}>
                    {this.props.elementList}
                </div>
                {this.state.isRigthButtonEnabled && <div className="scroll-button right-scroll-button" onClick={() => this.programmaticScroll(true)}><i className="fas fa-angle-right"></i></div>}
            </div>
        )
    }
}

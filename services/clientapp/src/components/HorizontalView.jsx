import React, { Component } from "react";
import "../css/horizontalview.css";

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
    }

    render() {
        return (
            <div className="horizontal-view-wrapper" ref={d => this.horizontalContainerRef = d}>
                {this.state.isLeftButtonEnabled && <div className="scroll-button left-scroll-button"><i class="fas fa-angle-left"></i></div>}
                <div className="horizontal-scroll-view" ref={d => this.scrollViewRef = d} >
                    {this.props.elementList}
                </div>
                {this.state.isRigthButtonEnabled && <div className="scroll-button right-scroll-button"><i class="fas fa-angle-right"></i></div>}
            </div>
        )
    }
}

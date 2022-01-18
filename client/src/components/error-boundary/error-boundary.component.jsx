import React, { Component } from "react";
import { withRouter } from "../../utils/router.params.js";
import CustomButton from "../custom-button/custom-button.component.jsx";
import { ErrorImageOverlay, ErrorImageContainer, ErrorImageText } from './error-boundary.styles.jsx'

class ErrorBoundary extends Component {
    constructor() {
        super();
        this.state = {
            hasErrored: false
        }
    }

    static getDerivedStateFromError(error) {
        //process the error
        return {
            hasErrored: true
        }
    }
    componentDidCatch(error, info) {
        console.log(error);
    }
    render() {
        if (this.state.hasErrored) {
            return (

                <ErrorImageOverlay>
                    <ErrorImageContainer imageUrl='https://i.imgur.com/A040Lxr.png' />
                    <ErrorImageText>Sorry, this page is broken</ErrorImageText>
                    <CustomButton onClick={() => this.props.navigate('/')}>Back to Home</CustomButton>
                </ErrorImageOverlay>
            )
        }
        return this.props.children;
    }
}

export default withRouter(ErrorBoundary);
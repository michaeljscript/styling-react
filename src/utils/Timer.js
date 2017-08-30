import React, { Component } from 'react';
import propTypes from 'prop-types';

/**
 * Computes render time of childs
 */
export default class Timer extends Component {

    static propTypes = {
        onRenderFinished: propTypes.func
    };

    constructor(...args) {
        super(...args);
        this.state = { startTime: null };
    }

    shouldComponentUpdate() {
        return true;
    }

    componentDidMount() {
        const { onRenderFinished } = this.props;
        const { startTime } = this.state;

        if (typeof onRenderFinished === 'function') {
            onRenderFinished({ renderTime: (new Date()).getTime() - startTime.getTime() });
        }
    }


    componentWillMount() {
        this.setState({ startTime: new Date() });
    }

    render() {
        const { children } = this.props;
        return children;
    }
}
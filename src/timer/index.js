import { render } from 'react-dom';
import React, { Component } from 'react';
import Timer from './Timer';

const measureTime = /[\?\&]measure_render_time/.test(document.location.search);

export default ({ Button, Input, Title, Label }) => {

    const handleRenderFinished = ({ renderTime }) => {

        if (measureTime) {
            document.location.hash += ',' + renderTime;
            document.location.reload();
        }
    }


    const renderTable = (lines = 10) => {
        const els = [];

        for (let i = 0; i < lines; i++) {
            els.push(<tr key={i}>
                <td><Title>title</Title></td>
                <td><Label>label</Label></td>
                <td><Button>button</Button></td>
                <td><Input type='text' /></td>
            </tr>);
        }

        return <Timer onRenderFinished={handleRenderFinished}>
            <table>
                <tbody>
                    {els}
                </tbody>
            </table>
        </Timer>
    };

    const TABLE_SIZE = 10000;
    const REPEAT_TIMES = 100;

    window.render = render;
    window.renderTable = renderTable;

    if (document.location.hash.split(',').length <= REPEAT_TIMES) {
        render(renderTable(TABLE_SIZE), document.getElementById('app'));
    } else if (measureTime) {
        const getResults = () => window.location.hash.split(',').filter(a => !a.startsWith('#')).join(', ');
        const handleClick = () => prompt("Copy results", getResults());
        render(<button onClick={handleClick}>Copy results</button>, document.getElementById('app'));
    }
}
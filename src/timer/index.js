import { render } from 'react-dom';
import React, { Component } from 'react';
import Timer from './Timer';

const measureTime = /[\?\&]measure_render_time/.test(document.location.search);
const inputRepeatTimes = /[\?\&]repeat_times=([0-9]+)/.exec(document.location.search);
const inputTableSize = /[\?\&]table_size=([0-9]+)/.exec(document.location.search);

const addRecord = (record) => document.location.hash += ',' + record;
const loadRecords = () => window.location.hash.split(',').filter(a => !a.startsWith('#')).map(Number);


export default ({ Button, Input, Title, Label }) => {

    const handleRenderFinished = ({ renderTime }) => {

        if (measureTime) {
            addRecord(renderTime);
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
        </Timer>;
    };

    const TABLE_SIZE = inputTableSize && inputTableSize[1] || 10000;
    const REPEAT_TIMES = inputRepeatTimes && inputRepeatTimes[1] || 100;


    if (loadRecords().length < REPEAT_TIMES) {
        render(renderTable(TABLE_SIZE), document.getElementById('app'));
    } else if (measureTime) {
        const handleClick = () => prompt("Copy results", loadRecords().join(', '));
        render(<button onClick={handleClick}>Copy results</button>, document.getElementById('app'));
    }
}
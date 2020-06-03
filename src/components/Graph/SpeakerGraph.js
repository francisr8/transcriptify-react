import React, { useEffect, useState } from 'react';
import Chart from 'chart.js';
import { Button, ButtonGroup, Row, Col, Input } from 'reactstrap';

const SpeakerGraph = (props) => {
    var chart;
    let bGroup = document.querySelector(".testTypeSpeaker");
    const [metricType, setMetricType] = useState('der');
    const test_data = props.data;
    let ctx = document.getElementById('ctx-speaker');;
    let metric = 'der';

    const renderChart = ((m = 'der') => {
        const colors = [
            '#5e72e4',
            '#2dce89',
            '#11cdef',
            '#fb6340',
            '#8E4174',
            '#D8CE53',
            '#D090C7',
            '#B4362D'
        ];

        let labels;
        let dset = [];
        let currTest;

        bGroup.childNodes.forEach((child) => {
            if (child.getAttribute('class').includes('outline')) {
                currTest = child.innerText.toLowerCase().replace(' ', '_');
            }
        })

        labels = [...Array(10).keys()].map(i => i + 1);

        let options = {
            aspectRatio: 3
        }

        if (test_data !== {}) {
            let index = 0;
            for (let s in test_data) {
                let currData = {}

                let temp = { ...test_data[s].filter(o => o.type === currTest)[0] }.Speaker_data;
                let data = new Array(10).fill(0);

                for (let obj in temp) {
                    let key = obj - 1;
                    data[key] = temp[obj][m];
                }

                currData.data = data;
                currData.label = s;
                currData.backgroundColor = colors[index];
                // currData.fill = 'start';
                dset.push(currData);
                index++;
            }
        }

        ctx = document.getElementById('ctx-speaker');

        if (chart) {
            chart.data.datasets = dset;
            chart.update();
        } else {
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: dset
                },
                options: options
            })
        }
    })

    const resetButtons = (() => {
        const bGroup = document.querySelector(".testTypeSpeaker");
        bGroup.childNodes.forEach((child) => {
            child.setAttribute('class', 'btn btn-primary');
        })
    })

    const changeMetric = ((event) => {
        setMetricType(event.target.value);
        metric = event.target.value;
        renderChart(metric);
    })

    useEffect(() => {
        bGroup = document.querySelector(".testTypeSpeaker");
        bGroup.childNodes.forEach((child) => {
            child.addEventListener('click', () => {
                resetButtons();
                child.classList.add('btn-outline-primary');
                // chart.destroy();
                renderChart(metric);
            })
        })
        renderChart();
    }, [chart]);

    return (
        <>
            <div>
                <Row>
                    <Col md='10'>
                        <ButtonGroup className='testTypeSpeaker'>
                            <Button color='primary' outline>DEFAULT</Button>
                            <Button color='primary'>NOISE25</Button>
                            <Button color='primary'>FX OVERLAY</Button>
                        </ButtonGroup>
                    </Col>
                    <Col md='2' className='flexEnd'>
                        <Input type="select" name="service" id="metricSelect" onChange={changeMetric} value={metricType}>
                            <option value='der'>DER</option>
                            <option value='prec'>Precision</option>
                            <option value='rec'>Recall</option>
                            <option value='cov'>Coverage</option>
                            <option value='pur'>Purity</option>
                        </Input>
                    </Col>
                </Row>
            </div>
            <canvas id='ctx-speaker' className="graph-canvas"></canvas>
        </>
    )
}

export default SpeakerGraph;
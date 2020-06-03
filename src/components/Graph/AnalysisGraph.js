import React, { useEffect } from 'react';
import Chart from 'chart.js';
import { Button, ButtonGroup, Row, Col } from 'reactstrap';

const AnalysisGraph = (props) => {
    let chart;
    let bGroup = document.querySelector(".testTypeBG");
    const test_data = props.data;

    const renderChart = (() => {
        let options = {
            aspectRatio: 3
        };

        const colors = [
            '#5e72e4',
            '#2dce89',
            '#11cdef',
            '#fb6340',
            '#8E4174',
            '#D8CE53',
            '#D090C7',
            '#B4362D'
        ]

        let labels;
        let dset = [];
        let currTest;

        bGroup.childNodes.forEach((child) => {
            if (child.getAttribute('class').includes('outline')) {
                currTest = child.innerText.toLowerCase().replace(' ', '_');
            }
        })

        if (test_data !== {}) {
            labels = Object.keys(Object.values(test_data)[0][0]);
            labels.splice(labels.indexOf('type'), 1);
            labels.splice(labels.indexOf('Speaker_data'), 1);

            let index = 0;
            for (let s in test_data) {
                let currData = {}
                currData.label = s;

                let temp = { ...test_data[s].filter(o => o.type === currTest)[0] };
                delete temp.type;
                delete temp.Speaker_data;

                currData.data = Object.values(temp);
                currData.backgroundColor = colors[index];
                console.log(currData);

                dset.push(currData);
                index++;
            }

            const ctx = document.getElementById('ctx-analysis');

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
        const bGroup = document.querySelector(".testTypeBG");
        bGroup.childNodes.forEach((child) => {
            child.setAttribute('class', 'btn btn-primary');
        })
    })

    useEffect(() => {
        bGroup = document.querySelector(".testTypeBG");
        bGroup.childNodes.forEach((child) => {
            child.addEventListener('click', () => {
                resetButtons();
                child.classList.add('btn-outline-primary');
                chart.destroy();
                renderChart();
            })
        })
        renderChart();
    }, [chart])

    return (
        <>
            <div>
                <Row>
                    <Col md='12'>
                        <ButtonGroup className='testTypeBG'>
                            <Button color='primary' outline>DEFAULT</Button>
                            <Button color='primary'>NOISE25</Button>
                            <Button color='primary'>FX OVERLAY</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </div>
            <canvas id='ctx-analysis' className="graph-canvas"></canvas>
        </>
    );

}

export default AnalysisGraph;
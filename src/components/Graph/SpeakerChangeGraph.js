import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Chart from 'chart.js';

const SpeakerChangeGraph = (props) => {
    const location = useLocation();
    const every_nth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);

    useEffect(() => {
        let data = location.state.scd_scores;
        data = every_nth(data, 75);

        let options = {
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    },
                    ticks: {
                        display: false //this will remove only the label
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    }
                }],
            },
            legend: {
                display: false
            }
        };

        new Chart(document.getElementById("ctx-scd"), {
            type: 'line',
            data: {
                labels: new Array(data.length),
                datasets: [{
                    data: data.flat(),
                    label: "Speech Activation Detection",
                    pointRadius: 0,
                    fill: false,
                    borderColor: "#5e72e4",
                }]
            },
            options: options
        })
    })

    return (
        <>
            <canvas id='ctx-scd'></canvas>
        </>
    );
}

export default SpeakerChangeGraph;
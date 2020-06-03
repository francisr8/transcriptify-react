import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import WaveSurfer from "wavesurfer.js/dist/wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions";

const GeneralWaveForm = (props) => {
    const location = useLocation();
    const waveformRef = useRef();
    const kleuren = [
        "hsla(201, 61%, 71%, 0.41)",
        "hsla(360, 100%, 73%, 0.41)",
        "hsla(127, 100%, 59%, 0.29)",
    ];

    useEffect(() => {
        const createRegion = (wavesurfer, startValue, endValue, person) => {
            wavesurfer.addRegion({
                start: startValue,
                end: endValue,
                color: kleuren[person],
                drag: false,
                resize: false,
            });
        };

        let options = {
            container: waveformRef.current,
            waveColor: "#5e72e4",
            progressColor: "#172b4d",
            cursorWidth: 0,
            interact: false,
            plugins: [
                RegionsPlugin.create({
                    deferInit: true,
                }),
            ]
        };

        const wavesurfer = WaveSurfer.create(options);
        wavesurfer.load("http://localhost:4000/api/files/" + location.state.id);
        let regions = location.state.regions;

        for (let key in regions) {
            for (let i = 0; i < regions[key].length; i++) {
                createRegion(
                    wavesurfer,
                    regions[key][i][0],
                    regions[key][i][1],
                    key - 1
                );
            }
        }
    })

    return (
        <>
            <div className="waveform general-wf" ref={waveformRef}></div>
        </>
    );
}

export default GeneralWaveForm;
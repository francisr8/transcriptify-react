import React, { useEffect, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Button, ButtonGroup } from "reactstrap";
import "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import WaveSurfer from "wavesurfer.js/dist/wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions";
import elan from "wavesurfer.js/dist/plugin/wavesurfer.elan.js";

const WaveFrom = (props) => {
  const location = useLocation();
  const waveformRef = useRef();
  const kleuren = [
    "hsla(201, 61%, 71%, 0.41)",
    "hsla(360, 100%, 73%, 0.41)",
    "hsla(127, 100%, 59%, 0.29)",
  ];
  const pdflink =
    "http://localhost:4000/api/files/pdf/" + location.state.id + ".pdf";

  const service = location.state.service;

  let history = useHistory();

  function Details() {
    if (service === 'PyannoteManual') {
      return <Button
        color="primary"
        size="lg"
        type="button"
        outline
        onClick={() => history.push({
          pathname: "/main/graph/",
          state: {
            id: location.state.id,
            regions: location.state.regions,
            sad_scores: location.state.sad_scores,
            scd_scores: location.state.scd_scores,
          }
        })}
      >
        Details
    </Button >;
    } else {
      return null;
    }
  }

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
      cursorColor: "#172b4d",
      barWidth: 3,
      barRadius: 2,
      cursorWidth: 1,
      height: 200,
      barGap: 0,
      plugins: [
        //Otherwise
        RegionsPlugin.create({
          deferInit: true,
        }),
        elan.create({
          url:
            "http://localhost:4000/api/files/transcript/" +
            location.state.transcriptId,
          container: "#annotations",
          tiers: {
            Text: true,
            Comments: true,
          },
        }),
      ],
    };

    if (location.search.match("scroll")) {
      options.minPxPerSec = 100;
      options.scrollParent = true;
    }

    if (location.search.match("normalize")) {
      options.normalize = true;
    }

    const wavesurfer = WaveSurfer.create(options);
    let regions = location.state.regions;

    (function () {
      var progressDiv = document.querySelector("#progress-bar");
      var progressBar = progressDiv.querySelector(".progress-bar");

      var showProgress = function (percent) {
        progressDiv.style.display = "block";
        progressBar.style.width = percent + "%";
      };

      var hideProgress = function () {
        progressDiv.style.display = "none";
      };

      wavesurfer.on("loading", showProgress);
      wavesurfer.on("ready", hideProgress);
      wavesurfer.on("destroy", hideProgress);
      wavesurfer.on("error", hideProgress);
    })();

    wavesurfer.elan.on("ready", function (data) {
      wavesurfer.load("http://localhost:4000/api/files/" + location.state.id);
    });

    wavesurfer.elan.on("select", function (start, end) {
      wavesurfer.backend.play(start, end);
    });

    wavesurfer.elan.on("ready", function () {
      var classList = wavesurfer.elan.container.querySelector("table")
        .classList;
      ["table", "table-striped", "table-hover"].forEach(function (cl) {
        classList.add(cl);
      });
    });

    var prevAnnotation, prevRow, region;
    var onProgress = function (time) {
      var annotation = wavesurfer.elan.getRenderedAnnotation(time);

      if (prevAnnotation !== annotation) {
        prevAnnotation = annotation;

        console.log(annotation);

        region && region.remove();
        region = null;

        if (annotation) {
          // Highlight annotation table row
          var row = wavesurfer.elan.getAnnotationNode(annotation);
          prevRow && prevRow.classList.remove("transcriptTableActive");
          prevRow = row;
          row.classList.add("transcriptTableActive");
          var before = row.previousSibling;
          if (before) {
            wavesurfer.elan.container.scrollTop = before.offsetTop;
          }

          // Region
          region = wavesurfer.addRegion({
            start: annotation.start,
            end: annotation.end,
            resize: false,
            drag: false,
            color: "rgba(0, 0, 0, 0.2)",
          });
        } else {
          prevRow.classList.remove("transcriptTableActive");
        }
      }
    };

    wavesurfer.on("audioprocess", onProgress);

    wavesurfer.on("error", function (e) {
      console.warn(e);
    });

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

    // wavesurfer.load("http://localhost:4000/api/files/" + location.state.id);
    var button = document.querySelector('[data-action="play"]');
    button.addEventListener("click", wavesurfer.playPause.bind(wavesurfer));
  }, [location, kleuren]);

  return (
    <>
      <div className="waveform" ref={waveformRef}>
        <div className="progress progress-striped active" id="progress-bar">
          <div className="progress-bar progress-bar-info"></div>
        </div>
      </div>
      <div className="controls">
        <ButtonGroup className="uploadBtnGroup">
          <Button
            color="primary"
            size="lg"
            type="button"
            className="uploadBtn"
            data-action="play"
          >
            PLAY | PAUSE
          </Button>
          <Details />
          <Button
            color="primary"
            outline
            size="lg"
            href={pdflink}
            target="__blank"
          >
            SHOW PDF
          </Button>
        </ButtonGroup>
      </div>

      <div id="annotations" className="table-responsive"></div>
    </>
  );
};

export default WaveFrom;

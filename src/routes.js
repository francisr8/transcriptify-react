import UploadView from "./views/UploadView.js";
import WaveFormView from "./views/WaveFormView";
import GraphView from "./views/GraphView";
import VideoView from "./views/VideoView";
import AnalysisView from './views/AnalysisView';
import HistoryView from "./views/HistoryView";


var routes = [
  {
    path: "/upload",
    name: "Upload",
    icon: "ni ni-tv-2 text-primary",
    component: UploadView,
    layout: "/main",
  },
  {
    path: "/waveform",
    name: "Waveform",
    icon: "ni ni-tv-2 text-primary",
    component: WaveFormView,
    layout: "/main",
  },
  {
    path: "/graph",
    name: "Graph",
    icon: "ni ni-tv-2 text-primary",
    component: GraphView,
    layout: "/main",
  },
  {

    path: "/videochat",
    name: "Videochat",
    icon: "ni ni-tv-2 text-primary",
    component: VideoView,
    layout: "/video"
  },
  {
    path: "/analysis",
    name: "Analysis",
    icon: "ni ni-tv-2 text-primary",
    component: AnalysisView,
    layout: "/main"

  },
  {
    path: "/history",
    name: "History",
    icon: "ni ni-tv-2 text-primary",
    component: HistoryView,
    layout: "/video"

  }
];

export default routes;

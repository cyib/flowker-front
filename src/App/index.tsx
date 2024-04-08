import Flow from './Screens/Flow/Flow';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App/App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {
  RecoilRoot,
} from 'recoil';
import Atoms from './Constants/Atoms';
import http from './Services/http.service';
import Dashboard from './Screens/Dashboard/Dashboard';
import NodeResult from './Components/Node/NodeResult';
import NodeEditor from './Components/Node/NodeEditor';
import EnvironmentCreator from './Components/Environment/EnvironmentCreator';
import EnvironmentLog from './Components/Environment/EnvironmentLog';

const router = createBrowserRouter([
  {
    path: "/",
    element: <><Dashboard /></>,
  },
  {
    path: "/endpoints",
    element: <><Dashboard /></>,
  },
  {
    path: "/libraries",
    element: <><Dashboard page={'libraries'}/></>,
  },
  {
    path: "/databases",
    element: <><Dashboard page={'databases'}/></>,
  },
  {
    path: "/environments",
    element: <><Dashboard page={'environments'}/></>,
  },
  {
    path: "/settings",
    element: <><Dashboard page={'settings'}/></>,
  },
  {
    path: "/flow",
    element: <div className="App"><Flow /></div>,
  },
  {
    path: "/flow/:nodeId",
    loader: async ({ params }) => {
      const res = await http.get(`/get/snapshot/${params.nodeId}`);
      let node = null;
      if (res.data && res.data.snapshot) {
        node = res.data;
        node.version = node.nodeVersion;
        node.snapshot = typeof node.snapshot == 'string' ? JSON.parse(node.snapshot) : node.snapshot;
      }
      let loadNode = node;
      return { loadNode };
    },
    element: <div className="App"><Flow /></div>,
  }
]);

function App() {
  return (
    <RecoilRoot>
      <NodeResult />
      <NodeEditor />
      <EnvironmentCreator/>
      <EnvironmentLog/>
      <RouterProvider router={router} />
    </RecoilRoot>
  );
}

export default App;

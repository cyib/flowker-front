import { useCallback, useState, useRef, useEffect } from 'react';
import {
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  Position,
} from '@reactflow/core';

import ReactFlow, { MiniMap, updateEdge } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

import CustomNode from './Nodes/CustomNode';
import FunctionNode from './Nodes/FunctionNode';
import NodeEditor from '../../Components/Node/NodeEditor';
import FloatMenu from '../../Components/Extras/FloatMenu/FloatMenu';

import '@reactflow/core/dist/style.css';
import '../../styles/Flow/Flow.css';
import NodeLibrary from '../../Components/Node/NodeLibrary';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import Atoms from '../../Constants/Atoms';
import http from '../../Services/http.service';
import ContextMenu from '../../Components/Extras/utils/contextmenu';
import ActionNode from './Nodes/ActionNode';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { sleep } from '../../Components/Extras/utils/common';
import FloatLoader from '../../Components/Extras/FloatLoader/FloatLoader';
import NodeResult from '../../Components/Node/NodeResult';
import { IoMdArrowBack } from "react-icons/io";
import { HiHome, HiPencilAlt } from 'react-icons/hi';

const nodeTypes = {
  custom: CustomNode,
  function: FunctionNode,
  action: ActionNode
};

let actionStartNode: Node = {
  id: 'action-start',
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    type: 'start',
    outputs: []
  },
  position: { x: -300, y: -50 },
  type: 'action'
};

let actionFinishNode: Node = {
  id: 'action-finish',
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    type: 'finish',
    inputs: []
  },
  position: { x: 300, y: 50 },
  type: 'action'
};

const initialNodes: Node[] = [actionStartNode, actionFinishNode];
const initialEdges: Edge[] = [];

function Flow() {
  const loader: any = useLoaderData();
  const location = useLocation();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // execute on location change
    setCount(count + 1);
    if (flowInstance) {
      setLoading(true);
      onFlowInit(flowInstance, loader);
      setIsLibraryModalOpen(false);
    }

  }, [location]);

  useEffect(() => {
    if (loading === true) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [loading])

  const [currentFlowNode, setCurrentFlowNode] = useRecoilState(Atoms.currFlowNode);
  const [flowInstance, setFlowInstance] = useState(null) as any;
  const [isEditorModalOpen, setIsEditorModalOpen] = useRecoilState(Atoms.isEditorModalOpen);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useRecoilState(Atoms.isLibraryModalOpen);
  const [isResultModalOpen, setIsResultModalOpen] = useRecoilState(Atoms.isResultModalOpen);
  const [result, setLastNodeResult] = useRecoilState(Atoms.lastNodeResult);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const resetContextMenu = useResetRecoilState(Atoms.contextMenu)
  const [menu, setMenu] = useRecoilState(Atoms.contextMenu);
  const flowRef = useRef(null);

  //SECTION - EDGE BEHAVIOR
  const edgeUpdateSuccessful = useRef(true);
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge: any, newConnection: any) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_: any, edge: any) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);
  //!SECTION - EDGE BEHAVIOR

  const restoreFlow = async (snapshot: any) => {
    if (snapshot) {
      setNodes([]);
      setEdges([]);
      await sleep(100);
      setNodes(snapshot.nodes || []);
      setEdges(snapshot.edges || []);
    }
  };

  const addNode = useCallback(async (nodeId: string) => {
    // flowInstance.setViewport({ zoom: 1 }, { duration: 800 });
    let node = await getNode(nodeId);

    let nodeMap: Node = {
      id: uuidv4(),
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: {
        id: node.id,
        name: node.name,
        description: node.description,
        version: node.nodeVersion,
        versionList: node.versions,
        nodeType: node.nodeType,
        originalNodeId: node.originalNodeId,
        inputs: node.inputs,
        outputs: node.outputs,
        script: node.script,
        author: node.author
      },
      position: { x: 0, y: 0 },
      type: 'function',
    };

    setNodes((nds) => nds.concat(nodeMap));

  }, [flowInstance]);

  const getNode = async (id: string) => {
    try {
      const res = await http.get(`/get/${id}`);
      const data = res.data;
      return data;
    } catch (error) {
      console.error('Error to get node: ', error);
      return null;
    }
  }

  const prepareActionNodes = () => {
    if (!flowInstance) return;
    let _nodesCopy = JSON.parse(JSON.stringify(nodes));

    //TODO - BUG FIX - As arestas (EDGES) removidas da lista de edges quando um node que interfere no node start ou finish for diretamente relacionado
    let _nodes = _nodesCopy.map((node: any) => {
      if (node.id == 'action-start') {
        node.data.outputs = currentFlowNode.inputs.map((i: any) => { return { id: i.id, type: 'source', name: i.name } });
      }
      if (node.id == 'action-finish') {
        node.data.inputs = currentFlowNode.outputs.map((i: any) => { return { id: i.id, type: 'target', name: i.name } });
      }
      return node;
    });
    applyNodes(_nodes);
  }

  const applyNodes = (nodes: any) => {
    setNodes([]);
    setTimeout(() => {
      setNodes(nodes);
    }, 100);
  }

  const onFlowInit: Function = useCallback(async (instance: any, refreshLoader?: any) => {
    let _loader = refreshLoader || loader;
    setFlowInstance(instance);

    if (_loader && _loader.loadNode) {
      await sleep(100);
      setCurrentFlowNode(_loader.loadNode);
      await sleep(500);
      restoreFlow(_loader.loadNode.snapshot);
      await sleep(200);
      instance.fitView()
    }
    setLoading(false);
  }, [flowInstance]);

  useEffect(() => {
    if (isEditorModalOpen == true) return;
    prepareActionNodes();
  }, [flowInstance, isEditorModalOpen]);

  const onSave = useCallback(async (_currentFlowNode: any) => {
    if (flowInstance) {
      const fInstance: any = flowInstance;
      const flow = fInstance.toObject();
      let _snapshot = JSON.stringify(flow);
      let _edges = flow.edges.map((e: Edge) => {
        let _localMap = {
          source: e.source,
          sourceHandle: e.sourceHandle,
          target: e.target,
          targetHandle: e.targetHandle,
        };

        return _localMap;
      });

      let _payload = Object.assign({}, _currentFlowNode, { sequences: _edges, snapshot: JSON.parse(_snapshot) });
      let res = await http.post('/create/minor', _payload);
      if (res.data) {
        window.location.pathname = `/flow/${res.data}`
      }
    }
  }, [flowInstance]);

  const onRunGroup = useCallback(async (_currentFlowNode: any) => {
    if (flowInstance) {
      let fInstance: any = flowInstance;
      let flow = fInstance.toObject();
      let _edges = flow.edges.map((e: Edge) => {
        let _localMap = {
          source: e.source,
          sourceHandle: e.sourceHandle,
          target: e.target,
          targetHandle: e.targetHandle,
        };

        return _localMap;
      });

      let _payload = {
        sequence: _edges,
        inputs: _currentFlowNode.inputs.map((i: any) => { return { id: i.id, type: 'source', name: i.name } }),
        outputs: _currentFlowNode.outputs.map((i: any) => { return { id: i.id, type: 'target', name: i.name } })
      }

      const runResult: any = await http.post(`/run/sequence`, _payload);
      console.table(runResult.data);
      setLastNodeResult(runResult.data);
      setIsResultModalOpen(true);
    }
  }, [flowInstance]);

  const onNodeContextMenu = useCallback(
    (event: any, node: any) => {
      event.preventDefault();
      if (node.id && node.type !== 'action') {
        setMenu({
          id: (node.id) as string,
          node: node.data as any,
          top: (event.clientY) as number,
          left: (event.clientX) as number,
          right: (event.clientX) as number,
          bottom: (event.clientY) as number
        });
      }
    },
    [setMenu],
  );

  const navigate = useNavigate();
  const navigateTo = useCallback((to: string) => navigate(to, { replace: false }), [navigate]);

  const setCurrentNode = useSetRecoilState(Atoms.currentNode);
  const setEditionType = useSetRecoilState(Atoms.editNodeType);

  return (
    <div className="Flow">
      <div className='header-flow'>
        <div className='flow-option-btn' onClick={() => {
          window.history.back();
        }}><IoMdArrowBack size={30} /></div>
        <div className='flow-option-btn' onClick={() => {
          navigateTo('/');
        }}><HiHome size={30} /></div>
        <div className='flow-option-btn' onClick={() => {
          setEditionType('this');
          setCurrentNode(currentFlowNode);
          setIsEditorModalOpen(true);
        }}><HiPencilAlt size={30} /></div>
        <h3 className='title'>
          {currentFlowNode.name == null ? 'UNTITLED FLOW' : currentFlowNode.name}
          <span style={{ fontSize: 14 }}> ({currentFlowNode.version})</span>
        </h3>
      </div>

      <FloatLoader text={'LOADING ...'} open={loading} backgroundColor={'#111111'} textColor={'white'} />
      <FloatMenu onSave={onSave} onRunGroup={onRunGroup} />
      <NodeLibrary addNode={addNode} />
      <ReactFlow
        id='flowId'
        accessKey='id'
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView={true}
        nodeTypes={nodeTypes}
        onPaneClick={() => resetContextMenu()}
        onPaneMouseMove={() => resetContextMenu()}
        onNodeContextMenu={(onNodeContextMenu)}
        onInit={(instance: any) => onFlowInit(instance)}
      >
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        {(menu.id !== '') && <ContextMenu {...menu} />}
      </ReactFlow>
    </div>
  );
}

export default Flow;
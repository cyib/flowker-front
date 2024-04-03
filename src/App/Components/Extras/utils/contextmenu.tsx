import React, { useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import '../../../styles/Flow/Flow.css';
import { useResetRecoilState } from 'recoil';
import Atoms from '../../../Constants/Atoms';

interface ContextMenuProps {
  id: string;
  node: any;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  id,
  node,
  top,
  left,
  right,
  bottom,
  ...props
}) => {
  const resetContextMenu = useResetRecoilState(Atoms.contextMenu);
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const duplicateNode = useCallback(() => {
    const node: any = getNode(id);
    const position: any = {
      x: node.position.x + 100,
      y: node.position.y + 100,
    };

    addNodes({ ...node, id: `${node.id}-copy`, position });
    resetContextMenu();
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
    resetContextMenu();
  }, [id, setNodes, setEdges]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <p className="title">
        <span>Node: {node.name}</span>
      </p>
      {/* <button onClick={duplicateNode}>duplicate</button> */}
      <button onClick={deleteNode}>delete</button>
    </div>
  );
}

export default ContextMenu;
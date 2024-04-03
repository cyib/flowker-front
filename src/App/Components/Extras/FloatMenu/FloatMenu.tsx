import { type FC, type CSSProperties } from 'react';
import '../../../styles/Flow/FloatMenu.css';
import { Button, Col, Row } from 'react-bootstrap';
import Atoms from '../../../Constants/Atoms';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { HiOutlinePlusCircle, HiOutlinePlay, HiOutlineCollection, HiSaveAs, HiSave } from "react-icons/hi";

const FloatMenu: FC<any> = ({ onSave, onRunGroup}) => {
  const [currentFlowNode, setCurrentFlowNode] = useRecoilState(Atoms.currFlowNode);
  const resetCurrentNode = useResetRecoilState(Atoms.currentNode)
  const setEditionType = useSetRecoilState(Atoms.editNodeType);
  const setIsEditorModalOpen = useSetRecoilState(Atoms.isEditorModalOpen)
  const setIsLibraryModalOpen = useSetRecoilState(Atoms.isLibraryModalOpen)

  return (
    <>
      <div className="float-menu-container">
        <Row>
          <Col>
            <Button className="option" variant='success' onClick={() => onRunGroup(currentFlowNode)}><HiOutlinePlay size={16} />
              <span className='opt-span'>Run</span></Button>
          </Col>
          <Col>
            <Button className="option" variant='success' onClick={() => onSave(currentFlowNode) }>
              <HiSave size={16} />
              <span className='opt-span' >Save</span></Button>
          </Col>
          <Col>
            <Button className="option" variant='info' onClick={() => {
              resetCurrentNode();
              setEditionType('child');
              setIsEditorModalOpen(true);
            }}>
              <HiOutlinePlusCircle size={16} />
              <span className='opt-span'>New</span>
            </Button>
          </Col>
          <Col>
            <Button className="option" variant='light' onClick={() => {
              setIsLibraryModalOpen(true);
            }}><HiOutlineCollection size={16} />
              <span className='opt-span'>Library</span>
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default FloatMenu;

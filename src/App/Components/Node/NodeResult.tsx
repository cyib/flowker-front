import { useEffect, type FC } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useRecoilState } from 'recoil';
import Atoms from '../../Constants/Atoms';
import { JsonViewer } from '@textea/json-viewer'
import '../../styles/App/NodeResult.css';

const NodeResult: FC<any> = ({props}) => {
  const [show, setShow] = useRecoilState(Atoms.isResultModalOpen);
  const [result, setLastNodeResult] = useRecoilState(Atoms.lastNodeResult);

  const handleClose = () => {
    setShow(false)
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (show) {
      console.log('show results');
    }
  }, [show]);

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement='end' style={{
        width: '30%',
        maxWidth: 500,
        minWidth: 300,
        backgroundColor: '#373737',
        color: 'white'
      }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Node Result</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div style={{ backgroundColor: '#111111', padding: 5, borderRadius: 5 }}>
          <JsonViewer value={result} theme={'dark'}/>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default NodeResult;
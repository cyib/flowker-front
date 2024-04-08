import { useState, useEffect, type FC } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useRecoilState, useResetRecoilState } from 'recoil';
import CodeEditor from '@uiw/react-textarea-code-editor';
import Atoms from '../../Constants/Atoms';
import http from '../../Services/http.service';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { IEnvironment } from '../../Constants/Interfaces/Environment';

const EnvironmentLog: FC<any> = (props) => {
  const [show, setShow] = useRecoilState(Atoms.isEnvironmentLogModalOpen);
  const [refresh, setRefresh] = useState(false);
  const [currentEnvironment, setCurrentEnvironment] = useRecoilState(Atoms.currentEnvironment)
  const resetCurrentEnvironment = useResetRecoilState(Atoms.currentEnvironment)

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const handleInputChange = (e: any) => {
    let { target: { name, value } } = e;
    let _currEnv: any = { ...currentEnvironment };
    _currEnv[name] = value;
    setCurrentEnvironment(_currEnv);
  }

  const createEnvironment = async () => {
    console.log('currentEnvironment', currentEnvironment);
    const res = await http.post('/environment/create', currentEnvironment);
    if (res.status == 200) handleClose();
  }

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement='end' style={{
        width: '60%',
        maxWidth: 1000,
        minWidth: 300,
        backgroundColor: '#373737',
        borderBottomRightRadius: '25px',
        color: 'white'
      }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Last upgrade log</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <CodeEditor
            value={currentEnvironment.upgradeLog ? currentEnvironment.upgradeLog : ''}
            language="txt"
            placeholder="Upgrade Log from environment here"
            name={'upgradeLog'}
            padding={15}
            disabled
            style={{
              fontSize: 10,
              backgroundColor: "#111111",
              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            }}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default EnvironmentLog;
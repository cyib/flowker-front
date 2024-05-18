import { useState, type FC, useEffect, ChangeEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useRecoilState } from 'recoil';
import Atoms from '../../Constants/Atoms';
import { Form, FormSelect } from 'react-bootstrap';
import CodeEditor from '@uiw/react-textarea-code-editor';
import IoSelector from '../Extras/IoSelector/IoSelector';
import { FaPlay, FaReplyAll, FaRegSave } from 'react-icons/fa';
import { VscDiscard, VscRunAll } from 'react-icons/vsc';
import '../../styles/App/NodeEditor.css';
import http from '../../Services/http.service';
import { SiVisualstudiocode } from "react-icons/si";
import { IEnvironment } from '../../Constants/Interfaces/Environment';
import { v4 as uuidv4 } from 'uuid';
import { sleep } from '../Extras/utils/common';

const NodeEditor: FC<any> = ({ data }) => {
  const [externalId, setExternalId] = useState(uuidv4());
  const [editNodeType, setEditNodeType] = useRecoilState(Atoms.editNodeType);
  const [currentNode, setCurrentNode] = useRecoilState(
    editNodeType == 'child' ? Atoms.currentNode :
      Atoms.currFlowNode
  ) as any;
  const [terminal, setTerminal] = useState('');
  const [output, setOutput] = useState('');
  const [show, setShow] = useRecoilState(Atoms.isEditorModalOpen);
  const [saving, setSaving] = useState(false);
  const [environments, setEnvironments] = useState<IEnvironment[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState<IEnvironment>();

  useEffect(() => {
    if (show) {
      let w: any = window;
      getAllEnvironments();
      clearInterval(w['externalCheckerInterval']);
      setTerminal('');
      setOutput('');
    }
  }, [show]);

  const handleClose = () => {
    try {
      let w: any = window;
      clearInterval(w['externalCheckerInterval']);
      clearExternalGarbage();
      setShow(false);  
    } catch (error) {
      console.warn(error);
    }
  };
  const handleShow = () => setShow(true);

  const handleInputChange = async (e: any) => {
    let { target: { name, value } } = e;
    let _currNode: any = { ...currentNode };
    _currNode[name] = value;
    setCurrentNode(_currNode);
  }

  const handleSaveClick = async () => {
    try {
      setSaving(true);
      let res = await http.post(`/node/create/minor?externalId=${externalId}`, currentNode);
      if(res.status == 200) await clearExternalGarbage();
      setSaving(false);
      setShow(false);  
    } catch (error) {
      console.warn(error);
    }
  }

  const clearExternalGarbage = async () => {
    try {
      let originalId = currentNode.id || 'new';
      const clearExtenalConfirmation = await http.get(`/clear/external/garbage?nodeId=${originalId}&externalId=${externalId}`);
      if (clearExtenalConfirmation.status == 200) console.log('External file cleared');
    } catch (error) {
      console.error('Error fetching environment list: ', error);
    }
  }

  const getAllEnvironments = async () => {
    try {
      const res = await http.get('/environment/get/all');
      if (res.data && res.data.environments) {
        const environments: IEnvironment[] = res.data.environments;
        setEnvironments(environments);
      }
    } catch (error) {
      console.error('Error fetching environment list: ', error);
    }
  };

  const changeEnvironment = (event: ChangeEvent) => {
    let selectedId = (event.target as HTMLSelectElement).value;
    let selected: IEnvironment = environments.find(env => env.id == selectedId) as IEnvironment;
    setSelectedEnvironment(selected);

    let _currNode: any = { ...currentNode };
    _currNode['environmentId'] = selectedId;
    setCurrentNode(_currNode);
  }

  const runCurrent = async () => {
    setSaving(true);
    try {
      const runResult: any = await http.post(`/node/run/script/current`, currentNode);
      let script_output: any = {};
      for (let key in runResult.data) {
        if (key !== '__execution__params__') script_output[key] = runResult.data[key];
      }
      let executionParams = runResult.data.__execution__params__;
      let terminal_output = executionParams.terminal_output;
      terminal_output += `\nExecution duration (sec): ${executionParams.execution_duration}`;
      setTerminal(terminal_output);
      setOutput(JSON.stringify(script_output));
    } catch (error) {
      console.error('Runtime current node error: ', error);
    }
    setSaving(false);
  };

  const openExternalEditor = async  () => {
    let originalId = currentNode.id || 'new';
    let extenalResponseConfirmation = await http.get(`/node/external/create?nodeId=${originalId}&externalId=${externalId}`);
    if(extenalResponseConfirmation.status != 200){
      console.warn('Error when try to create a external file clone to open in your computer!');
      return;
    }
    let url: any = (`vscode://file/C:\\projects\\flowker\\flowker\\client\\scripts\\external\\${originalId}_ext_${externalId}.py`) as string;
    window.open(url, '_blank')?.focus();

    let w: any = window;
    clearInterval(w['externalCheckerInterval']);
    w['externalCheckerInterval'] = setInterval(async () => {
      try {
        let externalResponse = await http.get(`/node/external/get/script/raw?nodeId=${originalId}&externalId=${externalId}`);
        let codeFromExternal = externalResponse.data;
        console.log(externalResponse.status);
        if(externalResponse.status == 204){
          clearInterval(w['externalCheckerInterval']);
        }
        let _currNode: any = { ...currentNode };
        if (_currNode.script !== codeFromExternal) {
          _currNode.script = codeFromExternal;
          setCurrentNode(_currNode);
        }
      } catch (error) {
        clearInterval(w['externalCheckerInterval']);
      }
    }, 1500);
  }

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement={editNodeType == 'child' ? 'end' : 'start'} style={{
        width: '40%',
        minWidth: 600,
        backgroundColor: '#373737',
        color: 'white'
      }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{!currentNode.name || currentNode.name == '' ? 'Creating' : 'Edditing'} node {currentNode.nodeType}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col sm={4}>
                  <Form.Label style={{ fontSize: 14 }}>Node name <span style={{ fontSize: 9 }}>(Version: {currentNode.version})</span></Form.Label>
                  <Form.Control type="text" size='sm' placeholder={`Write the ${currentNode.nodeType} name`}
                    value={currentNode.name ? currentNode.name : ''}
                    name={'name'}
                    onChange={(event) => handleInputChange(event)}
                  />
                </Col>
                <Col sm={5}>
                  <Form.Label style={{ fontSize: 14 }}>Environment / Context / Project</Form.Label>
                  <Form.Select onChange={changeEnvironment} size='sm' value={currentNode.environmentId ? currentNode.environmentId : '00000000-0000-0000-0000-000000000001'}>
                    {environments.map((env: any) => <option value={env.id} key={`option-${env.id}`}>{env.name}</option>)}
                  </Form.Select>
                </Col>
                <Col sm={1}>
                  <Form.Label style={{ fontSize: 14 }}>Public</Form.Label>
                  <Form.Check
                    type="switch"
                    name={'isEndpoint'}
                    checked={currentNode.isEndpoint}
                    onChange={(event) => {
                      let val = event.target.checked;
                      let _currNode: any = { ...currentNode };
                      _currNode.isEndpoint = val;
                      setCurrentNode(_currNode);
                    }}
                  />
                </Col>
                <Col sm={2}>
                  <Form.Label style={{ fontSize: 14 }}>Type</Form.Label>
                  <Form.Select size='sm' name='endpointType' value={currentNode.endpointType} onChange={(event) => handleInputChange(event)}>
                    <option value="GET" key={`option-get`}>GET</option>
                    <option value="POST" key={`option-post`}>POST</option>
                  </Form.Select>
                </Col>
                {/* {
                  !currentNode.name || currentNode.name == '' ? <></> :
                    <Col sm={2}>
                      <Form.Label style={{ fontSize: 14 }}>Version</Form.Label>
                      <Form.Control type="text" size='sm' placeholder="version"
                        value={currentNode.version}
                        name={'version'}
                        disabled
                      />
                    </Col>
                } */}
              </Row>
            </Form.Group>
            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
              <Row className=''>
                <Col className='node-io-container inp-box'>
                  <IoSelector type='input' />
                </Col>
                <Col className='node-io-container out-box'>
                  <IoSelector type='output' />
                </Col>
              </Row>
            </Form.Group>
            {currentNode.nodeType == 'script' ?
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                {
                  !currentNode.name || currentNode.name == '' ? <></> :
                    <div style={{ paddingBottom: 15 }}>
                      <Button onClick={openExternalEditor}>Open in VSCode <SiVisualstudiocode /></Button>
                    </div>
                }

                <Form.Label>Script editor</Form.Label>
                <div style={{
                  height: 120,
                  minHeight: 120,
                  overflowY: 'auto',
                  backgroundColor: "#212121",
                }}>
                  <CodeEditor
                    value={currentNode.script || ''}
                    language="py"
                    placeholder="Please enter Python code"
                    name={'script'}
                    onKeyUp={(event: any) => {
                      let _currNode: any = { ...currentNode };
                      _currNode.script = event.target.innerHTML;
                      setCurrentNode(_currNode);
                    }}
                    padding={15}
                    style={{
                      fontSize: 12,
                      backgroundColor: "black",
                      fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    }}
                  />
                </div>
                <div style={{ width: '100%' }}>
                  <span style={{ fontSize: 10 }}>Terminal</span>
                  <div style={{
                    height: 100,
                    minHeight: 100,
                    overflowY: 'auto',
                    backgroundColor: "black",
                  }}>
                    <CodeEditor
                      value={terminal || ''}
                      language="shell"
                      placeholder="Terminal"
                      name={'terminal'}
                      padding={15}
                      style={{
                        fontSize: 12,
                        backgroundColor: "black",
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 10 }}>Node output</span>
                  <div style={{
                    height: 100,
                    minHeight: 100,
                    overflowY: 'auto',
                    backgroundColor: "black",
                  }}>
                    <CodeEditor
                      value={output || ''}
                      language="shell"
                      placeholder="Script outputs"
                      name={'output'}
                      padding={15}
                      style={{
                        fontSize: 12,
                        backgroundColor: "black",
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                      }}
                    />
                  </div>
                </div>
              </Form.Group>
              : <></>}
            {editNodeType == 'child' ?
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Row>
                  <Col sm={4}>
                    <Button variant='outline-light' onClick={runCurrent} style={{ width: '100%' }}>
                      <FaPlay /> RUN CURRENT
                    </Button>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col sm={4}>
                    <Button variant='danger' onClick={handleClose} style={{ width: '100%' }}>
                      <VscDiscard /> CLOSE
                    </Button>
                  </Col>
                  <Col sm={4}>
                  </Col>
                  <Col sm={4}>
                    <Button variant='success' onClick={handleSaveClick} style={{ width: '100%' }} disabled={saving}>
                      <FaRegSave /> {saving ? 'SAVING' : 'SAVE'}
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
              : <></>}
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default NodeEditor;
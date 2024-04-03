import { useState, type FC, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useRecoilState } from 'recoil';
import Atoms from '../../Constants/Atoms';
import { Form } from 'react-bootstrap';
import CodeEditor from '@uiw/react-textarea-code-editor';
import IoSelector from '../Extras/IoSelector/IoSelector';
import { FaPlay, FaReplyAll, FaRegSave } from 'react-icons/fa';
import { VscDiscard, VscRunAll } from 'react-icons/vsc';
import '../../styles/App/NodeEditor.css';
import http from '../../Services/http.service';

const NodeEditor: FC<any> = ({ data }) => {
  const [editNodeType, setEditNodeType] = useRecoilState(Atoms.editNodeType);
  const [currentNode, setCurrentNode] = useRecoilState(
    editNodeType == 'child' ? Atoms.currentNode : 
    Atoms.currFlowNode
  ) as any;
  const [terminal, setTerminal] = useState('');
  const [output, setOutput] = useState('');
  const [show, setShow] = useRecoilState(Atoms.isEditorModalOpen);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (show) {
      setTerminal('');
      setOutput('');
    }
  }, [show]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInputChange = async (e: any) => {
    let { target: { name, value } } = e;
    let _currNode: any = { ...currentNode };
    _currNode[name] = value;
    setCurrentNode(_currNode);
  }

  const handleSaveClick = async () => {
    setSaving(true);
    let res = await http.post('/create/minor', currentNode);
    setSaving(false);
    setShow(false);
  }

  const runCurrent = async () => {
    setSaving(true);
    try {
      const runResult: any = await http.post(`/run/script/current`, currentNode);
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
                <Col sm={10}>
                  <Form.Label style={{ fontSize: 14 }}>Node name</Form.Label>
                  <Form.Control type="text" size='sm' placeholder={`Write the ${currentNode.nodeType} name`}
                    value={currentNode.name ? currentNode.name : ''}
                    name={'name'}
                    onChange={(event) => handleInputChange(event)}
                  />
                </Col>
                <Col sm={2}>
                  <Form.Label style={{ fontSize: 14 }}>Version</Form.Label>
                  <Form.Control type="text" size='sm' placeholder="version"
                    value={currentNode.version}
                    name={'version'}
                    disabled
                  />
                </Col>
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
                <Form.Label>Script editor</Form.Label>
                <div style={{
                  height: 300,
                  minHeight: 300,
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
                    <Button variant='danger' onClick={() => console.log(currentNode)} style={{ width: '100%' }}>
                      <VscDiscard /> DISCARD
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
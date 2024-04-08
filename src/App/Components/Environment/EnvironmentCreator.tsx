import { useState, useEffect, type FC } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useRecoilState, useResetRecoilState } from 'recoil';
import Atoms from '../../Constants/Atoms';
import http from '../../Services/http.service';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { IEnvironment } from '../../Constants/Interfaces/Environment';

const EnvironmentCreator: FC<any> = (props) => {
  const [show, setShow] = useRecoilState(Atoms.isEnvironmentEditorModalOpen);
  const [refresh, setRefresh] = useState(false);
  const [currentEnvironment, setCurrentEnvironment] = useRecoilState(Atoms.currentEnvironment)
  const resetCurrentEnvironment = useResetRecoilState(Atoms.currentEnvironment)
  
  const handleClose = () => {
    resetCurrentEnvironment();
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const handleInputChange = (e: any) => {
    let { target: { name, value } } = e;
    let _currEnv: any = { ...currentEnvironment };
    _currEnv[name] = value;
    setCurrentEnvironment(_currEnv);
  }

  const createEnvironment = async() => {
    console.log('currentEnvironment', currentEnvironment);
    const res = await http.post('/environment/create', currentEnvironment);
    if(res.status == 200) handleClose();
  }

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement='start' style={{
        backgroundColor: '#373737',
        borderBottomRightRadius: '25px',
        color: 'white'
      }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Creating environment</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='node-library'>
        <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col sm={10}>
                  <Form.Label style={{ fontSize: 14 }}>Environment name</Form.Label>
                  <Form.Control type="text" size='sm' placeholder={`Project or context name here`}
                    value={currentEnvironment.name ? currentEnvironment.name : ''}
                    name={'name'}
                    onChange={(event) => handleInputChange(event)}
                  />
                </Col>
                <Col sm={2}>
                  <Form.Label style={{ fontSize: 14 }}>Color</Form.Label>
                  <Form.Control type="color" size='sm' placeholder="Color"
                    value={currentEnvironment.color ? currentEnvironment.color : ''}
                    onChange={(event) => handleInputChange(event)}
                    name={'color'}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <Form.Label style={{ fontSize: 14 }}>Description</Form.Label>
                  <Form.Control type="text" size='sm' placeholder={`Write a description of your environment here`}
                    value={currentEnvironment.description ? currentEnvironment.description : ''}
                    name={'description'}
                    onChange={(event) => handleInputChange(event)}
                  />
                </Col>
              </Row>
              <hr/>
              <Row>
                <Col sm={12}>
                  <Button onClick={createEnvironment}
                    size='sm' 
                    variant='success' 
                    style={{ width: '100%'}}>Create</Button>
                </Col>
              </Row>
            </Form.Group>
            </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default EnvironmentCreator;
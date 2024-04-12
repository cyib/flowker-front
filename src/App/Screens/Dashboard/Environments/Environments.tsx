import { type FC, type CSSProperties, useState, useEffect, ChangeEvent } from 'react';
import { Button, Col, Form, FormSelect, InputGroup, Row } from 'react-bootstrap';
import { GrUpgrade } from "react-icons/gr";
import { RxUpdate } from "react-icons/rx";
import './Style.css';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { IEnvironment } from '../../../Constants/Interfaces/Environment';
import { useRecoilState } from 'recoil';
import Atoms from '../../../Constants/Atoms';
import http from '../../../Services/http.service';

const Environments: FC<any> = () => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<IEnvironment>();
  const [currentEnvironment, setCurrentEnvironment] = useRecoilState(Atoms.currentEnvironment);
  const [isEnvironmentEditorModalOpen, setIsEnvironmentEditorModalOpen] = useRecoilState(Atoms.isEnvironmentEditorModalOpen);
  const [isEnvironmentLogModalOpen, setIsEnvironmentLogModalOpen] = useRecoilState(Atoms.isEnvironmentLogModalOpen);
  const [environments, setEnvironments] = useState<IEnvironment[]>([]);
  const [requirements, setRequirements] = useState('');

  const fetchData = async () => {
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedEnvironment(environments[0])
  }, [environments]);

  useEffect(() => {
    setEnvironments([]);
    setTimeout(() => {
      fetchData();
    }, 100);
  }, [isEnvironmentEditorModalOpen]);

  useEffect(() => {
    requestRequirements();
  }, [selectedEnvironment])

  const updateRequirements = async () => {
    if (selectedEnvironment) {
      const res = await http.post(`/environment/update/requirements/${selectedEnvironment.id}`, {
        content: requirements
      });
      console.log(res.data);
    }
  }

  const [upgrading, setUpgrading] = useState(false);
  const upgradeRequirements = async () => {
    updateRequirements();
    if (selectedEnvironment) {
      setUpgrading(true);
      const res = await http.get(`/environment/upgrade/requirements/${selectedEnvironment.id}`);
      console.log(res.data);
      setUpgrading(false);

      let _currEnv: any = { ...selectedEnvironment };
      _currEnv['upgradeLog'] = res.data.upgradeLog;
      setCurrentEnvironment(_currEnv);

      setIsEnvironmentLogModalOpen(true);
    }
  }

  const requestRequirements = async () => {
    try {
      console.log('requestRequirements');
      if (selectedEnvironment) {
        const res = await http.get(`/environment/requirements/${selectedEnvironment.id}`);
        console.log(res);
        if (res.data && res.data.requirements) {
          setRequirements(res.data.requirements);
        } else {
          setRequirements('');
        }
      }
    } catch (error) {
      console.error('Error fetching requirements: ', error);
    }
  }

  const changeEnvironment = (event: ChangeEvent) => {
    let selectedId = (event.target as HTMLSelectElement).value;
    let selected: IEnvironment = environments.find(env => env.id == selectedId) as IEnvironment;
    setSelectedEnvironment(selected)
  }

  return (
    <div className='environment-screen'>
      <Row>
        <Col><span className='title'>Environments</span></Col>
      </Row>
      <Row className='env-selector-container'>
        <Col xs={7} sm={7} md={6} lg={3}>
          <InputGroup size='sm'>
            <InputGroup.Text id="btnGroupAddon">Environment</InputGroup.Text>
            <FormSelect onChange={changeEnvironment}>
              {environments.map((env: any) => <option value={env.id} key={`option-${env.id}`}>{env.name}</option>)}
            </FormSelect>
          </InputGroup>
        </Col>
        <Col xs={5} sm={5} md={3} lg={3}>
          <Button size='sm' className='btn-new-env' onClick={() => {
            setIsEnvironmentEditorModalOpen(true);
          }}>New environment</Button>
        </Col>
      </Row>
      <Row className='env-config-container'>
        <Col xs={7} sm={7} md={6} lg={3}>
          <Form.Label style={{ fontSize: 14 }}>Description</Form.Label>
          <Form.Control type="text" size='sm' placeholder={`No description`}
            value={selectedEnvironment && selectedEnvironment.description ? selectedEnvironment.description : ''}
            name={'description'}
            disabled
          />
        </Col>
        <Col xs={5} sm={5} md={3} lg={3}>
          <Form.Label style={{ fontSize: 14 }}>Color</Form.Label>
          <Form.Control type="color" size='sm' placeholder="Color"
            value={selectedEnvironment && selectedEnvironment.color ? selectedEnvironment.color : ''}
            name={'color'}
            disabled
          />
        </Col>
      </Row>
      <Row className='env-config-container'>
        <Form.Label style={{ fontSize: 14 }}>Libraries (requirements.txt)</Form.Label>
        <Col sm={10} md={6} lg={3}>
          <CodeEditor
            value={requirements}
            language="txt"
            placeholder=""
            name={'requirements'}
            padding={15}
            onKeyUp={(event: any) => {
              setRequirements(event.target.innerHTML);
            }}
            style={{
              maxHeight: 300,
              height: 300,
              fontSize: 12,
              backgroundColor: "#111111",
              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            }}
          />
        </Col>
      </Row>
      <Row className='env-config-container'>
        <Col xs={6} sm={5} md={3} lg={3} xl={2}>
            <Button variant='success' style={{ width: '100%' }} onClick={updateRequirements}>Save requirements</Button>
        </Col>
        <Col xs={6} sm={5} md={3} lg={3} xl={1}>
            <Button className={`btn-upgrade ${upgrading ? 'upgrading' : ''}`} disabled={upgrading} variant="outline-info" style={{ width: '100%' }} onClick={upgradeRequirements}>
              {
                upgrading ? 
                <><RxUpdate />Upgrading</>
                :
                <><GrUpgrade style={{ stroke: 'red' }}/>Upgrade</>
              }
            </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Environments;

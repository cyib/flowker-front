import { type FC, type CSSProperties, useState, useEffect, ChangeEvent } from 'react';
import { Button, Col, FormSelect, InputGroup, Row } from 'react-bootstrap';
import './Style.css';
import { IEnvironment } from '../../../Constants/Interfaces/Environment';
import { RiFolderSharedLine } from "react-icons/ri";

const Libraries: FC<any> = () => {
  const [environments, setEnvironments] = useState<IEnvironment[]>([
    { id: '00000000-0000-0000-0000-000000000001', name: 'Default' },
    { id: 'f3c172fb-a0ea-4c1b-88b3-5b62e2e12d83', name: 'ARES' }
  ]);
  const [selectedEnv, setSelectedEnv] = useState<IEnvironment>();

  useEffect(() => {
    console.log(selectedEnv);
  }, [selectedEnv]);

  const changeEnvironment = (event: ChangeEvent) => {
    let selectedId = (event.target as HTMLSelectElement).value;
    let selected: IEnvironment = environments.find(env => env.id == selectedId) as IEnvironment;
    setSelectedEnv(selected)
  }

  return (
    <div className='library-screen'>
      <Row>
        <Col><span className='title'>Libraries</span></Col>
      </Row>
      <Row>
        <Col sm={12} md={6} lg={3}>
          <div className='env-selector-container'>
            <InputGroup>
              <InputGroup.Text id="btnGroupAddon">Package</InputGroup.Text>
              <FormSelect onChange={changeEnvironment}>
                {environments.map((env: any) => <option value={env.id} key={`option-${env.id}`}>{env.name}</option>)}
              </FormSelect>
              <Button variant="primary" id="button-addon2">
                <RiFolderSharedLine size={24}/> 
              </Button>
            </InputGroup>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Libraries;

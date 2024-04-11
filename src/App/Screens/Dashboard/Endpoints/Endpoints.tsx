import { type FC, useState, useEffect } from 'react';
import { Card, Col, Dropdown, Form, FormSelect, InputGroup, Row } from 'react-bootstrap';
import { HiCode, HiExternalLink, HiOutlineClipboardCopy, HiOutlinePlus, HiPlay } from "react-icons/hi";
import { FaPlusSquare } from "react-icons/fa";
import { RiFlowChart } from "react-icons/ri";
import { TiFlowChildren } from "react-icons/ti";
import { IoLogoPython } from "react-icons/io";
import { PiGhostFill } from "react-icons/pi";
import { HiViewGridAdd } from "react-icons/hi";

import { INode, INodeRepository } from '../../../Constants/Interfaces/Node';
import { Link } from 'react-router-dom';
import http from '../../../Services/http.service';
import environment from '../../../Environments/environment';
import './Style.css';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import Atoms from '../../../Constants/Atoms';
import EndpointItem from '../../../Components/Basic/EndpointItem';

const Endpoints: FC<any> = ({ text }) => {
  const resetCurrentNode = useResetRecoilState(Atoms.currentNode)
  const resetCurrFlowNode = useResetRecoilState(Atoms.currFlowNode);

  const [isEditorModalOpen, setIsEditorModalOpen] = useRecoilState(Atoms.isEditorModalOpen);
  const setEditionType = useSetRecoilState(Atoms.editNodeType);

  const [repository, setRepository] = useState([]);

  useEffect(() => {
    endpointsRequest();
  }, []);

  useEffect(() => {
    if(!isEditorModalOpen){
      setRepository([]);
      setTimeout(() => {
        endpointsRequest();
      }, 100);
    }
  }, [isEditorModalOpen]);

  const endpointsRequest = () => {
    const fetchData = async () => {
      try {
        const res = await http.get('/repository?onlyendpoints=true');
        const data = res.data.map((e: INodeRepository) => { e.selectedId = e.id; return e });
        setRepository(data);
      } catch (error) {
        console.error('Error fetching repository data: ', error);
      }
    };
    fetchData();
  }

  const resetAll = () => {
    resetCurrFlowNode();
    resetCurrentNode();
  }

  const clickElementId = (id: string) => {
    document.getElementById(id)?.click();
  }

  return (
    <>
      <Row>
        <Col sm={12} md={12} lg={12}>
          <div className='endpoint-options prevent-select'>
          <Dropdown>
            <Dropdown.Toggle size='lg' id="dropdown-new" variant="primary">
              <div className='dd-inside'><HiViewGridAdd/><span>Create new</span></div>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => {
                resetAll();
                setEditionType('this');
                setIsEditorModalOpen(true);
                clickElementId('link-new-flow');
                console.log('reset');
              }}>
                <div className='option'><RiFlowChart size={20}/><span style={{ paddingLeft: 5 }}>Endpoint</span></div>
              </Dropdown.Item>
              <Dropdown.Item onClick={() => {
                resetAll();
                setEditionType('child');
                setIsEditorModalOpen(true);
              }}>
                <div className='option'><IoLogoPython size={20} /><span style={{ paddingLeft: 5 }}>Python Script</span></div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
            {/* <Link to='/flow' className='option' onClick={() => {
              resetAll();
              setEditionType('this');
              setIsEditorModalOpen(true);
              console.log('reset');
            }}><HiOutlinePlus size={20} /><TiFlowChildren size={30} /><span>Endpoint</span></Link>
            <div className='option' onClick={() => {
              resetAll();
              setEditionType('child');
              setIsEditorModalOpen(true);
            }}><HiOutlinePlus size={20} /><IoLogoPython size={30} /><span>Script</span></div> */}
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={6} lg={5} >
          <div className='endpoint-library prevent-select scroll-bar-style'>
            {
              repository.length == 0 ? 
              <div className='no-endpoints-msg'>
                <div className='img-box'><PiGhostFill size={40}/></div>
                <span className='text-box'>No endpoints created yet</span>
              </div>
              :
              repository.map((node: INodeRepository, index: number) =>
                <div key={index}>
                  <EndpointItem index={index} node={node} repository={repository} setRepository={setRepository}/>
                </div>
              )
            }
          </div>
        </Col>
      </Row>
      <Link to='/flow' id="link-new-flow"/>
    </>
  );
};

export default Endpoints;

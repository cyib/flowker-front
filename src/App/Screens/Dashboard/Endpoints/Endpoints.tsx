import { type FC, useState, useEffect } from 'react';
import { Button, Card, Col, Form, FormSelect, InputGroup, Row } from 'react-bootstrap';
import { HiBeaker, HiClipboardCopy, HiCode, HiExternalLink, HiOutlineClipboardCopy, HiOutlinePlus, HiPlay } from "react-icons/hi";
import { TiFlowChildren } from "react-icons/ti";
import { IoLogoPython } from "react-icons/io";

import { INode, INodeRepository } from '../../../Constants/Interfaces/Node';
import { Link } from 'react-router-dom';
import http from '../../../Services/http.service';
import environment from '../../../Environments/environment';
import './Style.css';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import Atoms from '../../../Constants/Atoms';

const Endpoints: FC<any> = ({ text }) => {
  const [currentFlowNode, setCurrentFlowNode] = useRecoilState(Atoms.currFlowNode);
  const resetCurrentNode = useResetRecoilState(Atoms.currentNode)
  const resetCurrFlowNode = useResetRecoilState(Atoms.currFlowNode);

  const setCurrentNode = useSetRecoilState(Atoms.currentNode as any);
  const setIsEditorModalOpen = useSetRecoilState(Atoms.isEditorModalOpen);
  const setEditionType = useSetRecoilState(Atoms.editNodeType);

  const [isResultModalOpen, setIsResultModalOpen] = useRecoilState(Atoms.isResultModalOpen);
  const [result, setLastNodeResult] = useRecoilState(Atoms.lastNodeResult);

  const [repository, setRepository] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await http.get('/repository');
        const data = res.data.map((e: INodeRepository) => { e.selectedId = e.id; return e });
        setRepository(data);
      } catch (error) {
        console.error('Error fetching repository data: ', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log('refresh', repository);
  }, [refresh]);

  async function runNodeById(id: string): Promise<any> {
    const result: any = (await http.get(`/run/node/${id}`)).data;
    return result;
  }

  async function getNodeById(id: string): Promise<INode> {
    const node: any = (await http.get(`/get/${id}`)).data;
    let _node: INode = node;
    _node['version'] = _node['nodeVersion'];

    return _node;
  }

  const changeNodeVersion = (index: number, selectedId: string) => {
    let copyRepository: Array<INodeRepository> = Object.assign([], repository);
    copyRepository[index].selectedId = selectedId;
    setRepository(copyRepository as any);
    setRefresh(!refresh);
  }

  const resetAll = () => {
    resetCurrFlowNode();
    resetCurrentNode();
  }

  return (
    <>
      <Row>
        <Col sm={12} md={12} lg={12}>
          <div className='endpoint-options prevent-select'>
            <Link to='/flow' className='option' onClick={() => {
              resetAll();
              setEditionType('this');
              setIsEditorModalOpen(true);
              console.log('reset');
            }}><HiOutlinePlus size={20} /><TiFlowChildren size={30} /><span>Endpoint</span></Link>
            <div className='option' onClick={() => {
              resetAll();
              setEditionType('child');
              setIsEditorModalOpen(true);
            }}><HiOutlinePlus size={20} /><IoLogoPython size={30} /><span>Script</span></div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={6} lg={5} >
          <div className='endpoint-library prevent-select scroll-bar-style'>
            {
              repository.map((node: INodeRepository, index: number) =>
                <Card className="library-node-item" style={{ width: 'calc(100% - 20px)', minHeight: 120, margin: 5 }} key={node.id}>
                  <Card.Body>
                    <div className='float-node-container'>
                      <div className='float-node-btn'>
                        <div onClick={async () => {
                          resetAll();
                          let runResult = await runNodeById(node.selectedId || node.id);
                          setLastNodeResult(runResult);
                          setIsResultModalOpen(true);
                        }}>
                          <HiPlay /><span>RUN</span>
                        </div>
                      </div>
                      <div className='float-node-btn'>
                        {
                          node.type == 'script' ?
                            <div onClick={async () => {
                              let _node = await getNodeById(node.selectedId || node.id);
                              setEditionType('child');
                              setCurrentNode(_node);
                              setIsEditorModalOpen(true);
                            }}>
                              <HiCode /><span>EDIT</span>
                            </div> :
                            <Link to={{ pathname: `/flow/${node.selectedId || node.id}` }} replace={false} >
                              <TiFlowChildren size={20} /><span>EDIT</span>
                            </Link>
                        }
                      </div>
                    </div>


                    <Card.Title>{node.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {node.description}
                    </Card.Subtitle>
                    <Card.Text style={{ display: 'flex', flexDirection: 'column' }}>
                      <Row>
                        <Col>
                          <FormSelect onChange={(e) => {
                            node.selectedId = e.target.value;
                            changeNodeVersion(index, e.target.value);
                          }}>
                            <option value={node.id} key={`option-${node.id}`}>{node.nodeVersion}</option>
                            {node.versions && node.versions.map((v: any) => <option value={v.id} key={`option-${v.id}`}>{v.version} {v.original ? '(Original)' : ''}</option>)}
                          </FormSelect>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div className="url-copy-container">
                            <InputGroup style={{ marginTop: 5 }}>
                              <InputGroup.Text className='btn-copy-url' onClick={() => {
                                let url: any = (`${environment.baseURL}/api/${node.selectedId || node.id}`) as string;
                                navigator.clipboard.writeText(url);
                              }}><HiOutlineClipboardCopy size={16} /></InputGroup.Text>
                              <Form.Control
                                placeholder="link"
                                value={`${environment.baseURL}/api/${node.selectedId || node.id}`}
                                readOnly
                                className="url-input"
                                size='sm'
                                style={{ height: 30 }}
                              />
                              <InputGroup.Text className='btn-copy-url' onClick={() => {
                                let url: any = (`${environment.baseURL}/api/${node.selectedId || node.id}`) as string;
                                window.open(url, '_blank')?.focus();
                              }}><HiExternalLink size={16} /></InputGroup.Text>
                            </InputGroup>
                          </div>
                        </Col>
                      </Row>
                    </Card.Text>
                  </Card.Body>
                </Card>
              )
            }
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Endpoints;

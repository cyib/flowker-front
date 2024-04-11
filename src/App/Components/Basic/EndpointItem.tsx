import { useCallback, useState, type FC } from 'react';
import '../../styles/App/Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Col, Form, FormSelect, InputGroup, Row } from 'react-bootstrap';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import Atoms from '../../Constants/Atoms';
import http from '../../Services/http.service';
import { HiCode, HiExternalLink, HiOutlineClipboardCopy, HiPlay } from 'react-icons/hi';
import { INode, INodeRepository, INodeVersion } from '../../Constants/Interfaces/Node';
import { TiFlowChildren } from 'react-icons/ti';
import environment from '../../Environments/environment';

export default ({ index, node, repository, setRepository }: any) => {
  const navigate = useNavigate();
  const navigateToFlow = useCallback((href: string) => navigate(href, {replace: false}), [navigate]);
  const [selectedVersion, setSelectedVersion] = useState<INodeVersion|undefined>();
  
  const setIsResultModalOpen = useSetRecoilState(Atoms.isResultModalOpen);
  const setIsEditorModalOpen = useSetRecoilState(Atoms.isEditorModalOpen);
  const setLastNodeResult = useSetRecoilState(Atoms.lastNodeResult);
  const setEditionType = useSetRecoilState(Atoms.editNodeType);
  const setCurrentNode = useSetRecoilState(Atoms.currentNode as any);

  const resetCurrentNode = useResetRecoilState(Atoms.currentNode)
  const resetCurrFlowNode = useResetRecoilState(Atoms.currFlowNode);
  const resetAll = () => {
    resetCurrFlowNode();
    resetCurrentNode();
  }

  async function runNodeById(id: string): Promise<any> {
    const result: any = (await http.get(`/node/run/node/${id}`)).data;
    return result;
  }

  async function getNodeById(id: string): Promise<INode> {
    const node: any = (await http.get(`/node/get/${id}`)).data;
    let _node: INode = node;
    _node['version'] = _node['nodeVersion'];

    return _node;
  }

  const [refresh, setRefresh] = useState(false);
  const changeNodeVersion = (index: number, selectedId: string) => {
    let copyRepository: Array<INodeRepository> = Object.assign([], repository);
    copyRepository[index].selectedId = selectedId;
    setSelectedVersion(node.versions.find((v: INodeVersion) => v.id == selectedId))
    setRepository(copyRepository as any);
    setRefresh(!refresh);
  }

  return (
    <>
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
                              let _node = await getNodeById(selectedVersion?.id || node.id);
                              console.log('selected node', _node);
                              setEditionType('child');
                              setCurrentNode(_node);
                              setIsEditorModalOpen(true);
                            }}>
                              <HiCode /><span>EDIT</span>
                            </div> :
                            <Link to={{ pathname: `/flow/${selectedVersion?.id || node.id}` }} replace={false} >
                              <TiFlowChildren size={20} /><span>EDIT</span>
                            </Link>
                        }
                      </div>
                    </div>


                    <Card.Title><div className='cardTitle'>
                      <div className='baseInfos'>
                        <span className='endpointType' style={{ backgroundColor: (selectedVersion?.endpointType || node.endpointType) == 'GET' ? '#384456' : '#17273d' }}>{selectedVersion?.endpointType || node.endpointType}</span>
                        <span className='envTitle'>{selectedVersion?.environmentName || node.environmentName}</span>
                      </div>
                        
                        <span className='title'>{selectedVersion?.name || node.name}</span>
                      </div></Card.Title>
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
                                let url: any = (`${environment.baseURL}/api/${selectedVersion?.id || node.id}`) as string;
                                navigator.clipboard.writeText(url);
                              }}><HiOutlineClipboardCopy size={16} /></InputGroup.Text>
                              <Form.Control
                                placeholder="link"
                                value={`${environment.baseURL}/api/${selectedVersion?.id || node.id}`}
                                readOnly
                                className="url-input"
                                size='sm'
                                style={{ height: 30 }}
                              />
                              <InputGroup.Text className='btn-copy-url' onClick={() => {
                                let url: any = (`${environment.baseURL}/api/${selectedVersion?.id || node.id}`) as string;
                                window.open(url, '_blank')?.focus();
                              }}><HiExternalLink size={16} /></InputGroup.Text>
                            </InputGroup>
                          </div>
                        </Col>
                      </Row>
                    </Card.Text>
                  </Card.Body>
                </Card>
    </>
  );
};

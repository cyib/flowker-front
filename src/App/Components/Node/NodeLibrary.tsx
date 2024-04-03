import { useState, useEffect, type FC } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useRecoilState } from 'recoil';
import Atoms from '../../Constants/Atoms';
import '../../styles/App/NodeLibrary.css';
import http from '../../Services/http.service';
import { Button, Card, FormSelect } from 'react-bootstrap';
import { INode, INodeRepository } from '../../Constants/Interfaces/Node';
import { HiExternalLink } from "react-icons/hi";
import { Link } from 'react-router-dom';

const NodeLibrary: FC<any> = (props) => {
  const [show, setShow] = useRecoilState(Atoms.isLibraryModalOpen);
  const [repository, setRepository] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const handleClose = () => {
    setRepository([]);
    setShow(false)
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await http.get('/repository');
        const data = res.data.map((e: INodeRepository) => { e.selectedId = e.id; return e});
        setRepository(data);
      } catch (error) {
        console.error('Error fetching repository data: ', error);
      }
    };

    if (show) {
      fetchData();
    }
  }, [show]);

  useEffect(() => {
    console.log('refresh', repository);
  }, [refresh])

  const changeNodeVersion = (index: number, selectedId: string) =>{
    let copyRepository: Array<INodeRepository> = Object.assign([], repository);
    copyRepository[index].selectedId = selectedId;
    setRepository(copyRepository as any);
    setRefresh(!refresh);
  }

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement='start' style={{
        width: '30%',
        maxWidth: 500,
        minWidth: 300,
        backgroundColor: '#373737',
        color: 'white'
      }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Node library</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='node-library'>
          {
            repository.map((node: INodeRepository, index: number) => 
              <Card className="library-node-item" style={{ width: '100%', minHeight: 120, margin: 5 }} key={node.id}>
                <Card.Body>
                  <Card.Title>{node.name} { node.type == 'group' ? <Link to={{pathname: `/flow/${node.selectedId || node.id}`}} replace={false}><HiExternalLink size={16} /></Link> : <></>}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {node.description}
                  </Card.Subtitle>
                  <Card.Text style={{ display: 'flex' }}>
                    <FormSelect onChange={(e) => {
                      node.selectedId = e.target.value;
                      changeNodeVersion(index, e.target.value);
                      }}>
                      <option value={node.id} key={`option-${node.id}`}>{node.nodeVersion}</option>
                      {node.versions && node.versions.map((v: any) => <option value={v.id} key={`option-${v.id}`}>{v.version} {v.original ? '(Original)' : ''}</option>) }
                    </FormSelect>
                    <Button style={{ marginLeft: 10 }} onClick={() => { 
                      props.addNode(node.selectedId || node.id); handleClose(); 
                    }}>+</Button>
                  </Card.Text>
                </Card.Body>
            </Card>
            )
          }
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default NodeLibrary;
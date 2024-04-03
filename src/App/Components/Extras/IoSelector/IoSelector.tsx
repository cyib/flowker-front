import { useState, type FC } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useRecoilState } from 'recoil';
import { FaTrash } from 'react-icons/fa';
import { Button, Form } from 'react-bootstrap';
import Atoms from '../../../Constants/Atoms';
import { v4 as uuidv4 } from 'uuid';
import { sleep } from '../utils/common';

const IoSelector: FC<any> = ({ type }: { type: 'input' | 'output' }) => {
  const [editNodeType, setEditNodeType] = useRecoilState(Atoms.editNodeType);
  const [currentNode, setCurrentNode] = useRecoilState(
    editNodeType == 'child' ? Atoms.currentNode : 
    Atoms.currFlowNode
  ) as any;
  const [ioList, setIoList] = useState(currentNode[`${type}s`] || []);

  const handleAddClick = async () => {
    let list: any = [...ioList];
    list.push({ datatype: 'any', id: uuidv4(), name: '', required: false, defaultValue: null })
    setIoList(list);
    updateIoListCurrentNode(list);
  }

  const handleRemoveClick = async (index: number) => {
    let list: any = [...ioList];
    list.splice(index, 1);
    setIoList(list);
    updateIoListCurrentNode(list);
  };

  const handleInputChange = async (e: any, index: number) => {
    let { target: { name, value } } = e;
    let list: any = [...ioList];
    list[index] = { ...list[index], [name]: value };
    setIoList(list);
    updateIoListCurrentNode(list);
  }

  const updateIoListCurrentNode = (list: any = null) => {
    if(!list) list = ioList;
    let copyCurrentNode: any = { ...currentNode };
    copyCurrentNode[`${type}s`] = list;
    setCurrentNode(copyCurrentNode);
  }

  return (
    <>
      <Row className="mb-1">
        <Col sm={6}>
          <Form.Group as={Col} controlId="inputScriptType">
            <Form.Label style={{ fontSize: 12 }}>Type</Form.Label>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group as={Col} controlId="inputScriptName">
            <Form.Label style={{ fontSize: 12 }}>Name</Form.Label>
          </Form.Group>
        </Col>
      </Row>
      {
        ioList.map((io: { datatype: string, id: string, name: string }, i: number) => {
          return <div key={io.id}>
            <Row className="mb-2">
              <Col sm={5}>
                <Form.Group as={Col} controlId="inputScriptType">
                  <Form.Select size='sm' name='datatype' value={io.datatype} onChange={(event) => handleInputChange(event, i)}>
                    <option>any</option>
                    <option>str</option>
                    <option>num</option>
                    <option>int</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={5} style={{ padding: 0, paddingRight: 5 }}>
                <Form.Group as={Col} controlId="inputScriptName">
                  <Form.Control size='sm' value={io.name} name='name' required onChange={(event) => handleInputChange(event, i)} />
                </Form.Group>
              </Col>
              <Col sm={1} style={{ padding: 0 }}>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveClick(i)}
                >
                  <FaTrash />
                </Button>
              </Col>
            </Row>
          </div>
        }
        )
      }
      <Row>
        <Col><Button size='sm' variant={type == 'input' ? 'outline-light' : 'outline-warning' } style={{ width: '100%' }} onClick={handleAddClick}>+ new {type}</Button></Col>
      </Row>
    </>
  );
}

export default IoSelector;
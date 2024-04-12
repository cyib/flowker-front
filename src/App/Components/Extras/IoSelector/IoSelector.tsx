import { useState, type FC } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useRecoilState } from 'recoil';
import { FaTrash } from 'react-icons/fa';
import { FaCaretUp } from "react-icons/fa";
import { Button, Form } from 'react-bootstrap';
import Atoms from '../../../Constants/Atoms';
import { v4 as uuidv4 } from 'uuid';
import { sleep } from '../utils/common';
import { IIoItem } from '../../../Constants/Interfaces/Node';

const IoSelector: FC<any> = ({ type }: { type: 'input' | 'output' }) => {
  const [editNodeType, setEditNodeType] = useRecoilState(Atoms.editNodeType);
  const [currentNode, setCurrentNode] = useRecoilState(
    editNodeType == 'child' ? Atoms.currentNode : 
    Atoms.currFlowNode
  ) as any;
  const [ioList, setIoList] = useState<IIoItem[]>(currentNode[`${type}s`] || []);

  const handleAddClick = async () => {
    let list: IIoItem[] = [...ioList];
    let order: number = list.length > 0 ? Math.max(...(list.map(e => e.orderNumber as number)) as number[]) + 1 : 0;
    list.push({ 
      datatype: 'any', 
      id: uuidv4(), 
      name: '', 
      required: false, 
      defaultValue: null,
      orderNumber: order,
    })
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
    let list: IIoItem[] = [...ioList];
    list[index] = { ...list[index], [name]: value };
    setIoList(list);
    updateIoListCurrentNode(list);
  }

  const updateIoListCurrentNode = (list: any = null) => {
    if(!list) list = ioList;
    let copyCurrentNode: any = { ...currentNode };
    copyCurrentNode[`${type}s`] = list;
    setCurrentNode(copyCurrentNode);
    console.log(copyCurrentNode)
  }

  const upItem = (index: number) => {
    let list: IIoItem[] = [...ioList];
    let prevItem: IIoItem|null = list[index - 1] || null;
    let currItem: IIoItem = list[index];
    if (prevItem) {
        list[index-1] = { ...list[index-1], orderNumber: currItem.orderNumber || 1 };
        list[index] = { ...list[index], orderNumber: prevItem.orderNumber || 0 };
        list.sort((a: IIoItem, b:IIoItem) => (a.orderNumber as number) - (b.orderNumber as number));
        setIoList(list);
        updateIoListCurrentNode(list);
    }
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
        ioList.map((io: IIoItem, i: number) => {
          return <div key={io.id}>
            <Row className="mb-2">
              <Col sm={1} style={{ paddingLeft: 5 }}>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => upItem(i)}
                >
                  <FaCaretUp />
                </Button>
              </Col>
              <Col sm={4}>
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
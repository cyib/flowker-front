import { type FC, type CSSProperties, useState, useEffect, ChangeEvent } from 'react';
import { Col, FormSelect, InputGroup, Row } from 'react-bootstrap';
import './Style.css';

const Databases: FC<any> = () => {
  return (
    <div className='database-screen'>
      <Row>
        <Col><span className='title'>Databases</span></Col>
      </Row>
      <Row>

      </Row>
    </div>
  );
};

export default Databases;

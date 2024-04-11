import { type FC, type CSSProperties, useState, useEffect, ChangeEvent } from 'react';
import { Button, Col, Form, FormSelect, InputGroup, Row } from 'react-bootstrap';
import { FaSearch } from "react-icons/fa";
import { TbPointFilled } from "react-icons/tb";
import { MdOutlineSearch } from "react-icons/md";

import './Style.css';

export default () => {
  return (
    <div className='repository-screen'>
      <Row>
        <Col><span className='title'>Nodes repository</span></Col>
      </Row>
      <Row>
        <Col>
          <div className='tags-container'>
            <span className='tag'><TbPointFilled color='darkred'/><span>Utilities</span></span>
            <span className='tag'><TbPointFilled color='gold'/><span>Mail generation</span></span>
            <span className='tag'><TbPointFilled color='blue'/><span>Log tracker</span></span>
            <span className='tag'><TbPointFilled color='green'/><span>Performance</span></span>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm={3}>
          <div className='search-container' style={{ padding: 10 }}>
            <Form.Control
              type="text"
              id="search-input"
              placeholder='Search what you want here'
            />
            <Button className='search-btn'>
              <MdOutlineSearch size={25}/>
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../../../Assets/logo.png';

function DashNavbar() {
  return (
    <Navbar expand="lg" className="bg-body-dark" style={{ position: 'fixed', width: '100%', backgroundColor: "#111111", color: 'white'}}>
      <Container fluid>
        <Navbar.Brand href="#" style={{ color: 'white' }}>
        <span style={{ fontSize: 20, fontFamily: 'monospace', fontWeight: 'bold'}}>&gt; flowker</span>
        <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 'lighter'}}>&nbsp;v0.27</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
          </Nav>
          <Form className="d-flex">
            {/* <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button> */}
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default DashNavbar;
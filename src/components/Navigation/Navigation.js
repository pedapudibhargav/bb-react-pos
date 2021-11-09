import './Navigation.css';
import {
  Link
} from "react-router-dom";
import { Container, Nav, Navbar } from 'react-bootstrap';

function Navigation() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/inventory">Inventory</Link>
            <Link className="nav-link" to="/pos">POS</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    // <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    //   <div className="container-fluid">
    //     <a className="navbar-brand" href="/">Navbar</a>
    //     <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
    //       <span className="navbar-toggler-icon"></span>
    //     </button>
    //     <div className="collapse navbar-collapse" id="navbarColor02">
    //       <ul className="navbar-nav me-auto mb-2 mb-lg-0">
    //         <li className="nav-item">
    //           <Link className="nav-link" to="/">Home</Link>
    //         </li>
    //         <li>
    //           <Link className="nav-link" to="/inventory">Inventory</Link>
    //         </li>
    //         <li>
    //           <Link className="nav-link" to="/store-front">Store front</Link>
    //         </li>
    //       </ul>
    //     </div>
    //   </div>
    // </nav>
  );
}

export default Navigation;

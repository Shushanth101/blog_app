import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavbarBS from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Navbar() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

useEffect(() => {
  const tokenFromCookie = Cookies.get('token');
  if (!tokenFromCookie) return;

  setToken(tokenFromCookie); // for local use or other components

  fetch('http://localhost:9000/validate/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: tokenFromCookie }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.error('Invalid token');
        Cookies.remove('token');
        window.location.href = "/user/login";
      } else {
        setUser(data);
      }
    })
    .catch((err) => {
      console.error('Validation error:', err);
      Cookies.remove('token');
      window.location.href = "/user/login";
    });
}, []);

  const handleLogout = () => {
    Cookies.remove('token');
    setToken(null);
    setUser(null);
    window.location.href = '/'; 
  };

  return (
    <NavbarBS expand="lg" className="bg-body-tertiary">
      <Container>
        <NavbarBS.Brand href="/">Blogify</NavbarBS.Brand>
        <NavbarBS.Toggle aria-controls="basic-navbar-nav" />
        <NavbarBS.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>

            {user ? (
              <>
                <Nav.Link href="/blog/add-new">Add Blog</Nav.Link>
                <NavDropdown title={user.fullName} id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link href="/user/signup">Create Account</Nav.Link>
                <Nav.Link href="/user/signin">Signin</Nav.Link>
              </>
            )}
          </Nav>
        </NavbarBS.Collapse>
      </Container>
    </NavbarBS>
  );
}




export default Navbar;
/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBars } from "@fortawesome/free-solid-svg-icons";

class AdminNavbar extends React.Component {
  render() {
    return (
      <>
        <Navbar
          className="navbar-top bg-gradient-secondary"
          expand="md"
          id="navbar-main"
        >
          <Container fluid>
            <div className="titleOfMain"><a href='/main'>TRANSCRIPTIFY</a></div>
            <Nav className="align-items-center d-none d-md-flex menuMarginRight" navbar >
              <UncontrolledDropdown nav >
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <FontAwesomeIcon icon={faBars} className="text-lg" />
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-lg font-weight-bold">
                        Menu
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0 text-sm">Welcome!</h6>
                  </DropdownItem>
                  <DropdownItem to="/main/upload" tag={Link}>
                    <i className="ni ni-single-02" />
                    <span className="text-lg">Upload</span>
                  </DropdownItem>
                  <DropdownItem to="/main/analysis" tag={Link}>
                    <i className="ni ni-single-02" />
                    <span className="text-lg">Analyse</span>
                  </DropdownItem>
                  <DropdownItem to="/video" tag={Link}>
                    <i className="ni ni-single-02" />
                    <span className="text-lg">Videocall</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default AdminNavbar;

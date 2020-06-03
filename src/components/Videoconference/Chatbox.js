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
/*eslint-disable*/
import React from "react";
import {
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col
} from "reactstrap";


class ChatBox extends React.Component {
    render() {
        return (
            <>
            <div><br/></div>
               <Form>
                    <Input
                        id="exampleFormControlTextarea1"
                        placeholder="Generated text of AI ..."
                        rows="25"
                        type="textarea"
                        readOnly
                    />
                </Form>
            </>
        );
    }
}

export default ChatBox;

import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink
} from "shards-react";
import axios from 'axios';

export default class UserActions extends React.Component {

  // const [user_name, setUser_name] = useState("");


  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      totalReactPackages: 0,
      totalReactPackages_: 0
    };

    this.toggleUserActions = this.toggleUserActions.bind(this);
    
    
  }
  
  // async componentDidMount() {
  // }
  


  toggleUserActions() {
    this.setState({
      visible: !this.state.visible
    });

    axios.get('http://localhost:3001/api/check_request_num')
    .then(response => {
      
      const posts = response.data[0].total;
      this.setState({ totalReactPackages: posts });
    });
    
    axios.get('http://localhost:3001/api/check_receive_num')
    .then(response => {
      
      const posts = response.data[0].total;
      this.setState({ totalReactPackages_: posts });
    });

    console.log(this.state.totalReactPackages)

  }

  log_out(){
    sessionStorage.removeItem('user_id')
    document.location.href = '/'
  }
  // useEffect(() => {
  
  //   async function user_set_id(){

  //     setUser_name(sessionStorage.getItem('user_id'));
  //   }
  //   user_set_id();
  
  // }, []);


//   render() {
//     return (
//       <NavItem tag={Dropdown} caret toggle={this.toggleUserActions}>
//         <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
//           <span className="d-none d-md-inline-block">{sessionStorage.getItem('user_id')}</span>
//         </DropdownToggle>
//         <Collapse tag={DropdownMenu} right small open={this.state.visible}>
//           <DropdownItem onClick={this.log_out} className="text-danger">
//             <i className="material-icons text-danger">&#xE879;</i> Logout
//           </DropdownItem>
//           <DropdownItem onClick={this.log_out}>
//             <i className="material-icons">&#xE7FD;</i> 트랜잭션(관리자)
//           </DropdownItem>
//         </Collapse>
//       </NavItem>
//     );
//   }
// }




  render() {
    const { totalReactPackages } = this.state;
    const { totalReactPackages_ } = this.state;

    if (sessionStorage.getItem('user_id') == 'admin'){
      return (<NavItem tag={Dropdown} caret toggle={this.toggleUserActions}>
                <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
                  <span className="d-none d-md-inline-block">{sessionStorage.getItem('user_id')}</span>
                </DropdownToggle>
                <Collapse tag={DropdownMenu} right small open={this.state.visible}>
                  <DropdownItem onClick={this.log_out} className="text-danger">
                    <i className="material-icons text-danger">&#xE879;</i> Logout
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/admin">
                    <i className="material-icons">&#xE7FD;</i> 트랜잭션(관리자)
                  </DropdownItem>
                </Collapse>
              </NavItem>
              )
    }
    else if (sessionStorage.getItem('user_id') == 'aaa'){
      return (<NavItem tag={Dropdown} caret toggle={this.toggleUserActions}>
                <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
                  <span className="d-none d-md-inline-block">{sessionStorage.getItem('user_id')}</span>
                </DropdownToggle>
                <Collapse tag={DropdownMenu} right small open={this.state.visible}>
                  <DropdownItem onClick={this.log_out} className="text-danger">
                    <i className="material-icons text-danger">&#xE879;</i> Logout
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/rejectedTransaction">
                    <i className="material-icons text-danger">notifications</i> 알림 &nbsp;
                    <a style={{color: 'red'}}>{totalReactPackages}</a>
                  </DropdownItem>

                </Collapse>
              </NavItem>
              )
    }
    else if (sessionStorage.getItem('user_id') == 'bbb'){
      return (<NavItem tag={Dropdown} caret toggle={this.toggleUserActions}>
                <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
                  <span className="d-none d-md-inline-block">{sessionStorage.getItem('user_id')}</span>
                </DropdownToggle>
                <Collapse tag={DropdownMenu} right small open={this.state.visible}>
                  <DropdownItem onClick={this.log_out} className="text-danger">
                    <i className="material-icons text-danger">&#xE879;</i> Logout
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/grantTransaction">
                    <i className="material-icons text-danger">notifications</i> 알림 &nbsp;
                    <a style={{color: 'red'}}>{totalReactPackages_}</a>
                  </DropdownItem>
                </Collapse>
              </NavItem>
              )
    }
    else {
      return (<NavItem tag={Dropdown} caret toggle={this.toggleUserActions}>
                  <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
                    <span className="d-none d-md-inline-block">{sessionStorage.getItem('user_id')}</span>
                  </DropdownToggle>
                  <Collapse tag={DropdownMenu} right small open={this.state.visible}>
                    <DropdownItem onClick={this.log_out} className="text-danger">
                      <i className="material-icons text-danger">&#xE879;</i> Logout
                    </DropdownItem>
                  </Collapse>
                </NavItem>
      )
    }
  }
}
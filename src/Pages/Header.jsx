import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {Dropdown, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import searchicon from '../assets/searchicon.png';
import helpicon from '../assets/helpicon.png';
import notification from '../assets/notification.png';
import logo from '../assets/logo.png';

export default function Header() {

    const navigate=useNavigate();

    const logout = () => {
        sessionStorage.clear();
        navigate("/login");
    }
    
  return (
    <>
      <div className="container-fluid m-0">
        <div className="row">
            <nav className="navbar navbar-expand-lg  shadow-sm mx-0 py-3" style={{backgroundColor:'white'}}>
              <div className="container-fluid">
                <img className='mx-2' width='86px' height='15px' src={logo} alt="earthoodlogo" />
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <Link className="nav-link active textgrey btnhovergrey" aria-current="page" to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="nav-item textgrey btnhovergrey">
                      <Link className="nav-link " to="/projects">Add Proposal</Link>
                    </li>
                  
                    <li className="nav-item textgrey btnhovergrey">
                    <Link className="nav-link" to="/allprojects">All Proposals</Link>
                    </li>
                  </ul>

                  <div className="d-lg-flex d-md-grid d-grid gap-3 align-items-center">
                  <img src={searchicon} alt="search icon" className='d-lg-block d-md-none d-none'/>
                  <img src={helpicon} alt="help icon" />
                  <img src={notification} alt="notification icon" />
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: '1',
                          label: (
                            <button className="nav-link" onClick={() => logout()}>LOGOUT</button>
                          )
                        }
                      ]
                    }}
                    placement="bottom"
                    arrow
                  >
                    <Avatar
                      size={{ xs: 16, sm: 24, md: 32, lg: 32, xl: 32, xxl: 50 }}
                      icon={<UserOutlined/>}
                      className='d-lg-block d-md-none d-none'
                    />
                  </Dropdown>
                </div>
                </div>
                
              </div>
            </nav>
        </div>
      </div >
    </>
  )
}

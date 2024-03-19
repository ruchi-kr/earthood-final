import React, { useEffect, useState } from 'react'
import downloadsign from '../assets/Vector.png';
import PTDash from './PTDash';
import TDash from './TDash';
import SDash from './SDash';
import Header from './Header';
import { Col, Form, Input, Modal, Row, Select } from 'antd';
import axios from 'axios';
import { API_HEADER, getClientDetails, getCountryList, saveClient } from '../config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {

  let [username,SetUserName]=useState('');
  let [designation_id,SetDesignation]=useState(0);
  let [modalVisible,SetModalVisible]=useState(false);
  let [callApi,SetCallApi]=useState(false);
  let [formdisable,SetFormDisabled]=useState(false);

  const { Option } = Select;

  const [clientform] = Form.useForm();
  const [continent_list, setContinentList] = useState([]);

  const [country_list, setCountryList] = useState([]);
  let [client_id,SetClientId]=useState(null);

  let navigate=useNavigate();

  const clientData = {
    name: '',
    email: '',
    mobile_number: '',
    continent:'',
    country: '',
    address: '',
    contact_person:'',
    contact_email:'',
    contact_mobile:''
  };

  useEffect(function(){
    const name=sessionStorage.getItem('name');
    SetUserName(name)
  },[])

  useEffect(function(){
    const id=sessionStorage.getItem('designation_id');
    SetDesignation(parseInt(id))
  },[])


  const getCountry=async()=>{

    try{
      const result=await axios.get(`${getCountryList}`);
      setCountryList(result.data.data);
    }catch(error){

    }

  }
  const getContinent=async()=>{

    try{
      const result=await axios.get(`${getCountryList}`);
      setContinentList(result.data.data);
    }catch(error){

    }

  }
  const openClientAdd=()=>{
    SetModalVisible(true);
    getCountry();
    getContinent();
    SetClientId(null);
    clientform.setFieldsValue(clientData);
    SetFormDisabled(false)
  }

  const openClientEdit = async (id,mode) => {
    SetModalVisible(true);

    try {
      const payload = {
          "client_id": id
      }
      getCountry();
      getContinent();

      const response = await axios.post(`${getClientDetails}`,payload, API_HEADER);
  
      if(response.status===200 && response.data.status===true){
        let clientrecord=response.data.data;

        const clientDatas = {
          name: clientrecord.name,
          email: clientrecord.email,
          mobile_number: clientrecord.mobile_number,
          continent: clientrecord.continent,
          country: clientrecord.country,
          address: clientrecord.address,
          contact_person:clientrecord.contact_person,
          contact_email:clientrecord.contact_email,
          contact_mobile:clientrecord.contact_mobile
        };

        clientform.setFieldsValue(clientDatas);
        SetClientId(clientrecord.id);

        if(mode===2){
          SetFormDisabled(true)
        }else{
          SetFormDisabled(false)
        }

      }
      
   } catch (error) {
      console.log(error)
      
   }

  };

  const clientFormSubmit=(values)=>{
    clientform.validateFields()
    .then((values) => {

      const requestData = { ...values,client_id }

      axios.post(`${saveClient}`, requestData, API_HEADER)
          .then((result) => {
              if (result.status===200 && result.data.status===true) {

                  if(client_id===null){
                    toast.success('Client Added Successfully!');
                  }else{
                    toast.success('Client Details Updated Successfully!');
                  }

                  clientform.resetFields();
                  SetModalVisible(false);
                  SetCallApi(true);
                  navigate('/dashboard')
              }
          }).catch((error) => {
            console.log(error);
            toast.error(error.response.data.message);
        })

    })
    .catch((errorInfo) => {
      console.log('Validation failed:', errorInfo);
    });
  }

  return (
    <>
    <div className="bg-white mb-5">
    
      <Header/>
     
      <div className="d-flex justify-content-between align-items-center m-5 mt-4">
        <div>
          <h5 className='textcolorblue'>Welcome Back, {username}</h5>
        </div>
        <div className="d-flex gap-2 align-items-center mx-5">

     
      <button className='btn border-light-subtle textcolor bg-white' style={{ fontSize: '14px' }}>Download Report  <img src={downloadsign} alt="downloadsign" /></button>

      {designation_id==6?
        <button className='btn border-0 btn-success text-white bg_green' style={{ fontSize: '14px' }} onClick={openClientAdd}>Add Client</button>:''
        }    

        </div>
      </div>

      {(() => {
        if (designation_id === 6) {
          return <PTDash callApi={callApi} openClientEdit={openClientEdit}/>
        } else if (designation_id === 3 || designation_id===4) {
          return <TDash/>
        } else {
          return <SDash/>
        }
      })()}

      <Modal title={client_id===null?'Add Client':'Edit Client'} visible={modalVisible}  
          onOk={clientFormSubmit} 
          onCancel={() => { 
            SetModalVisible(false); 
          }}
          okText="Submit"
          okButtonProps={{ style: { display: formdisable ? 'none' : '' } }}
          width={800}
          >

        {/* <p className='textlightgreen mt-2'>A small KYC of your client for healthy relationship!</p> */}

        <Form form={clientform} onFinish={clientFormSubmit} layout="vertical" disabled={formdisable}>

        <p className='textcolorblue fw-bold'>Organisation Details</p>

      <Row gutter={[8, 4]}>
        <Col span={12}>
          <Form.Item name="name" label="Company Name"
           rules={[
            { required: true, message: 'Name is required' },
          ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12} >
          <Form.Item name="mobile_number" label="Contact No."
            rules={[
              // { required: true, message: 'Mobile is required' },
              { pattern: /^[0-9]+$/, message: 'Mobile number must contain only digits' },
              { len: 10, message: 'Mobile number must be exactly 10 digits' },
            ]}>
            <Input maxLength={10}/>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="email" label="Email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email' },
          ]}>
            <Input type="email" placeholder="name@example.com"  />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="continent" label="Continent"
           rules={[
            { required: true, message: 'Continent is required' },
          ]}>
            <Select placeholder="Select Continent">
              <Option value="">Select Continent</Option>
              {
                 continent_list.map((item, index) => {
                     return (
                         <Option key={index} value={item.id}>{item.name}</Option>
                     )
                 })
             }              
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="country" label="Country"
           rules={[
            { required: true, message: 'Country is required' },
          ]}>
            <Select placeholder="Select Country">
              <Option value="">Select Country</Option>
              {
                 country_list.map((item, index) => {
                     return (
                         <Option key={index} value={item.id}>{item.name}</Option>
                     )
                 })
             }              
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="address" label="Address">
             <Input.TextArea/>
          </Form.Item>
        </Col>

      </Row>

      <p className='textcolorblue fw-bold'>Contact Person Details</p>

      <Row gutter={[8, 4]}>
        <Col span={12}>
          <Form.Item name="contact_person" label="Name"
           rules={[
            { required: true, message: 'Name is required' },
          ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12} >
          <Form.Item name="contact_mobile" label="Mobile No."
            rules={[
              { required: true, message: 'Mobile is required' },
              { pattern: /^[0-9]+$/, message: 'Mobile number must contain only digits' },
              { len: 10, message: 'Mobile number must be exactly 10 digits' },
            ]}>
            <Input maxLength={10}/>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="contact_email" label="Email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email' },
          ]}>
            <Input type="email" placeholder="name@example.com"  />
          </Form.Item>
        </Col>


      </Row>

        </Form>

      </Modal>

    </div>
    </>
  )
}

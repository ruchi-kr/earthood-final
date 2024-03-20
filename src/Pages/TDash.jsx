import { Input, Table, Tabs, DatePicker, Button, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
// import CustomTable from '../Components/CustomTable';
import { faFileSignature, faFileArrowDown, faFileCircleCheck, faFileCircleQuestion, faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { get_proposal_detail_url, getCountryList, get_client_name_url } from '../config';

import { API_HEADER, getDashboardData, getAllProposals } from '../config';
import axios from 'axios';
import { toast } from 'react-toastify';
import viewicon from '../assets/viewicon.png';
import PtActions from './PtActions'
import { useNavigate } from 'react-router-dom';
const { Option } = Select;
export default function TDash() {

  // local storage get data
  const mail_data = JSON.parse(localStorage.getItem('mail_reminder'))
     console.log("my mail data",mail_data.mail_days_warning);
  // country search filter
  const [countryList, setCountryList] = useState([]);
  const [clientname, setClientname] = useState([]);
  const getCountry = async () => {
    try {
      const result = await axios.get(`${getCountryList}`);
      setCountryList(result.data.data);
    } catch (error) {
      // Handle error
      toast.error('Error fetching country list')
    }
  };
  const getClientname = async () => {
    try {
      const result = await axios.get(`${get_client_name_url}`);
      setClientname(result.data.data);
    } catch (error) {
      // Handle error
      toast.error('Error fetching Clientname list')
    }
  };
  
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    getCountry();
    getClientname();
  }, []);

  const dateFormat = 'DD/MM/YYYY';
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [country, setCountry] = useState(null);
  const [client_id, setClient_id] = useState(null);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const handleSearchByDateRange = (value) => {
    // Filter the data based on the entered date value
    const currentDate = moment(); // Get the current date
    if (fromDate && fromDate.isAfter(currentDate)) {
      toast.error("From date cannot be a future date");
    } else if (toDate && toDate.isAfter(currentDate)) {
      toast.error("To date cannot be a future date");
    } else if (fromDate && toDate && fromDate.isAfter(toDate)) {
      toast.error("From date cannot be greater than to date");
    }
    else {
      Setloader(true);
    }

  }
  const navigate = useNavigate();
  const [proposal_received_pt, setProposal_received_pt] = useState(0)
  const [proposal_sent_clarify, setProposal_sent_clarify] = useState(0)
  const [approved_proposal, setApproved_proposal] = useState(0)
  const [signed_contract, setSigned_contract] = useState(0)

  let [loader, Setloader] = useState(false);

  const [activeKey, setActiveKey] = useState('1');
  const [statuskey, setStatus] = useState(1);
  const [alldata, setAlldata] = useState([]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const getDashData = async () => {

    try {

      const result = await axios.get(`${getDashboardData}`,
        API_HEADER);
      const dashboard = result.data.dashboard;

      setProposal_received_pt(dashboard.status1);
      setProposal_sent_clarify(dashboard.status3);
      setApproved_proposal(dashboard.status5);
      setSigned_contract(dashboard.status8);


    } catch (error) {
      console.log(error)
    }

  }
  const handlePtActions = async (record) => {
    const payload = {
      proposal_id: record.proposal_id
    }

    const response = await axios.post(`${get_proposal_detail_url}`, payload, API_HEADER)
    const data = response.data.record;
    console.log(data)
    navigate('/ptactions', { state: { data } })
  }

  const allData = async () => {
    try {
      let payload = {
        status: statuskey,
        page: pagination.current,
        limit: pagination.pageSize,
        fromDate: fromDate ? fromDate.format('YYYY-MM-DD') : null,
        toDate: toDate ? toDate.format('YYYY-MM-DD') : null,
        country: country ? country : null,
        client_id: client_id ? client_id : null
      }
      const response = await axios.post(`${getAllProposals}`, payload, API_HEADER);
      setAlldata(response.data.data);

      setPagination(prevPagination => ({
        ...prevPagination,
        total: response.data.count,
      }));

      Setloader(false);

    }
    catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleTableChange = (pagination, filters, sorter) => {

    setPagination(pagination);
    Setloader(true);
  };

  const handleTabChange = (key) => {
    setFromDate('');
    setToDate('');
    setCountry('');
    setClient_id('');

    setActiveKey(key)

    setPagination(prevPagination => ({
      ...prevPagination,
      current: 1,
    }));

    if (key == 1) {
      setStatus(1)
    }
    else if (key == 2) {
      setStatus(3)
    }
    else if (key == 3) {
      setStatus(5)
    }
    else if (key == 4) {
      setStatus(8)
    }
    Setloader(true);

  };

  useEffect(() => {
    console.log("useEffect triggered with status:", statuskey);
    allData();
  }, [loader]);

  useEffect(() => {
    getDashData()
  }, [])

  
  const handleClientNameSearch = (value) => {
    setClient_id(value);
    Setloader(true);
  };

  
  const handleCountrySearch = (value) => {
    // Ensure value is a string before calling toLowerCase
    setCountry(value);
    Setloader(true);

  };


  const columnProposalReceivedPT = [
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>S.No</span>,
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
      render: (id, record, index) => {
        const pageIndex = (pagination.current - 1) * pagination.pageSize;
        return pageIndex + index + 1;
      },
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Proposal Recd.Date</span>,
      render: (text, record) => {
        return (
          <span className='font14px fw-bold'>{record.created_at.slice(0, 10)}</span>
        );
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>EID</span>,
      fixed: 'left',
      dataIndex: 'earthood_id',
    },
    // {
    //   title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Project Name</span>,
    //   render: (text, record) => {
    //     return (
    //       <span className='text-capitalize textcolor font14px fw-bold'>{record.project_name}</span>
    //     );
    //   }
    // },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Project Name</span>,
      render: (text, record) => {
        // Calculate the difference between proposal received date and action taken date
        const proposalReceivedDate = new Date(record.created_at);
        const actionTakenDate = new Date(record.tm_action_date);
        const differenceInDays = Math.floor((actionTakenDate - proposalReceivedDate) / (1000 * 60 * 60 * 24));

        let projectNameStyle = {}; // Style object to be applied to project name
        let delayDays = '';
        let redDot = false;
        // Case 1: Difference is 3 days, show red dot
        if (differenceInDays === 3) {
          // projectNameStyle = { color: 'yellow' }; // Apply red color
          redDot = true;
        }
        // Case 2: Difference is more than 5 days, show project name in red
        else if (differenceInDays > 5) {
          projectNameStyle = { color: 'red' }; // Apply red color
          delayDays = differenceInDays - 5;
          redDot = false;
        }

        return (
          <span className='text-capitalize textcolor font14px fw-bold' style={projectNameStyle}>{redDot ? <span><FontAwesomeIcon icon={faCircle} style={{ color: 'red' }} /></span> : ''}{record.project_name}{delayDays ? ` (${delayDays} days)` : ''}</span>
        );
      }
    },

    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Client Name</span>,
      render: (text, record) => {
        return (
          <span className='text-capitalize textcolor font14px fw-bold'>{record.client_name}</span>
        );
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Sector</span>,
      render: (text, record) => {
        if (record.sector) {
          return (
            <span className='text-capitalize textcolorgreen fw-bold p-2 rounded-4 border-0 bg_lightgreen'>
              {record.sector}
            </span>
          );
        } else {
          return null;
        }
      }
    },
    // {
    //   title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Contact Person</span>,
    //   dataIndex: 'contact_person',
    // },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Country</span>,
      render: (text, record) => {
        if (record.country) {
          return (
            <span className='text-capitalize textcolorgreen fw-bold p-2 rounded-4 border-0 bg_lightgreen'>
              {record.country}
            </span>
          );
        } else {
          return null;
        }
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Action</span>,
      dataIndex: '',
      key: 'x',
      fixed: 'right',
      render: (record) =>
        <EditOutlined style={{ marginRight: '8px', color: 'blue' }} onClick={() => handlePtActions(record)} />

    },
  ];

  const columnApprovedProposal = [
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>S.No</span>,
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
      render: (id, record, index) => {
        const pageIndex = (pagination.current - 1) * pagination.pageSize;
        return pageIndex + index + 1;
      },
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Proposal Recd.Date</span>,
      // dataIndex: 'created_at',
      render: (text, record) => {
        return (
          <span className='font14px fw-bold'>{record.pt_submit_date.slice(0, 10)}</span>
        );
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Action taken Date</span>,
      render: (text, record) => {
        return (
          <span className='font14px fw-bold'>{record.tm_action_date.slice(0, 10)}</span>
        );
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>EID</span>,
      dataIndex: 'earthood_id',
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Project Name</span>,
      render: (text, record) => {
        // Parse proposal received date
        const proposalReceivedDateParts = record.pt_submit_date.split(' ')[0].split('-');
        const proposalReceivedDate = new Date(`${proposalReceivedDateParts[2]}-${proposalReceivedDateParts[1]}-${proposalReceivedDateParts[0]}`);
        console.log(proposalReceivedDate);

        // Parse action taken date (similarly as above)
        const actionTakenDateParts = record.tm_action_date.split(' ')[0].split('-');
        const actionTakenDate = new Date(`${actionTakenDateParts[2]}-${actionTakenDateParts[1]}-${actionTakenDateParts[0]}`);
        console.log(actionTakenDate);
        const differenceInDays = Math.floor((actionTakenDate - proposalReceivedDate) / (1000 * 60 * 60 * 24));

        let projectNameStyle = { color: 'green' }; // Style object to be applied to project name
        let delayDays = '';
        let redDot = false;
        // Case 1: Difference is 3 days, show red dot
        if (differenceInDays == mail_data.mail_days_warning) {
          redDot = true;
        }
        // Case 2: Difference is more than 5 days, show project name in red
        else if (differenceInDays > mail_data.mail_days_danger) {
          projectNameStyle = { color: 'red' }; // Apply red color
          delayDays = differenceInDays - 5;
          redDot = false;
        }

        return (
          <span className='text-capitalize font14px fw-bold' style={projectNameStyle}>
            {redDot ? <span><FontAwesomeIcon icon={faCircle} size='2xs' style={{ color: 'red' }} /></span> : ''}
            &nbsp;{record.project_name}
            {delayDays ? ` (${delayDays} days)` : ''}
          </span>
        );
      }

    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Client Name</span>,
      render: (text, record) => {
        return (
          <span className='text-capitalize textcolor font14px fw-bold'>{record.client_name}</span>
        );
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Sector</span>,
      render: (text, record) => {
        if (record.sector) {
          return (
            <span className='text-capitalize textcolorgreen fw-bold p-2 rounded-4 border-0 bg_lightgreen'>
              {record.sector}
            </span>
          );
        } else {
          return null;
        }
      }
    },
    // {
    //   title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Contact Person</span>,
    //   dataIndex: 'contact_person',
    // },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Country</span>,
      render: (text, record) => {
        if (record.country) {
          return (
            <span className='text-capitalize textcolorgreen fw-bold p-2 rounded-4 border-0 bg_lightgreen'>
              {record.country}
            </span>
          );
        } else {
          return null;
        }
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Action</span>,
      dataIndex: '',
      key: 'x',
      fixed: 'right',
      width: 130,
      render: (record) =>
        <EyeOutlined style={{ marginRight: '8px', color: 'blue' }} onClick={() => handlePtActions(record)} />
    },
  ];

  const columnSignedContract = [
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>S.No</span>,
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
      render: (id, record, index) => {
        const pageIndex = (pagination.current - 1) * pagination.pageSize;
        return pageIndex + index + 1;
      },
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Recd.Date</span>,
      render: (text, record) => {
        return (
          <span className='font14px fw-bold'>{record.created_at.slice(0, 10)}</span>
        );
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>EID</span>,
      dataIndex: 'earthood_id',
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Project Name</span>,
      render: (text, record) => {
        return (
          <span className='text-capitalize textcolor font14px fw-bold'>{record.project_name}</span>
        );
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Client Name</span>,
      render: (text, record) => {
        return (
          <span className='text-capitalize textcolor font14px fw-bold'>{record.client_name}</span>
        );
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Sector</span>,
      render: (text, record) => {
        if (record.sector) {
          return (
            <span className='text-capitalize textcolorgreen fw-bold p-2 rounded-4 border-0 bg_lightgreen'>
              {record.sector}
            </span>
          );
        } else {
          return null;
        }
      }
    },
    // {
    //   title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Contact Person</span>,
    //   dataIndex: 'contact_person',
    // },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Country</span>,
      render: (text, record) => {
        if (record.country) {
          return (
            <span className='text-capitalize textcolorgreen fw-bold p-2 rounded-4 border-0 bg_lightgreen'>
              {record.country}
            </span>
          );
        } else {
          return null;
        }
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Action</span>,
      dataIndex: '',
      key: 'x',
      fixed: 'right',
      width: 130,
      render: () => <a><img src={viewicon} alt="view icon" />&nbsp;</a>,
    },
  ];

  return (
    <>

      <div className='container-fluid'>
        <div className="row mx-0">
          <Tabs defaultActiveKey='1' centered activeKey={activeKey} onChange={handleTabChange}>

            <Tabs.TabPane
              tab={
                <div className='border-1 borderlightgreen bg-white rounded-2 p-2 m-5 text-center tabactivecolor  tab_dashboard_size'>
                  <FontAwesomeIcon icon={faFileArrowDown} size="2xl" className='iconcolor' />
                  <p className='font14px textlightgreen text-capitalize mt-4'>proposal received</p>
                  <p className='textcolorblue' style={{ fontSize: '35px' }}>{proposal_received_pt}</p>
                </div>
              }
              key='1'>

              <div className='container-fluid'>
                <div className="row mx-0">
                  <div className="col-12 border-2 border border-light-subtle p-0 rounded-3">
                    <div className="d-flex justify-content-evenly align-items-center py-4 px-0 bg-white border-0 shadow-sm rounded-top-3">
                      {/* Date Range Picker */}
                      <div className='d-flex align-items-center'>
                        <div className='d-grid mb-3'>
                          <label className='text-capitalize textcolumntitle font14px fw-bold'>From Recd.Date </label>
                          <DatePicker onChange={handleFromDateChange} placeholder="From Date" style={{ width: '110px', marginRight: '10px' }} format={dateFormat} showTime={false} />
                        </div>
                        <div className='d-grid mb-3'>
                          <label className='text-capitalize textcolumntitle font14px fw-bold'>To Recd.Date </label>
                          <DatePicker onChange={handleToDateChange} placeholder="To Date" style={{ width: '110px' }} format={dateFormat} showTime={false} />
                        </div>
                        <Button className='ms-1 py-1 px-2 btn btn-success btn-sm rounded-4' onClick={handleSearchByDateRange}>Search</Button>
                        {/* <FontAwesomeIcon icon={faMagnifyingGlass} size='xl'onClick={handleSearchByDateRange} />  */}
                      </div>

                      {/* Filter by Client Name onChange={handleClientNameSearch}*/}
                      <div className='d-grid mb-3'>
                        <label className='text-capitalize textcolumntitle font14px fw-bold'>Client Name </label>
                        <Select
                          showSearch
                          allowClear
                          placeholder="Select client name"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          onChange={handleClientNameSearch}
                        >
                       
                          {clientname.map((client, index) => (
                            <Option key={index} value={client.id} label={client.name}>
                              {client.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      {/* Filter by Country  onChange={handleCountrySearch}  */}
                      <div className='d-grid mb-3'>                    
                      <label className='text-capitalize textcolumntitle font14px fw-bold'>Country </label>
                        <Select
                          showSearch
                          allowClear
                          placeholder="Select country"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          onChange={handleCountrySearch}
                        >
                       
                          {countryList.map((country, index) => (
                            <Option key={index} value={country.id} label={country.name}>
                              {country.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      {/* <Button className='mx-2' onClick={handleSearchByDateRange}>Search</Button> */}
                      <div className='d-grid mb-3'>
                        <label className='text-capitalize textcolumntitle font14px fw-bold'>Search </label>
                        <Input.Search  allowClear/>
                      </div>
                    </div>
                    {/* table */}
                    <Table columns={columnProposalReceivedPT} loading={loader}
                     dataSource={alldata} 
                     rowKey='proposal_id' pagination={pagination} onChange={handleTableChange} 
                     />
                  </div>
                </div>
              </div>
           
            </Tabs.TabPane>

            <Tabs.TabPane
              tab={
                <div className='border-1 borderlightgreen bg-white rounded-2 p-2 m-5 text-center tabactivecolor  tab_dashboard_size'>
                  <FontAwesomeIcon icon={faFileCircleQuestion} size="2xl" className='iconcolor' />
                  <p className='font14px textlightgreen text-capitalize mt-4'>proposal sent for clarification</p>
                  <p className='textcolorblue' style={{ fontSize: '35px' }}>{proposal_sent_clarify}</p>

                </div>
              }
              key='2'>

              <div className='container-fluid'>
                <div className="row mx-0">
                  <div className="col-12 border-2 border border-light-subtle p-0 rounded-3">
                  <div className="d-flex justify-content-evenly align-items-center py-4 px-0 bg-white border-0 shadow-sm rounded-top-3">
                       {/* Date Range Picker */}
                       <div className='d-flex align-items-center'>
                        <div className='d-grid mb-3'>
                          <label className='text-capitalize textcolumntitle font14px fw-bold'>From Recd.Date </label>
                          <DatePicker onChange={handleFromDateChange} placeholder="From Date" style={{ width: '110px', marginRight: '10px' }} format={dateFormat} showTime={false} />
                        </div>
                        <div className='d-grid mb-3'>
                          <label className='text-capitalize textcolumntitle font14px fw-bold'>To Recd.Date </label>
                          <DatePicker onChange={handleToDateChange} placeholder="To Date" style={{ width: '110px' }} format={dateFormat} showTime={false} />
                        </div>
                        <Button className='ms-1 py-1 px-2 btn btn-success btn-sm rounded-4' onClick={handleSearchByDateRange}>Search</Button>
                        {/* <FontAwesomeIcon icon={faMagnifyingGlass} size='xl'onClick={handleSearchByDateRange} />  */}
                      </div>

                      {/* Filter by Client Name onChange={handleClientNameSearch}*/}
                      <div className='d-grid mb-3'>
                        <label className='text-capitalize textcolumntitle font14px fw-bold'>Client Name </label>
                        <Select
                          showSearch
                          allowClear
                          placeholder="Select client name"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          onChange={handleClientNameSearch}
                        >
                       
                          {clientname.map((client, index) => (
                            <Option key={index} value={client.id} label={client.name}>
                              {client.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      {/* Filter by Country  onChange={handleCountrySearch}  */}
                      <div className='d-grid mb-3'>                    
                      <label className='text-capitalize textcolumntitle font14px fw-bold'>Country </label>
                        <Select
                          showSearch
                          allowClear
                          placeholder="Select country"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          onChange={handleCountrySearch}
                        >
                       
                          {countryList.map((country, index) => (
                            <Option key={index} value={country.id} label={country.name}>
                              {country.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      {/* <Button className='mx-2' onClick={handleSearchByDateRange}>Search</Button> */}
                      <div className='d-grid mb-3'>
                        <label className='text-capitalize textcolumntitle font14px fw-bold'>Search </label>
                        <Input.Search  allowClear/>
                      </div>
                    </div>
                    <Table columns={columnApprovedProposal} loading={loader} dataSource={alldata} rowKey='proposal_id' pagination={pagination} onChange={handleTableChange} />
                  </div>
                </div>
              </div>

            </Tabs.TabPane>

            <Tabs.TabPane
              tab={
                <div className='border-1 borderlightgreen bg-white rounded-2 p-2 m-5 text-center tabactivecolor tab_dashboard_size'>
                  <FontAwesomeIcon icon={faFileCircleCheck} size="2xl" className='iconcolor' />
                  <p className='font14px textlightgreen text-capitalize mt-4'>approved proposal</p>
                  <p className='textcolorblue' style={{ fontSize: '35px' }}>{approved_proposal}</p>
                </div>
              }
              key='3'>

              <div className='container-fluid'>
                <div className="row mx-0">
                  <div className="col-12 border-2 border border-light-subtle p-0 rounded-3">
                  <div className="d-flex justify-content-evenly align-items-center py-4 px-0 bg-white border-0 shadow-sm rounded-top-3">
                      {/* Date Range Picker */}
                      <div className='d-flex align-items-center'>
                        <div className='d-grid mb-3'>
                          <label className='text-capitalize textcolumntitle font14px fw-bold'>From Recd.Date </label>
                          <DatePicker onChange={handleFromDateChange} placeholder="From Date" style={{ width: '110px', marginRight: '10px' }} format={dateFormat} showTime={false} />
                        </div>
                        <div className='d-grid mb-3'>
                          <label className='text-capitalize textcolumntitle font14px fw-bold'>To Recd.Date </label>
                          <DatePicker onChange={handleToDateChange} placeholder="To Date" style={{ width: '110px' }} format={dateFormat} showTime={false} />
                        </div>
                        <Button className='ms-1 py-1 px-2 btn btn-success btn-sm rounded-4' onClick={handleSearchByDateRange}>Search</Button>
                        {/* <FontAwesomeIcon icon={faMagnifyingGlass} size='xl'onClick={handleSearchByDateRange} />  */}
                      </div>

                      {/* Filter by Client Name onChange={handleClientNameSearch}*/}
                      <div className='d-grid mb-3'>
                        <label className='text-capitalize textcolumntitle font14px fw-bold'>Client Name </label>
                        <Select
                          showSearch
                          allowClear
                          placeholder="Select client name"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          onChange={handleClientNameSearch}
                        >
                       
                          {clientname.map((client, index) => (
                            <Option key={index} value={client.id} label={client.name}>
                              {client.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      {/* Filter by Country  onChange={handleCountrySearch}  */}
                      <div className='d-grid mb-3'>                    
                      <label className='text-capitalize textcolumntitle font14px fw-bold'>Country </label>
                        <Select
                          showSearch
                          allowClear
                          placeholder="Select country"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          onChange={handleCountrySearch}
                        >
                       
                          {countryList.map((country, index) => (
                            <Option key={index} value={country.id} label={country.name}>
                              {country.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      {/* <Button className='mx-2' onClick={handleSearchByDateRange}>Search</Button> */}
                      <div className='d-grid mb-3'>
                        <label className='text-capitalize textcolumntitle font14px fw-bold'>Search </label>
                        <Input.Search  allowClear/>
                      </div>
                    </div>
                    <Table columns={columnApprovedProposal} loading={loader} dataSource={alldata} rowKey='proposal_id' pagination={pagination} onChange={handleTableChange} />
                  </div>
                </div>
              </div>

            </Tabs.TabPane>

            <Tabs.TabPane
              tab={
                <div className='border-1 borderlightgreen bg-white rounded-2 p-2 m-5 text-center tabactivecolor tab_dashboard_size'>
                  <FontAwesomeIcon icon={faFileSignature} size="2xl" className='iconcolor' />
                  <p className='font14px textlightgreen text-capitalize mt-4'>signed contract</p>
                  <p className='textcolorblue' style={{ fontSize: '35px' }}>{signed_contract}</p>
                </div>
              }
              key='4'>

              <div className='container-fluid'>
                <div className="row mx-0">
                  <div className="col-12 border-2 border border-light-subtle p-0 rounded-3">
                  <div className="d-flex justify-content-evenly align-items-center py-4 px-0 bg-white border-0 shadow-sm rounded-top-3">
                      {/* Date Range Picker */}
                      <div className='d-flex align-items-center'>
                        <div className='d-grid mb-3'>
                          <label className='text-capitalize textcolumntitle font14px fw-bold'>From Recd.Date </label>
                          <DatePicker onChange={handleFromDateChange} placeholder="From Date" style={{ width: '110px', marginRight: '10px' }} format={dateFormat} showTime={false} />
                        </div>
                        <div className='d-grid mb-3'>
                          <label className='text-capitalize textcolumntitle font14px fw-bold'>To Recd.Date </label>
                          <DatePicker onChange={handleToDateChange} placeholder="To Date" style={{ width: '110px' }} format={dateFormat} showTime={false} />
                        </div>
                        <Button className='ms-1 py-1 px-2 btn btn-success btn-sm rounded-4' onClick={handleSearchByDateRange}>Search</Button>
                        {/* <FontAwesomeIcon icon={faMagnifyingGlass} size='xl'onClick={handleSearchByDateRange} />  */}
                      </div>

                      {/* Filter by Client Name onChange={handleClientNameSearch}*/}
                      <div className='d-grid mb-3'>
                        <label className='text-capitalize textcolumntitle font14px fw-bold'>Client Name </label>
                        <Select
                          showSearch
                          allowClear
                          placeholder="Select client name"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          onChange={handleClientNameSearch}
                        >
                       
                          {clientname.map((client, index) => (
                            <Option key={index} value={client.id} label={client.name}>
                              {client.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      {/* Filter by Country  onChange={handleCountrySearch}  */}
                      <div className='d-grid mb-3'>                    
                      <label className='text-capitalize textcolumntitle font14px fw-bold'>Country </label>
                        <Select
                          showSearch
                          allowClear
                          placeholder="Select country"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          onChange={handleCountrySearch}
                        >
                       
                          {countryList.map((country, index) => (
                            <Option key={index} value={country.id} label={country.name}>
                              {country.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      {/* <Button className='mx-2' onClick={handleSearchByDateRange}>Search</Button> */}
                      <div className='d-grid mb-3'>
                        <label className='text-capitalize textcolumntitle font14px fw-bold'>Search </label>
                        <Input.Search  allowClear/>
                      </div>
                    </div>
                    <Table columns={columnSignedContract} loading={loader} dataSource={alldata} rowKey='proposal_id' pagination={pagination} onChange={handleTableChange} />
                  </div>
                </div>
              </div>

            </Tabs.TabPane>

          </Tabs>
        </div>
      </div>
    </>
  )
}

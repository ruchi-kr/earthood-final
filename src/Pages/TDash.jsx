import { Input, Table, Tabs, DatePicker, Button, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
// import CustomTable from '../Components/CustomTable';
import { faFileSignature, faFileArrowDown, faFileCircleCheck, faFileCircleQuestion, faMagnifyingGlass, faCircle } from '@fortawesome/free-solid-svg-icons'
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

  // country search filter
  const [countryList, setCountryList] = useState([]);

  const getCountry = async () => {
    try {
      const result = await axios.get(`${getCountryList}`);
      setCountryList(result.data.data);
    } catch (error) {
      // Handle error
      toast.error('Error fetching country list')
    }
  };
  // function filterDropdown() {
  //   var input, filter, dropdown, options, option, i, txtValue;
  //   input = document.getElementById('searchInput');
  //   filter = input.value.toUpperCase();
  //   dropdown = document.getElementById("dropdown");
  //   options = dropdown.getElementsByTagName('option');

  //   for (i = 0; i < options.length; i++) {
  //     option = options[i];
  //     txtValue = option.textContent || option.innerText;
  //     if (txtValue.toUpperCase().indexOf(filter) > -1) {
  //       option.style.display = "";
  //     } else {
  //       option.style.display = "none";
  //     }
  //   }
  // }
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value) => {
    console.log('search:', value);
  };

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    useEffect(() => {
      getCountry();
    }, []);

  const dateFormat = 'DD/MM/YYYY';
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

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

  const [filteredData, setFilteredData] = useState([]);
  // const handleClientNameSearch = (e) => {
  //   const value = e.target.value.toLowerCase();
  //   const filteredData = alldata.filter(item => item.client_name.toLowerCase().includes(value));
  //   setFilteredData(filteredData);
  // };

  // Function to filter data by country
  const handleCountrySearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = alldata.filter(item => item.country.toLowerCase().includes(value));
    setFilteredData(filteredData);
  };

  // // Use filteredData if available, otherwise use alldata
  // const dataSource = filteredData.length > 0 ? filteredData : alldata;



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
        // Calculate the difference between proposal received date and action taken date
        const proposalReceivedDate = new Date(record.created_at);
        console.log(proposalReceivedDate);
        const actionTakenDate = new Date(record.tm_action_date);
        console.log(actionTakenDate);
        const differenceInDays = Math.floor((actionTakenDate - proposalReceivedDate) / (1000 * 60 * 60 * 24));

        let projectNameStyle = {color:'green'}; // Style object to be applied to project name
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
          <span className='text-capitalize font14px fw-bold' style={projectNameStyle}>{redDot ? <span><FontAwesomeIcon icon={faCircle} style={{ color: 'red' }} /></span> : ''}{record.project_name}{delayDays ? ` (${delayDays} days)` : ''}</span>
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
                    <div className="d-flex justify-content-evenly align-items-center p-2 bg-white border-0 shadow-sm rounded-top-3">
                      {/* Date Range Picker */}
                      <div className='d-flex align-items-center'>
                        <DatePicker onChange={handleFromDateChange} placeholder="From Date" style={{ marginRight: '10px' }} format={dateFormat} />
                        <DatePicker onChange={handleToDateChange} placeholder="To Date" format={dateFormat} />
                        <Button className='mx-2' onClick={handleSearchByDateRange}>Search</Button>
                        {/* <FontAwesomeIcon icon={faMagnifyingGlass} size='2xl'/>  */}
                      </div>

                      {/* Filter by Client Name onChange={handleClientNameSearch}*/}
                      <div>
                        <Input.Search style={{ marginRight: '10px' }} placeholder="Search by Client Name" />
                      </div>
                      {/* Filter by Country  onChange={handleCountrySearch}  */}
                      <div>
                        {/* <Input.Search placeholder="Search by Country" /> */}
                        {/* <Form.Item> */}
                        {/* <Col span={12}>
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
        </Col> */}
                        {/* </Form.Item> */}
                        {/* <input type="text" id="searchInput" onkeyup="filterDropdown()" placeholder="Search Country..." />
                        <select id="dropdown">
                          <option value="">Select Country</option>
                          {
                            country_list.map((item, index) => {
                              return (
                                <option key={index} value={item.id}>{item.name}</option>
                              )
                            })
                          }
                        </select> */}
                        <Select
                          showSearch
                          placeholder="Select country"
                          optionFilterProp="children"
                          onChange={onChange}
                          onSearch={onSearch}
                          filterOption={filterOption}
                          onChange={handleCountrySearch}
                        >
                          {countryList.map((country) => (
                            <Option key={country.value} value={country.value}>
                              {country.label}
                            </Option>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <Input.Search />
                      </div>
                    </div>
                    {/* table */}
                    <Table columns={columnProposalReceivedPT} loading={loader} dataSource={alldata} rowKey='proposal_id' pagination={pagination} onChange={handleTableChange} />
                  </div>
                </div>
              </div>
              {/* <CustomTable columns={columnProposalReceivedPT} loading={loader} dataSource={alldata} rowKey='proposal_id'  pagination={pagination} onChange={handleTableChange} /> */}
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
                    <div className="d-flex justify-content-between align-items-center p-2 bg-white border-0 shadow-sm rounded-top-3">
                      {/* Date Range Picker */}
                      <div>
                        <DatePicker onChange={handleFromDateChange} placeholder="From Date" style={{ marginRight: '10px' }} format={dateFormat} />
                        <DatePicker onChange={handleToDateChange} placeholder="To Date" format={dateFormat} />
                        <Button onClick={handleSearchByDateRange}>Search</Button>
                        {/* <FontAwesomeIcon icon={faMagnifyingGlass} size='2xl'/>  */}
                      </div>
                      <div>
                        <Input.Search />
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
                    <div className="d-flex justify-content-between align-items-center p-2 bg-white border-0 shadow-sm rounded-top-3">
                      {/* Date Range Picker */}
                      <div>
                        <DatePicker onChange={handleFromDateChange} placeholder="From Date" style={{ marginRight: '10px' }} format={dateFormat} />
                        <DatePicker onChange={handleToDateChange} placeholder="To Date" format={dateFormat} />
                        <Button onClick={handleSearchByDateRange}>Search</Button>
                        {/* <FontAwesomeIcon icon={faMagnifyingGlass} size='2xl'/>  */}
                      </div>
                      <div>
                        <Input.Search />
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
                    <div className="d-flex justify-content-between align-items-center p-2 bg-white border-0 shadow-sm rounded-top-3">
                      {/* Date Range Picker */}
                      <div>
                        <DatePicker onChange={handleFromDateChange} placeholder="From Date" style={{ marginRight: '10px' }} format={dateFormat} />
                        <DatePicker onChange={handleToDateChange} placeholder="To Date" format={dateFormat} />
                        <Button onClick={handleSearchByDateRange}>Search</Button>
                        {/* <FontAwesomeIcon icon={faMagnifyingGlass} size='2xl'/>  */}
                      </div>
                      <div>
                        <Input.Search />
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
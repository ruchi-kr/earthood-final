import { Input, Table, Tabs, DatePicker, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment'; 
// import CustomTable from '../Components/CustomTable';
import { faFileSignature, faFileArrowDown, faFileCircleCheck, faFileCircleQuestion,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { API_HEADER, getDashboardData, getAllProposals } from '../config';
import axios from 'axios';
import { toast } from 'react-toastify';
import viewicon from '../assets/viewicon.png';

export default function TDash() {
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
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Contact Person</span>,
      dataIndex: 'contact_person',
    },
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
      render: () => <a>
        <div className="dropdown-center dropend">
          <button className="btn btn-sm btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Action
          </button>
          <ul className="dropdown-menu z-3 position-absolute">
            <li><a className="dropdown-item" href="#">Clarification Required</a></li>
            <li><a className="dropdown-item" href="#">Approve</a></li>
          </ul>
        </div>
      </a>,
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
          <span className='font14px fw-bold'>{record.created_at.slice(0, 10)}</span>
        );
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Action taken Date</span>,
      render: (text, record) => {
        return (
          <span className='font14px fw-bold'>{record.updated_at.slice(0, 10)}</span>
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
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Contact Person</span>,
      dataIndex: 'contact_person',
    },
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
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Contact Person</span>,
      dataIndex: 'contact_person',
    },
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
        <div className="row">
          <Tabs defaultActiveKey='1' centered activeKey={activeKey} onChange={handleTabChange}>

            <Tabs.TabPane
              tab={
                <div className='border-1 borderlightgreen bg-white rounded-2 p-2 m-5 text-center tabactivecolor  tab_dashboard_size'>
                  <FontAwesomeIcon icon={faFileArrowDown} size="2xl" className='iconcolor' />
                  <p className='font14px textlightgreen text-capitalize mt-4'>proposal received from PT</p>
                  <p className='textcolorblue' style={{ fontSize: '35px' }}>{proposal_received_pt}</p>
                </div>
              }
              key='1'>

              <div className='container-fluid'>
                <div className="row mx-0">
                  <div className="col-12 border-2 border border-light-subtle p-0 rounded-3">
                    <div className="d-flex justify-content-between align-items-center p-2 bg-white border-0 shadow-sm rounded-top-3">
                      {/* Date Range Picker */}
                      <div>
                        <DatePicker onChange={handleFromDateChange} placeholder="From Date" style={{ marginRight: '10px' }} format={dateFormat}/>
                        <DatePicker onChange={handleToDateChange} placeholder="To Date" format={dateFormat}/>
                        <Button onClick={handleSearchByDateRange}>Search</Button>
                        {/* <FontAwesomeIcon icon={faMagnifyingGlass} size='2xl'/>  */}
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
                        <DatePicker onChange={handleFromDateChange} placeholder="From Date" style={{ marginRight: '10px' }} format={dateFormat}/>
                        <DatePicker onChange={handleToDateChange} placeholder="To Date" format={dateFormat}/>
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
                        <DatePicker onChange={handleFromDateChange} placeholder="From Date" style={{ marginRight: '10px' }} format={dateFormat}/>
                        <DatePicker onChange={handleToDateChange} placeholder="To Date" format={dateFormat}/>
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
                        <DatePicker onChange={handleFromDateChange} placeholder="From Date" style={{ marginRight: '10px' }} format={dateFormat}/>
                        <DatePicker onChange={handleToDateChange} placeholder="To Date" format={dateFormat}/>
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

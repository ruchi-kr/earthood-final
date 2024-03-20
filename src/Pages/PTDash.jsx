import { Input, Table, Tabs, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
// import groupicon from '../assets/Group 4.png'
import axios from 'axios';
import { API_HEADER, getDashboardData, getAllClients, getAllProposals } from '../config';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { faFileCircleQuestion, faFileCircleCheck, faFileArrowDown, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function PTDash({ callApi, openClientEdit }) {

  let [totalclients, setTotalClients] = useState(0);
  let [status0, setStatus0] = useState(0);
  let [status1, setStatus1] = useState(0);
  let [status3, setStatus3] = useState(0);
  let [status6, setStatus6] = useState(0);

  let [clientData, setClientData] = useState([]);
  let [proposalList, setProposalList] = useState([]);
  let [proposal_status, setProposalStatus] = useState(0);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [pagination1, setPagination1] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  let [clientLoad, SetClientLoad] = useState(false);
  let [proposalLoad, SetProposalLoad] = useState(false);

  const getDashData = async () => {

    try {

      const result = await axios.get(`${getDashboardData}`,
        API_HEADER);
      const dashboard = result.data.dashboard;

      setTotalClients(dashboard.total_clients);
      setStatus0(dashboard.status0);
      setStatus1(dashboard.status1);
      setStatus3(dashboard.status3);
      setStatus6(dashboard.status6);


    } catch (error) {
      console.log(error)
    }

  }

  const getClientTabData = async () => {

    try {
      const response = await axios.get(`${getAllClients}`,
        {
          params: {
            page: pagination.current,
            limit: pagination.pageSize,
          },
          ...API_HEADER
        });
      setClientData(response.data.data);

      setPagination(prevPagination => ({
        ...prevPagination,
        total: response.data.count,
      }));

      SetClientLoad(false);

    }
    catch (error) {
      console.log(error)
    }

  }

  const getProposalListData = async () => {

    try {

      let payload = {
        status: proposal_status,
        page: pagination1.current,
        limit: pagination1.pageSize
      }
      const response = await axios.post(`${getAllProposals}`, payload, API_HEADER);
      setProposalList(response.data.data);

      setPagination1(prevPagination => ({
        ...prevPagination,
        total: response.data.count,
      }));

      SetProposalLoad(false);

    }
    catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    getDashData();
  }, [callApi])

  const [activeKey, setActiveKey] = useState('1');

  const handleTabChange = (key) => {
    setActiveKey(key)

    setPagination(prevPagination => ({
      ...prevPagination,
      current: 1,
    }));

    setPagination1(prevPagination => ({
      ...prevPagination,
      current: 1,
    }));

    if (key == 1) {
      SetClientLoad(true);
    }
    else if (key == 2) {
      setProposalStatus(0);
      SetProposalLoad(true);
    }
    else if (key == 3) {
      setProposalStatus(1);
      SetProposalLoad(true);
    } else if (key == 4) {
      setProposalStatus(3);
      SetProposalLoad(true);
    } else if (key == 5) {
      setProposalStatus(6);
      SetProposalLoad(true);
    }

  };

  useEffect(() => {
    getClientTabData();
  }, [clientLoad, callApi])

  useEffect(() => {
    getProposalListData();
  }, [proposalLoad])

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    SetClientLoad(true);
  };

  const handleTableChange1 = (pagination, filters, sorter) => {
    setPagination1(pagination);
    console.log(pagination)
    SetProposalLoad(true);
  };

  const columnsClientListing = [
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>S.No</span>,
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
      render: (text, record, index) => {
        const pageIndex = (pagination.current - 1) * pagination.pageSize;
        return pageIndex + index + 1;
      },
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Client Name</span>,
      render: (text, record) => {
        return (
          <span className='text-capitalize  font14px'>{record.name}</span>
        );
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Contact Person</span>,
      dataIndex: 'contact_person',
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Country</span>,
      render: (text, record) => {
        return (
          <span className='text-capitalize textcolorgreen fw-bold p-2 rounded-4 border-0 bg_lightgreen '>{record.country}</span>
        );
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Continents</span>,
      render: (text, record) => {
        return (
          <span className='text-capitalize textcolorgreen fw-bold p-2 rounded-4 border-0 bg_lightgreen '>{record.continent}</span>
        );
      }
    },
    // {
    //   title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Contact Details</span>,
    //   render: (text, record) => (
    //     <span className='lh-1'>
    //       <p className='textcolorblue'>{record.contact_email}</p>
    //       <p className='textlightgreen'>{record.contact_mobile}</p>
    //     </span>
    //   )
    // },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Status</span>,
      render: (text, record) => {
        let color = record.status === 1 ? "green" : "volcano";
        return (
          <Tag className='px-4 py-2 rounded-5 font12px fw-bold' color={color}>{record.status_msg}</Tag>
        );
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Action</span>,
      dataIndex: '',
      key: 'x',
      fixed: 'right',
      render: (text, record) => <a className=''>
        <EditOutlined style={{ marginRight: '8px', color: 'blue' }} onClick={() => openClientEdit(record.id, 1)} />
        <EyeOutlined style={{ color: 'red' }} onClick={() => openClientEdit(record.id, 2)} />
      </a>,
    },
  ];

  const columnsProposalTeam = [
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>S.No</span>,
      dataIndex: 'proposal_id',
      fixed: 'left',
      width: 80,
      render: (text, record, index) => {
        const pageIndex = (pagination1.current - 1) * pagination1.pageSize;
        return pageIndex + index + 1;
      },
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>EId</span>,
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
      dataIndex: 'client_name',
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
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Continent</span>,
      dataIndex: 'continent',
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
      render: (text, record) => <a className=''>
        <EditOutlined style={{ marginRight: '8px', color: 'blue' }} />
      </a>,
    },
  ];

  return (
    <>

      <div className='container-fluid'>
        <div className="row mx-2">

          <Tabs defaultActiveKey='1' centered activeKey={activeKey} onChange={handleTabChange}>

            <Tabs.TabPane
              tab={
                <div className='border-1 borderlightgreen bg-white rounded-3 p-2 mx-1 text-center tabactivecolor tab_dashboard_size'>
                  <FontAwesomeIcon icon={faUser} size="2xl" className='iconcolor' />
                  <p className='font14px textlightgreen text-capitalize mt-1'>Total Clients</p>
                  <p className='textcolorblue stat_text' >{totalclients}</p>
                </div>
              }
              key='1'>

              <div className='container-fluid'>
                <div className="row mx-0">
                  <div className="col-12 border-2 border border-light-subtle p-0 rounded-3">
                    <div className="d-flex justify-content-end align-items-center p-2 bg-white border-0 shadow-sm rounded-top-3">
                      <div>
                        <Input.Search />
                      </div>
                    </div>
                    <Table columns={columnsClientListing} loading={clientLoad} dataSource={clientData} rowKey='id' pagination={pagination} onChange={handleTableChange} />
                  </div>
                </div>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <div className='border-1 borderlightgreen bg-white rounded-3 p-2 mx-1 text-center tabactivecolor tab_dashboard_size'>
                  <FontAwesomeIcon icon={faFileArrowDown} size="2xl" className='iconcolor' />
                  <p className='font14px textlightgreen text-capitalize text'>Proposal Under Preparation</p>
                  <p className='textcolorblue stat_text'>{status0}</p>
                </div>
              }
              key='2'>

              <div className='container-fluid'>
                <div className="row mx-0">
                  <div className="col-12 border-2 border border-light-subtle p-0 rounded-3">
                    <div className="d-flex justify-content-end align-items-center p-2 bg-white border-0 shadow-sm rounded-top-3">
                      {/* <div> */}
                        {/* Filter by Client Name */}
                        {/* <div>
                          <Input.Search style={{ marginRight: '10px' }} placeholder="Search by Client Name" onChange={handleClientNameSearch} />
                        </div> */}
                        {/* Filter by Country */}
                        {/* <div>
                          <Input.Search placeholder="Search by Country" onChange={handleCountrySearch} />
                        </div>
                      </div> */}
                      <div>
                        <Input.Search />
                      </div>
                    </div>
                    <Table columns={columnsProposalTeam} loading={proposalLoad} dataSource={proposalList} rowKey='proposal_id' pagination={pagination1} onChange={handleTableChange1} />
                  </div>
                </div>
              </div>

            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <div className='border-1 borderlightgreen bg-white rounded-3 p-2 mx-1 text-center tabactivecolor tab_dashboard_size'>
                  <FontAwesomeIcon icon={faFileArrowDown} size="2xl" className='iconcolor' />
                  <p className='font14px textlightgreen text-capitalize text'>Proposal Under Approval</p>
                  <p className='textcolorblue stat_text'>{status1}</p>
                </div>
              }
              key='3'>

              <div className='container-fluid'>
                <div className="row mx-0">
                  <div className="col-12 border-2 border border-light-subtle p-0 rounded-3">
                    <div className="d-flex justify-content-end align-items-center p-2 bg-white border-0 shadow-sm rounded-top-3">
                      <div>
                        <Input.Search />
                      </div>
                    </div>
                    <Table columns={columnsProposalTeam} loading={proposalLoad} dataSource={proposalList} rowKey='proposal_id' pagination={pagination1} onChange={handleTableChange1} />
                  </div>
                </div>
              </div>

            </Tabs.TabPane>

            <Tabs.TabPane
              tab={
                <div className='border-1 borderlightgreen bg-white rounded-3 p-2 mx-1 text-center tabactivecolor tab_dashboard_size'>
                  <FontAwesomeIcon icon={faFileCircleQuestion} size="2xl" className='iconcolor' />

                  <p className='font14px textlightgreen text-capitalize'>Proposal Under Modification</p>
                  <p className='textcolorblue stat_text' >{status3}</p>

                </div>
              }
              key='4'>

              <div className='container-fluid'>
                <div className="row mx-0">
                  <div className="col-12 border-2 border border-light-subtle p-0 rounded-3">
                    <div className="d-flex justify-content-end align-items-center p-2 bg-white border-0 shadow-sm rounded-top-3">
                      <div>
                        <Input.Search />
                      </div>
                    </div>
                    <Table columns={columnsProposalTeam} loading={proposalLoad} dataSource={proposalList} rowKey='proposal_id' pagination={pagination1} onChange={handleTableChange1} />
                  </div>
                </div>
              </div>

            </Tabs.TabPane>

            <Tabs.TabPane
              tab={
                <div className='border-1 borderlightgreen bg-white rounded-3 p-2 mx-1 text-center tabactivecolor tab_dashboard_size'>
                  <FontAwesomeIcon icon={faFileCircleCheck} size="2xl" className='iconcolor' />
                  <p className='font14px textlightgreen text-capitalize'>Proposal Submitted to Sales</p>
                  <p className='textcolorblue stat_text' >{status6}</p>
                </div>
              }
              key='5'>

              <div className='container-fluid'>
                <div className="row mx-0">
                  <div className="col-12 border-2 border border-light-subtle p-0 rounded-3">
                    <div className="d-flex justify-content-end align-items-center p-2 bg-white border-0 shadow-sm rounded-top-3">
                      <div>
                        <Input.Search />
                      </div>
                    </div>
                    <Table columns={columnsProposalTeam} loading={proposalLoad} dataSource={proposalList} rowKey='proposal_id' pagination={pagination1} onChange={handleTableChange1} />
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

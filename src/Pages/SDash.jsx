import { Input, Table, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import {faFileCircleQuestion,faFileCircleCheck,faFileArrowDown} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { API_HEADER, getDashboardData  ,getAllProposals } from '../config';
import axios from 'axios';
import { toast } from 'react-toastify';
import viewicon from '../assets/viewicon.png';

export default function SDash() {

  const [proposal_received_pt, setProposal_received_pt] = useState(0)
  const [proposal_sent_client, setProposal_sent_client] = useState(0)
  const [signed_contract, setSigned_contract] = useState(0)
  let [loader,Setloader]=useState(false);

  const [statuskey, setStatus] = useState(6);
  const [alldata, setAlldata] = useState([]);

  const [activeKey, setActiveKey] = useState('1'); 
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const getDashData=async()=>{
    
    try {

    const result=await axios.get(`${getDashboardData}`,
    API_HEADER);
    const dashboard=result.data.dashboard;

    setProposal_received_pt(dashboard.status6);
    setProposal_sent_client(dashboard.status7);
    setSigned_contract(dashboard.status8);    

  } catch (error) {
    console.log(error)
  }

  }

  const allData=async()=>{
     try {
      let payload={
        status:statuskey,
        page:pagination.current,
        limit:pagination.pageSize
      }
      const response=await axios.post(`${getAllProposals}`,payload,API_HEADER);
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

  const handleTabChange = (key) => {
    
    setActiveKey(key)
  
    setPagination(prevPagination => ({
      ...prevPagination,
      current:1,
    }));
  
    if (key == 1) {
        setStatus(6)
    }
    else if (key == 2) {
        setStatus(7)
    }
    else if (key == 3) {
        setStatus(8)
    }
    Setloader(true);
  
    };

  useEffect(() => {
    console.log("useEffect triggered with status:", statuskey);
    allData();
  }, [loader]);

  useEffect(()=>{
    getDashData()
  },[])
  
  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    Setloader(true);
  };

  const columnProposalReceivedPT = [
    {
        title: 'S.No',
        dataIndex: 'id',
        fixed: 'left',
        width: 80,
        render: (id, record, index) => { 
          const pageIndex = (pagination.current - 1) * pagination.pageSize; 
          return pageIndex + index + 1;
        },
    },
    {
        title: 'Proposal Recd.Date',
        render: (text, record) => {
          return (
              <span className='font14px fw-bold'>{record.created_at.slice(0, 10)}</span>
          );
      }
    },
    {
        title: 'EID',
        fixed: 'left',
        dataIndex: 'earthood_id',
    },
    {
        title: 'Project Name',
        render: (text, record) => {
            return (
                <span className='text-capitalize textcolor font14px fw-bold'>{record.project_name}</span>
            );
        }
    },
    {
        title: 'Client Name',
        render: (text, record) => {
            return (
                <span className='text-capitalize textcolor font14px fw-bold'>{record.client_name}</span>
            );
        }
    },
    {
        title: 'Sector',
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
        title: 'Contact Person',
        dataIndex: 'contact_person',
    },
    {
        title: 'Country',
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
        title: 'Action',
        dataIndex: '',
        key: 'x',
        fixed: 'right',
        render: () => <a className='d-flex'><img src={viewicon} alt="view icon" />&nbsp;<button className='btn btn-success'>Send</button></a>,
    },
];

const columnProposalSent = [
    {
        title: <span className='text-capitalize textcolumntitle font14px fw-bold'>S.No</span>,
        dataIndex: 'id',
        fixed: 'left',
        width: 80,
        render: (id, record, index) => {   const pageIndex = (pagination.current - 1) * pagination.pageSize; 
          return pageIndex + index + 1; },
    },
    {
        title:  <span className='text-capitalize textcolumntitle font14px fw-bold'>Submission Date</span>,
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
        title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Contract signing Date</span>,
        render: (text, record) => {
          return (
              <span className='font14px fw-bold'>{record.created_at.slice(0, 10)}</span>
          );
      }
    },
    {
        title: <span className='text-capitalize textcolumntitle font14px fw-bold'>uploading Date</span>,
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
              return null; // If no country, return nothing
            }
          },
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
              return null; // If no country, return nothing
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
    <div className="row mx-5">
    <Tabs defaultActiveKey='1' centered activeKey={activeKey} onChange={handleTabChange}>

      <Tabs.TabPane 
      tab={
        <div className='border-1 borderlightgreen bg-white rounded-2 p-2 m-3 text-center tabactivecolor  tab_dashboard_size'>
            <FontAwesomeIcon icon={faFileArrowDown} size="2xl" className='iconcolor' />
            <p className='font14px textlightgreen text-capitalize mt-4'>Proposal received</p>
            <p className='textcolorblue' style={{ fontSize: '35px' }}>{proposal_received_pt}</p>
        </div>
      }
      key='1'>

        <div className='container-fluid'>
       <div className="row mx-3">
        <div className="col-12 border-2 border border-light-subtle p-0 rounded-3">
          <div className="d-flex justify-content-end align-items-center p-2 bg-white border-0 shadow-sm rounded-top-3">
            <div>
              <Input.Search/>
            </div>
          </div>
          <Table columns={columnProposalReceivedPT} loading={loader} dataSource={alldata} rowKey='proposal_id'  pagination={pagination} onChange={handleTableChange} />
        </div>
      </div>
      </div>
      </Tabs.TabPane>

      <Tabs.TabPane
      tab={
        <div className='border-1 borderlightgreen bg-white rounded-2 p-2 m-3 text-center tabactivecolor  tab_dashboard_size'>
            <FontAwesomeIcon icon={faFileCircleQuestion} size="2xl" className='iconcolor' />
            <p className='font14px textlightgreen text-capitalize mt-4'>Proposal sent to Client</p>
            <p className='textcolorblue' style={{ fontSize: '35px' }}>{proposal_sent_client}</p>

        </div>
    }
      key='2'>
      
      <div className='container-fluid'>
       <div className="row mx-3">
        <div className="col-12 border-2 border border-light-subtle p-0 rounded-3">
          <div className="d-flex justify-content-end align-items-center p-2 bg-white border-0 shadow-sm rounded-top-3">
            <div>
              <Input.Search />
            </div>
          </div>
          <Table columns={columnProposalSent} loading={loader} dataSource={alldata} rowKey='proposal_id'  pagination={pagination} onChange={handleTableChange} />
        </div>
      </div>
      </div>

      </Tabs.TabPane>

      <Tabs.TabPane
     tab={
      <div className='border-1 borderlightgreen bg-white rounded-2 p-2 m-3 text-center tabactivecolor tab_dashboard_size'>
          <FontAwesomeIcon icon={faFileCircleCheck} size="2xl" className='iconcolor' />
          <p className='font14px textlightgreen text-capitalize mt-4'>Signed contract</p>
          <p className='textcolorblue' style={{ fontSize: '35px' }}>{signed_contract}</p>
      </div>
     }
      key='3'>

      <div className='container-fluid'>
       <div className="row mx-3">
        <div className="col-12 border-2 border border-light-subtle p-0 rounded-3">
          <div className="d-flex justify-content-end align-items-center p-2 bg-white border-0 shadow-sm rounded-top-3">
            <div>
              <Input.Search />
            </div>
          </div>
          <Table columns={columnSignedContract} loading={loader} dataSource={alldata} rowKey='proposal_id'  pagination={pagination} onChange={handleTableChange} />
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

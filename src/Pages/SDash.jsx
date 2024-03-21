import { Input, Table, Tabs, DatePicker, Button, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { faFileCircleQuestion, faFileCircleCheck, faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { API_HEADER, getDashboardData, getAllProposals, getCountryList, get_client_name_url, get_sectoralscope_url } from '../config';
import axios from 'axios';
import { toast } from 'react-toastify';
import viewicon from '../assets/viewicon.png';
const { Option } = Select;

export default function SDash() {

  const [proposal_received_pt, setProposal_received_pt] = useState(0)
  const [proposal_under_nego, setProposal_under_nego] = useState(0)
  // const [proposal_sent_client, setProposal_sent_client] = useState(0)
  const [signed_contract, setSigned_contract] = useState(0)
  let [loader, Setloader] = useState(false);

  const [statuskey, setStatus] = useState(6);
  const [alldata, setAlldata] = useState([]);

  const [activeKey, setActiveKey] = useState('1');
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

      setProposal_received_pt(dashboard.status6);
      setProposal_under_nego(dashboard.status7);
      // setProposal_sent_client(dashboard.status7);
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
        country: country ? country : null,
        client_id: client_id ? client_id : null,
        scope: scope ? scope : null,
        search: search ? search : null
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

  const handleTabChange = (key) => {
    setFromDate(null);
    setToDate(null);
    setCountry(null);
    setClient_id(null);
    setScope(null);
    setSearch(null);

    setActiveKey(key)

    setPagination(prevPagination => ({
      ...prevPagination,
      current: 1,
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
    // else if (key == 4) {
    //   setStatus(8)
    // }
    Setloader(true);

  };

  useEffect(() => {
    console.log("useEffect triggered with status:", statuskey);
    allData();
  }, [loader]);

  useEffect(() => {
    getDashData()
  }, [])

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    Setloader(true);
  };

  // date range search
  const dateFormat = 'DD/MM/YYYY';
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [country, setCountry] = useState(null);
  const [client_id, setClient_id] = useState(null);
  const [search, setSearch] = useState(null);
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
  const handleClientNameSearch = (value) => {
    setClient_id(value);
    Setloader(true);
  };


  const handleCountrySearch = (value) => {
    // Ensure value is a string before calling toLowerCase
    setCountry(value);
    Setloader(true);
  };
  const handleScopeSearch = (value) => {
    // Ensure value is a string before calling toLowerCase
    setScope(value);
    Setloader(true);
  };

  const handleSearchAll = (value) => {
    setSearch(value);
    Setloader(true);
  }

  const [scope, setScope] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [scopeList, setScopeList] = useState([]);
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
  const getScope = async () => {
    try {
      const result = await axios.get(`${get_sectoralscope_url}`);
      setScopeList(result.data.data);
    } catch (error) {
      // Handle error
      toast.error('Error fetching Scope list')
    }
  };
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  useEffect(() => {

    getCountry();
    getClientname();
    getScope();
  }, []);


  const columnProposalReceivedPT = [
    {
      title: 'S.No',
      dataIndex: 'id',
      fixed: 'left',
      width: 70,
      render: (id, record, index) => {
        const pageIndex = (pagination.current - 1) * pagination.pageSize;
        return pageIndex + index + 1;
      },
    },
    {
      title: 'Proposal Recd.Date',
      width: 150,
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
      title: 'Scope',
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
    //     title: 'Contact Person',
    //     dataIndex: 'contact_person',
    // },
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
      width: 150,
      render: () => <a className='d-flex'><img src={viewicon} alt="view icon" />&nbsp;<button className='btn btn-success'>Send</button></a>,
    },
  ];

  const columnProposalSent = [
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>S.No</span>,
      dataIndex: 'id',
      fixed: 'left',
      width: 70,
      render: (id, record, index) => {
        const pageIndex = (pagination.current - 1) * pagination.pageSize;
        return pageIndex + index + 1;
      },
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Submission Date</span>,
      width: 150,
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
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Scope</span>,
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
    //     title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Contact Person</span>,
    //     dataIndex: 'contact_person',
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
      width: 100,
      render: () => <a><img src={viewicon} alt="view icon" />&nbsp;</a>,
    },
  ];

  const columnSignedContract = [
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>S.No</span>,
      dataIndex: 'id',
      fixed: 'left',
      width: 70,
      render: (id, record, index) => {
        const pageIndex = (pagination.current - 1) * pagination.pageSize;
        return pageIndex + index + 1;
      },

    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Contract signing Date</span>,
      width: 150,
      render: (text, record) => {
        return (
          <span className='font14px fw-bold'>{record.created_at.slice(0, 10)}</span>
        );
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>uploading Date</span>,
      width: 150,
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
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Scope</span>,
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
    // {
    //     title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Contact Person</span>,
    //     dataIndex: 'contact_person',
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
          return null; // If no country, return nothing
        }
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Action</span>,
      dataIndex: '',
      key: 'x',
      fixed: 'right',
      width: 100,
      render: () => <a><img src={viewicon} alt="view icon" />&nbsp;</a>,
    },
  ];

  return (
    <>
      <div className='container-fluid'>
        <div className="row mx-5">
          <div className="col-12">
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
                      <div className="d-flex justify-content-between align-items-center p-2 bg-white border-0 shadow-sm rounded-top-3">
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
                            placeholder="Select Client Name"
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
                            placeholder="Select Country"
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
                        <div className='d-grid mb-3 mx-3'>
                          <label className='text-capitalize textcolumntitle font14px fw-bold'>Scope </label>
                          <Select
                            showSearch
                            allowClear
                            placeholder="Select Scope"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            onChange={handleScopeSearch}
                          >

                            {scopeList.map((scope, index) => (
                              <Option key={index} value={scope.id} label={scope.scope}>
                                {scope.scope}
                              </Option>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <label className='text-capitalize textcolumntitle font14px fw-bold'>Search </label>
                          <Input.Search allowClear onChange={handleSearchAll} placeholder="Search EID, Project Name" />
                        </div>
                      </div>
                      <Table  scroll={{
                          x: 1500,
                        }}  columns={columnProposalReceivedPT} loading={loader} dataSource={alldata} rowKey='proposal_id' pagination={pagination} onChange={handleTableChange} />
                    </div>
                  </div>
                </div>
              </Tabs.TabPane>


              <Tabs.TabPane
                tab={
                  <div className='border-1 borderlightgreen bg-white rounded-2 p-2 m-3 text-center tabactivecolor  tab_dashboard_size'>
                    <FontAwesomeIcon icon={faFileCircleQuestion} size="2xl" className='iconcolor' />
                    <p className='font14px textlightgreen text-capitalize mt-4'>Proposal under negotiation</p>
                    <p className='textcolorblue' style={{ fontSize: '35px' }}>{proposal_under_nego}</p>

                  </div>
                }
                key='2'>

                <div className='container-fluid'>
                  <div className="row mx-3">
                    <div className="col-12 border-2 border border-light-subtle p-0 rounded-3">
                      <div className="d-flex justify-content-between align-items-center p-2 bg-white border-0 shadow-sm rounded-top-3">
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
                            placeholder="Select Client Name"
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
                            placeholder="Select Country"
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
                        <div className='d-grid mb-3 mx-3'>
                          <label className='text-capitalize textcolumntitle font14px fw-bold'>Scope </label>
                          <Select
                            showSearch
                            allowClear
                            placeholder="Select Scope"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            onChange={handleScopeSearch}
                          >

                            {scopeList.map((scope, index) => (
                              <Option key={index} value={scope.id} label={scope.scope}>
                                {scope.scope}
                              </Option>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <label className='text-capitalize textcolumntitle font14px fw-bold'>Search </label>
                          <Input.Search allowClear onChange={handleSearchAll} placeholder="Search EID, Project Name" />
                        </div>
                      </div>
                      <Table  scroll={{
                          x: 1500,
                        }} columns={columnProposalSent} loading={loader} dataSource={alldata} rowKey='proposal_id' pagination={pagination} onChange={handleTableChange} />
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
                      <div className="d-flex justify-content-between align-items-center p-2 bg-white border-0 shadow-sm rounded-top-3">
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
                            placeholder="Select Client Name"
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
                            placeholder="Select Country"
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
                        <div className='d-grid mb-3 mx-3'>
                          <label className='text-capitalize textcolumntitle font14px fw-bold'>Scope </label>
                          <Select
                            showSearch
                            allowClear
                            placeholder="Select Scope"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            onChange={handleScopeSearch}
                          >

                            {scopeList.map((scope, index) => (
                              <Option key={index} value={scope.id} label={scope.scope}>
                                {scope.scope}
                              </Option>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <label className='text-capitalize textcolumntitle font14px fw-bold'>Search </label>
                          <Input.Search allowClear onChange={handleSearchAll} placeholder="Search EID, Project Name" />
                        </div>
                      </div>
                      <Table  scroll={{
                          x: 1500,
                        }} columns={columnSignedContract} loading={loader} dataSource={alldata} rowKey='proposal_id' pagination={pagination} onChange={handleTableChange} />
                    </div>
                  </div>
                </div>

              </Tabs.TabPane>

            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}

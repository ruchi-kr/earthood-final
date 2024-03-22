import { Input, Table, Tabs, Tag, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
// import groupicon from '../assets/Group 4.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { get_proposal_detail_url } from '../config';
import { API_HEADER, getDashboardData, getAllClients, getAllProposals, getCountryList, get_client_name_url, get_regions_url, get_scope_url } from '../config';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import Header from './Header';
import { faFileCircleQuestion, faFileCircleCheck, faFileArrowDown, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const { Option } = Select;
export default function PTDash({ callApi, openClientEdit }) {

  let [totalclients, setTotalClients] = useState(0);
  let [status0, setStatus0] = useState(0);
  let [status1, setStatus1] = useState(0);
  let [status3, setStatus3] = useState(0);
  let [status6, setStatus6] = useState(0);

  let [clientData, setClientData] = useState([]);
  let [proposalList, setProposalList] = useState([]);
  let [proposal_status, setProposalStatus] = useState(0);

  const [searchedText, setSearchedText] = useState("");
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
            country: country ? country : null,
            client_id: client_id ? client_id : null,
            region: region ? region : null,

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
        limit: pagination1.pageSize,
        country: country ? country : null,
        client_id: client_id ? client_id : null,
        region: region ? region : null,
        scope: scope ? scope : null
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
  const [country, setCountry] = useState(null);
  const [region, setRegion] = useState(null);
  const [scope, setScope] = useState(null);
  const [client_id, setClient_id] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [regionList, setRegionList] = useState([]);
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
  const getRegion = async () => {
    try {
      const result = await axios.get(`${get_regions_url}`);
      setRegionList(result.data.data);
    } catch (error) {
      // Handle error
      toast.error('Error fetching Region list')
    }
  };
  const getScope = async () => {
    try {
      const result = await axios.get(`${get_scope_url}`);
      setScopeList(result.data.data);
    } catch (error) {
      // Handle error
      toast.error('Error fetching Scope list')
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
    getRegion();
    getScope();
  }, []);
  const handleClientNameSearch = (value) => {
    setClient_id(value);
    SetClientLoad(true);
    SetProposalLoad(true);
  };


  const handleCountrySearch = (value) => {
    // Ensure value is a string before calling toLowerCase
    setCountry(value);
    SetClientLoad(true);
    SetProposalLoad(true);
  };

  const handleRegionSearch = (value) => {
    // Ensure value is a string before calling toLowerCase
    setRegion(value);
    SetProposalLoad(true);
    SetClientLoad(true);
  };
  const handleScopeSearch = (value) => {
    // Ensure value is a string before calling toLowerCase
    setScope(value);
    SetProposalLoad(true);
    SetClientLoad(true);
  };


  const columnsClientListing = [
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>S.No</span>,
      dataIndex: 'id',
      fixed: 'left',
      width: 70,
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
      },
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.countryList)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.regionList)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.clientName).toLowerCase().includes(value.toLowerCase()) ||
          String(record.Action).toLowerCase().includes(value.toLowerCase()) ||
          String(record.ContactPerson).toLowerCase().includes(value.toLowerCase())
        );
      },

    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Contact Person</span>,
      dataIndex: 'contact_person',
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Regions</span>,
      render: (text, record) => {
        if (record.region) {
          return (
            <span className='text-capitalize textcolorgreen fw-bold p-2 rounded-4 border-0 bg_lightgreen'>
              {record.region}
            </span>
          );
        } else {
          return null;
        }
      }
    },
    {
      title: <span className='text-capitalize textcolumntitle font14px fw-bold'>Country</span>,
      render: (text, record) => {
        return (
          <span className='text-capitalize textcolorgreen fw-bold p-2 rounded-4 border-0 bg_lightgreen '>{record.country}</span>
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
      width: 100,
      render: (text, record) => <a className=''>
        <EditOutlined style={{ marginRight: '8px', color: 'blue' }} onClick={() => openClientEdit(record.id, 1)} />
        <EyeOutlined style={{ color: 'red' }} onClick={() => openClientEdit(record.id, 2)} />
      </a>,
    },
  ];


  return (
    <>
      <Header />
      <div className='container-fluid' style={{ backgroundColor: "#F8F9F9 ", }}>
        <div className="row mx-2">
          <div className="col-12">
            <div className='container-fluid' >
              <h4 style={{ textAlign: 'center', margin: '10px' }}>All Clients</h4>
              <div className="row mx-0">
                <div className="col-12 border-2 border border-light-subtle p-0 rounded-3">
                  <div className="d-flex justify-content-between align-items-center py-4 px-0 bg-white border-0 shadow-sm rounded-top-3">
                    {/* Date Range Picker */}

                 
                    {/* Filter by Client Name onChange={handleClientNameSearch}*/}
                    <div className='d-flex mx-3'>
                      <div className='d-grid mb-3 mx-3'>
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
                      <div className='d-grid mb-3 mx-3'>
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
                      {/* Filter by Country  onChange={handleCountrySearch}  */}
                      <div className='d-grid mb-3 mx-3'>
                        <label className='text-capitalize textcolumntitle font14px fw-bold'>Region </label>
                        <Select
                          showSearch
                          allowClear
                          placeholder="Select region"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          onChange={handleRegionSearch}
                        >

                          {regionList.map((region, index) => (
                            <Option key={index} value={region.id} label={region.name}>
                              {region.name}
                            </Option>
                          ))}
                        </Select>
                      </div>

                    </div>
                    <div>
                      <Input.Search
                        placeholder="input search text"
                        enterButton
                        size="large"
                        onSearch={(value) => setSearchedText(value)}
                        onChange={(e) => setSearchedText(e.target.value)}
                        // style={{
                        //   width: "1000px",
                        //   marginTop: "30px",
                        //   marginLeft: "300px",
                        //   marginBottom: "10px",
                        // }}
                      />
                    </div>
                    {/* <div className='d-grid mb-3 me-3'>
                      <label className='text-capitalize textcolumntitle font14px fw-bold'>Search </label>
                      <Input.Search allowClear />
                    </div> */}
                    {/* <Button className='mx-2' onClick={handleSearchByDateRange}>Search</Button> */}

                  </div>
                  <Table scroll={{ x: 1500 }} columns={columnsClientListing} loading={clientLoad} dataSource={clientData} rowKey='id' pagination={pagination} onChange={handleTableChange} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </>
  )
}
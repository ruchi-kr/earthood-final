import React, { useState, useEffect } from "react";
import {FileUploader} from "react-drag-drop-files"
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Tabs, Select, Upload, message, Input } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import {
  API_HEADER,
  BASE_DOCUMENT,
  get_client_name_url,
} from "../config";
import { get_scope_url } from "../config";
import { get_sectoralscope_url } from "../config";
import { get_program_url } from "../config";
import { get_country_url } from "../config";
import { get_assesment_url } from "../config";
import { toast } from "react-toastify";
import { pt_tm_proposalaction_url, get_pt_forwardToSales_url, get_sales_action_url,pt_proposal_submit_url } from "../config";
import Header from "./Header";
// import EditorBox from '../Components/EditorBox';
const { Dragger } = Upload;
const fileTypes = ["JPG", "PDF", "RAR", "XLS", "XLSX", "DOC", "DOCX", "ZIP"];

const PtActions = () => {
  const { Option } = Select;

  const navigate = useNavigate();

  const designation_id = sessionStorage.getItem("designation_id")
  const [projectid, setProjectId] = useState(null);
  const [clientName, setClientName] = useState([]);
  const [sectoralScope, setSectoralScope] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myscope, setMyScope] = useState([]);
  const [program, setProgram] = useState([]);
  const [country, setCountry] = useState([]);
  const [atlist, setAtList] = useState([]);
  const [f20name, setF20Name] = useState(null);
  const [f21name, setF21Name] = useState(null);
  const [f23name, setF23Name] = useState(null);
  const [coiname, setCoiName] = useState(null);
  const [rfpname, setRfpName] = useState(null);
  const [othername, setOtherName] = useState(null);
  const [action, setAction] = useState("");
  const [remarks, setRemarks] = useState("");
  const [ptremarks, setPtRemarks] = useState("");
  const [stremarks, setStRemarks] = useState("");
  const [contractremarks, setContractRemarks] = useState("");
  const [projectstatus, setProjectstatus] = useState("");
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    project_name: "",
    earthood_id: "",
    client_id: "",
    country: "",
    program: "",
    program_id: "",
    implemented_fees: "",
    created_at: "",
    scope: "",
    scope_pa: "",
    sectoral_scope: "",
    team_leader: "",
    ta_expert: "",
    validator_verifier: "",
    finance_expert: "",
    local_expert: "",
    meth_expert: "",
    trainee_validator: "",
    technical_reviewer: "",
    expert_tr: "",
    sbu_head: "",
  });

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.data) {
      const { data } = location.state;
      setProjectId(data.id);

      if (data.status > 1) {
        setAction(data.tm_action);
        setRemarks(data.tm_remarks);
        setPtRemarks(data.pt_remarks);
        setStRemarks(data.sales_remarks);
        setContractRemarks(data.signed_contract);
        setFile(data.signed_contract);
      }

      setProjectstatus(data.status);
      const scopes = data.scope.split(",").map(Number);

      setFormData({
        project_name: data.project_name,
        earthood_id: data.earthood_id,
        client_id: data.client_id,
        country: data.country,
        program: data.program,
        program_id: data.program_id,
        implemented_fees: data.implemented_fees,
        created_at: data.proposal_date,
        scope: scopes,
        scope_pa: data.scope_pa,
        sectoral_scope: data.sectoral_scope,
        team_leader: data.team_leader,
        ta_expert: data.ta_expert,
        validator_verifier: data.validator_verifier,
        finance_expert: data.finance_expert,
        local_expert: data.local_expert,
        meth_expert: data.meth_expert,
        trainee_validator: data.trainee_validator,
        technical_reviewer: data.technical_reviewer,
        expert_tr: data.expert_tr,
        sbu_head: data.sbu_head,
      });

      let url1 = `${BASE_DOCUMENT}/documents/${data.earthood_id}/${data.f20_doc}`;
      setF20Name(url1);

      let url2 = `${BASE_DOCUMENT}/documents/${data.earthood_id}/${data.f21_doc}`;
      setF21Name(url2);

      let url3 = `${BASE_DOCUMENT}/documents/${data.earthood_id}/${data.f23_doc}`;
      setF23Name(url3);

      let url4 = `${BASE_DOCUMENT}/documents/${data.earthood_id}/${data.coi_doc}`;
      setCoiName(url4);

      let url5 = `${BASE_DOCUMENT}/documents/${data.earthood_id}/${data.rfp_doc}`;
      setRfpName(url5);

      let url6 = `${BASE_DOCUMENT}/documents/${data.earthood_id}/${data.other_doc}`;
      setOtherName(url6);
    }
  }, [location]);

  const CONFIG_Token = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
  };

  const CONFIG_Token2 = {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "multipart/form-data",
    },
  };
  const handlePtRemarksChange = (content) => {
    setPtRemarks(content);
  };
  const handleStRemarksChange = (content) => {
    setStRemarks(content);
  }
  const handleContractRemarksChange = (content) => {
    setContractRemarks(content);
  }
  const handleActionChange = (e) => {
    setAction(e.target.value);
  };

  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };

  const handleSubmitAction = async () => {
    if (action && remarks) {
      try {
        let payload = {
          proposal_id: projectid,
          status: action,
          remarks: remarks,
        };
        const response = await axios.post(
          `${pt_tm_proposalaction_url}`,
          payload,
          API_HEADER
        );
        if (response.status === 200) {
          setAction("");
          setRemarks("");
          toast.success("Action added successfully");
          navigate("/allprojects");
        } else {
          console.error("Failed to submit data");
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(error);
      }
    } else {
      toast.error("All fields are not filled");
    }
  };

  const handleSubmitPtToSales = async () => {
    try {
      let payload = {
        proposal_id: projectid,
        remarks: ptremarks,
      };
      const response = await axios.post(
        `${get_pt_forwardToSales_url}`,
        payload,
        API_HEADER
      );
      if (response.status === 200 && response.data.status == 1) {
        setAction("");
        setPtRemarks("");
        toast.success("Forwarded to Sales successfully");
        navigate("/allprojects");
      } else {
        console.error("Failed to submit data");
        toast.error(response.data.message);
      }
    } catch (error) {

    }
  }
  const handleForwardClient = async () => {
    try {
      let payload = {
        proposal_id: projectid,
        type: 1,
        remarks: stremarks,
      };
      const response = await axios.post(
        `${get_sales_action_url}`,
        payload,
        API_HEADER
      );
      if (response.status === 200 && response.data.status == 1) {
        setAction("");
        setStRemarks("");
        toast.success("Forwarded to Client successfully");
        navigate("/allprojects");
      } else {
        console.error("Failed to submit data");
        toast.error(response.data.message);
      }
    } catch (error) {

    }
  }

  const handleUpload = async (file) => {
    try {
      let payload = {
        proposal_id: projectid,
        type: 2,
        // remarks: contractremarks,
      };
      const response = await axios.post(
        `${get_sales_action_url}`,
        payload,
        API_HEADER
      );
      if (response.status === 200 && response.data.status == 1) {
        message.success("Remarks and file uploaded successfully");
        setProjectId('');
        setContractRemarks('');
      } else {
        message.error("Failed to submit data");
      }
    } catch (error) {
      console.error("Error occurred while posting data: ", error);
      message.error("An error occurred while adding remarks and uploading file");
    }
  };

  const handleSubmitFiles = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("f20_doc", f20name);
      formData.append("f21_doc", f21name);
      formData.append("f23_doc", f23name);
      formData.append("rfp_doc", rfpname);
      formData.append("coi_doc", coiname);
      formData.append("other_doc", othername);

      formData.append("proposal_id", projectid);

      const response = await axios.post(
        `${pt_proposal_submit_url}`,
        formData,
        CONFIG_Token2
      );

      if (!response.data.status) {
        toast.error("Files Do not uploaded");
      } else {
        toast.success("Files Uploaded Successfully");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Files Size must be less than 2 MB");
      console.error("Error uploading file:", error);
    }
  };


  const handleUploadSignedContract = async () => {
    try {
      let payload = {
        proposal_id: projectid,
        type: 2,
        signed_contract:file,
        remarks: contractremarks,
      };
      const response = await axios.post(
        `${get_sales_action_url}`,
        payload,
        API_HEADER
      );
      if (response.status === 200 && response.data.status == 1) {
        setAction("");
        setContractRemarks("");
        toast.success("Remarks added successfully");
        navigate("/allprojects");
      } else {
        console.error("Failed to submit data");
        toast.error(response.data.message);
      }
    } catch (error) {

    }
  }
  const handleMyProjectChange = (event) => {
    setFormData({ ...formData, project_name: event.target.value });
  };

  const handleEarthoodIdChange = (event) => {
    setFormData({ ...formData, earthood_id: event.target.value });
  };

  const handleProgramIdChange = (event) => {
    setFormData({ ...formData, program_id: event.target.value });
  };

  const handleFeesChange = (event) => {
    setFormData({ ...formData, implemented_fees: event.target.value });
  };

  const handleDateChange = (e) => {
    setFormData({ ...formData, created_at: e.target.value });
  };

  const handleApproved = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchDataClientName = async () => {
      try {
        const responseclientname = await axios.get(`${get_client_name_url}`);
        setClientName(responseclientname.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchDataClientName();
  }, []);

  useEffect(() => {
    const fetchDataSectoralScope = async () => {
      try {
        const responsesector = await axios.get(`${get_sectoralscope_url}`);
        setSectoralScope(responsesector.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchDataSectoralScope();
  }, []);

  useEffect(() => {
    const fetchDataScope = async () => {
      try {
        const responsescope = await axios.get(`${get_scope_url}`);

        setMyScope(responsescope.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchDataScope();
  }, []);

  useEffect(() => {
    const fetchDataProgram = async () => {
      try {
        const responseprogram = await axios.get(`${get_program_url}`);
        setProgram(responseprogram.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchDataProgram();
  }, []);

  useEffect(() => {
    const fetchDataCountry = async () => {
      try {
        const responsecountry = await axios.get(`${get_country_url}`);
        setCountry(responsecountry.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchDataCountry();
  }, []);

  useEffect(() => {
    const fetchDataTechnicalReviewer = async () => {
      try {
        const responseteamleader = await axios.get(`${get_assesment_url}`);
        setAtList(responseteamleader.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchDataTechnicalReviewer();
  }, []);

  const handleFileChange = (file) => {
    setFile(file);
  }

  const handleFileDrop = (file) => {
    setFile(file);
  }

  return (
    <>
      <Header />
      <div className="container-fluid bg-light">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center textcolorblue fw-bolder p-2 text-capitalize bg-light">
              project details
            </h2>
            <Tabs
              defaultActiveKey="1"
              centered
              indicator={{ Backgroundcolor: "#07B6AF" }}
              size="large"
            >
                <Tabs.TabPane
                tab={
                  <div className="border-0 shadow-lg textlightgreen rounded-0 px-5 py-2 text-center">
                    <p>Project Details</p>
                  </div>
                }
                key="1"
              >

                {
                  ( projectstatus==4||projectstatus==3||projectstatus==1) && designation_id ==6?
                  <form>
                  <div className="col-10 border-0 bg-white shadow-sm p-5 mx-auto">
                    <div className="row">
                      <div className="col-4 mb-3">
                        <label htmlFor="projectname" className="form-label">
                          Project Name<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control borderlightgreen"
                          id="project_name"
                          placeholder="Project Name"
                          required
                          name="project_name"
                          value={formData.project_name}
                          onChange={handleMyProjectChange}
                          
                        />
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="eid" className="form-label">
                          Earthood Id<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control borderlightgreen"
                          id="earthood_id"
                          placeholder="Earthood Id"
                          name="earthood_id"
                          required
                          value={formData.earthood_id}
                          onChange={handleEarthoodIdChange}
                          
                        />
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="clientname" className="form-label">
                          Client Name<span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="client_id"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="client_id"
                            value={formData.client_id}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                client_id: e.target.value,
                              })
                            }
                          
                          >
                            <option selected value={""}>
                              Select
                            </option>
                            {clientName.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                    { }
                    <div className="row">
                      <div className="col-4 mb-3">
                        <label
                          htmlFor="country"
                          className="form-label"
                          required
                        >
                          Country<span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="country"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="country"
                            value={formData.country}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                country: e.target.value,
                              })
                            }
                            
                          >
                            <option selected value={""}>
                              Select
                            </option>
                            {country.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="Program" className="form-label">
                          Program<span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="program"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="program"
                            value={formData.program}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                program: e.target.value,
                              })
                            }
                            
                          >
                            <option selected value={""}>
                              Select
                            </option>
                            {program.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.program_name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="Program Id" className="form-label">
                          Program Id<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="program_id"
                          placeholder="Program Id"
                          required
                          name="program_id"
                          className="form-control borderlightgreen"
                          value={formData.program_id}
                          onChange={handleProgramIdChange}
                          
                        />
                      </div>
                    </div>
                    { }
                    <div className="row">
                      <div className="col-4 mb-3">
                        <label htmlFor="Implementation Fees" className="form-label">
                          Implementation Fees
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control borderlightgreen"
                          id="implemented_fees"
                          placeholder="Implementation Fees"
                          required
                          name="implemented_fees"
                          value={formData.implemented_fees}
                          onChange={handleFeesChange}
                          
                        />
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="Proposal Date" className="form-label">
                          Proposal Date<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control borderlightgreen"
                          id="proposaldate"
                          required
                          name="created_at"
                          value={formData.created_at}
                          onChange={handleDateChange}
                          
                        />
                      </div>

                      <div className="col-4 mb-3">
                        <label htmlFor="Scope" className="form-label">
                          Scope<span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            placeholder="Select"
                            value={formData.scope}
                            allowClear
                           
                            onChange={(selectedValues) =>
                              setFormData({
                                ...formData,
                                scope: selectedValues,
                              })
                            }
                          >
                            {myscope.map((option) => (
                              <Option key={option.id} value={option.id}>
                                {option.sector_name}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </div>
                    </div>

                    { }
                    <div className="row">
                      <div className="col-4 mb-3">
                        <label htmlFor="Scope(PO/POA)" className="form-label">
                          Scope(PO/POA)<span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          id="scope_pa"
                          className="form-select borderlightgreen form-select-sm"
                          aria-label="Default select example"
                          name="scope_pa"
                          value={formData.scope_pa}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              scope_pa: e.target.value,
                            })
                          }
                          
                        >
                          <option selected>Select</option>
                          <option value={1}>PO</option>
                          <option value={2}>POA</option>
                        </select>
                      </div>
                      <div className="col-4 mb-3">
                        <div>
                          <label htmlFor="Sectoral Scope" className="form-label">
                            Sectoral Scope
                            <span style={{ color: "red" }}>*</span>
                          </label>

                          {loading ? (
                            <p>Loading...</p>
                          ) : (
                            <select
                              id="sectoral_scope"
                              className="form-select borderlightgreen form-select-sm"
                              aria-label="Default select example"
                              name="sectoral_scope"
                              value={formData.sectoral_scope}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  sectoral_scope: e.target.value,
                                })
                              }
                             
                            >
                              <option selected value={""}>
                                Select
                              </option>
                              {sectoralScope.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.scope}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                      <div className="col-4 mb-3">
                        <div>
                          <label htmlFor="Sectoral Scope" className="form-label">
                            SBU Head<span style={{ color: "red" }}>*</span>
                          </label>

                          {loading ? (
                            <p>Loading...</p>
                          ) : (
                            <select
                              id="sbu_head"
                              className="form-select borderlightgreen form-select-sm"
                              aria-label="Default select example"
                              name="sbu_head"
                              required
                              value={formData.sbu_head}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  sbu_head: e.target.value,
                                })
                              }
                             
                            >
                              <option selected value={""}>
                                Select
                              </option>
                              {atlist
                                .filter((option) => option.designation_id === 9)
                                .map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.name}
                                  </option>
                                ))}
                            </select>
                          )}
                        </div>
                      </div>
                    </div>

                    { }
                    <p className="textlightgreen fw-bold m-3">
                      Assessment Team
                    </p>
                    <hr />
                    <div className="row">
                      <div className="col-4 mb-3">
                        <label htmlFor="teamleader" className="form-label">
                          Team Leader<span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="team_leader"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="team_leader"
                            required
                            value={formData.team_leader}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                team_leader: e.target.value,
                              })
                            }
                         
                          >
                            <option selected value={""}>
                              Select 
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 8)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="taexpert" className="form-label">
                          Select TA Expert
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="ta_expert"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="ta_expert"
                            required
                            value={formData.ta_expert}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                ta_expert: e.target.value,
                              })
                            }
                           
                          >
                            <option selected value={""}>
                              Select
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 8)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="validator" className="form-label">
                          Validator
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="validator_verifier"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="validator_verifier"
                            value={formData.validator_verifier}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                validator_verifier: e.target.value,
                              })
                            }
                            
                          >
                            <option selected value={""}>
                              Select 
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 8)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-4 mb-3">
                        <label htmlFor="financeexpert" className="form-label">
                          Finance Expert
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="finance_expert"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="finance_expert"
                            value={formData.finance_expert}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                finance_expert: e.target.value,
                              })
                            }
                           
                          >
                            <option selected value={""}>
                              Select
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 8)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="teamleader" className="form-label">
                          Local Expert<span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="local_expert"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="local_expert"
                            value={formData.local_expert}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                local_expert: e.target.value,
                              })
                            }
                            
                            required
                          >
                            <option selected value={""}>
                              Select
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 8)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="methexpert" className="form-label">
                          Meth Expert
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="meth_expert"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="meth_expert"
                            value={formData.meth_expert}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                meth_expert: e.target.value,
                              })
                            }
                            
                          >
                            <option selected value={""}>
                              Select 
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 8)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-4 mb-3">
                        <label htmlFor="taexpert" className="form-label">
                          Trainee Validator
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="trainee_validator"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="trainee_validator"
                            value={formData.trainee_validator}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                trainee_validator: e.target.value,
                              })
                            }
                           
                          >
                            <option selected value={""}>
                              Select
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 8)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="technicalreviewer" className="form-label">
                          Technical Reviewer
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="technical_reviewer"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="technical_reviewer"
                            required
                            value={formData.technical_reviewer}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                technical_reviewer: e.target.value,
                              })
                            }
                           
                          >
                            <option selected value={""}>
                              Select
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 7)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="technicalreviewer" className="form-label">
                          Expert to Technical Reviewer
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="expert_tr"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="expert_tr"
                            required
                            value={formData.expert_tr}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                expert_tr: e.target.value,
                              })
                            }
                           
                          >
                            <option selected value={""}>
                              Select 
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 7)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
                :(
                  <form>
                  <div className="col-10 border-0 bg-white shadow-sm p-5 mx-auto">
                    <div className="row">
                      <div className="col-4 mb-3">
                        <label htmlFor="projectname" className="form-label">
                          Project Name<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control borderlightgreen"
                          id="project_name"
                          placeholder="Project Name"
                          required
                          name="project_name"
                          value={formData.project_name}
                          onChange={handleMyProjectChange}
                          readOnly
                          disabled
                        />
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="eid" className="form-label">
                          Earthood Id<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control borderlightgreen"
                          id="earthood_id"
                          placeholder="Earthood Id"
                          name="earthood_id"
                          required
                          value={formData.earthood_id}
                          onChange={handleEarthoodIdChange}
                          readOnly
                          disabled
                        />
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="clientname" className="form-label">
                          Client Name<span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="client_id"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="client_id"
                            value={formData.client_id}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                client_id: e.target.value,
                              })
                            }
                            disabled
                          >
                            <option selected value={""}>
                              Select 
                            </option>
                            {clientName.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                    { }
                    <div className="row">
                      <div className="col-4 mb-3">
                        <label
                          htmlFor="country"
                          className="form-label"
                          required
                        >
                          Country<span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="country"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="country"
                            value={formData.country}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                country: e.target.value,
                              })
                            }
                            disabled
                          >
                            <option selected value={""}>
                              Select
                            </option>
                            {country.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="Program" className="form-label">
                          Program<span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="program"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="program"
                            value={formData.program}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                program: e.target.value,
                              })
                            }
                            disabled
                          >
                            <option selected value={""}>
                              Select
                            </option>
                            {program.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.program_name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="Program Id" className="form-label">
                          Program Id<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="program_id"
                          placeholder="Program Id"
                          required
                          name="program_id"
                          className="form-control borderlightgreen"
                          value={formData.program_id}
                          onChange={handleProgramIdChange}
                          readOnly
                          disabled
                        />
                      </div>
                    </div>
                    { }
                    <div className="row">
                      <div className="col-4 mb-3">
                        <label htmlFor="Implementation Fees" className="form-label">
                          Implementation Fees
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control borderlightgreen"
                          id="implemented_fees"
                          placeholder="Implementation Fees"
                          required
                          name="implemented_fees"
                          value={formData.implemented_fees}
                          onChange={handleFeesChange}
                          readOnly
                          disabled
                        />
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="Proposal Date" className="form-label">
                          Proposal Date<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control borderlightgreen"
                          id="proposaldate"
                          required
                          name="created_at"
                          value={formData.created_at}
                          onChange={handleDateChange}
                          readOnly
                          disabled
                        />
                      </div>

                      <div className="col-4 mb-3">
                        <label htmlFor="Scope" className="form-label">
                          Scope<span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            placeholder="Select"
                            value={formData.scope}
                            allowClear
                            disabled
                            onChange={(selectedValues) =>
                              setFormData({
                                ...formData,
                                scope: selectedValues,
                              })
                            }
                          >
                            {myscope.map((option) => (
                              <Option key={option.id} value={option.id}>
                                {option.sector_name}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </div>
                    </div>

                    { }
                    <div className="row">
                      <div className="col-4 mb-3">
                        <label htmlFor="Scope(PO/POA)" className="form-label">
                          Scope(PO/POA)<span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          id="scope_pa"
                          className="form-select borderlightgreen form-select-sm"
                          aria-label="Default select example"
                          name="scope_pa"
                          value={formData.scope_pa}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              scope_pa: e.target.value,
                            })
                          }
                          disabled
                        >
                          <option selected>Select</option>
                          <option value={1}>PO</option>
                          <option value={2}>POA</option>
                        </select>
                      </div>
                      <div className="col-4 mb-3">
                        <div>
                          <label htmlFor="Sectoral Scope" className="form-label">
                            Sectoral Scope
                            <span style={{ color: "red" }}>*</span>
                          </label>

                          {loading ? (
                            <p>Loading...</p>
                          ) : (
                            <select
                              id="sectoral_scope"
                              className="form-select borderlightgreen form-select-sm"
                              aria-label="Default select example"
                              name="sectoral_scope"
                              value={formData.sectoral_scope}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  sectoral_scope: e.target.value,
                                })
                              }
                              disabled
                            >
                              <option selected value={""}>
                                Select
                              </option>
                              {sectoralScope.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.scope}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                      <div className="col-4 mb-3">
                        <div>
                          <label htmlFor="Sectoral Scope" className="form-label">
                            SBU Head<span style={{ color: "red" }}>*</span>
                          </label>

                          {loading ? (
                            <p>Loading...</p>
                          ) : (
                            <select
                              id="sbu_head"
                              className="form-select borderlightgreen form-select-sm"
                              aria-label="Default select example"
                              name="sbu_head"
                              required
                              value={formData.sbu_head}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  sbu_head: e.target.value,
                                })
                              }
                              disabled
                            >
                              <option selected value={""}>
                                Select
                              </option>
                              {atlist
                                .filter((option) => option.designation_id === 9)
                                .map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.name}
                                  </option>
                                ))}
                            </select>
                          )}
                        </div>
                      </div>
                    </div>

                    { }
                    <p className="textlightgreen fw-bold m-3">
                      Assessment Team
                    </p>
                    <hr />
                    <div className="row">
                      <div className="col-4 mb-3">
                        <label htmlFor="teamleader" className="form-label">
                          Team Leader<span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="team_leader"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="team_leader"
                            required
                            value={formData.team_leader}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                team_leader: e.target.value,
                              })
                            }
                            disabled
                          >
                            <option selected value={""}>
                              Select
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 8)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="taexpert" className="form-label">
                          Select TA Expert
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="ta_expert"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="ta_expert"
                            required
                            value={formData.ta_expert}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                ta_expert: e.target.value,
                              })
                            }
                            disabled
                          >
                            <option selected value={""}>
                              Select
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 8)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="validator" className="form-label">
                          Validator
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="validator_verifier"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="validator_verifier"
                            value={formData.validator_verifier}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                validator_verifier: e.target.value,
                              })
                            }
                            disabled
                          >
                            <option selected value={""}>
                              Select
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 8)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-4 mb-3">
                        <label htmlFor="financeexpert" className="form-label">
                          Finance Expert
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="finance_expert"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="finance_expert"
                            value={formData.finance_expert}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                finance_expert: e.target.value,
                              })
                            }
                            disabled
                          >
                            <option selected value={""}>
                              Select 
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 8)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="teamleader" className="form-label">
                          Local Expert<span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="local_expert"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="local_expert"
                            value={formData.local_expert}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                local_expert: e.target.value,
                              })
                            }
                            disabled
                            required
                          >
                            <option selected value={""}>
                              Select
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 8)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="methexpert" className="form-label">
                          Meth Expert
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="meth_expert"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="meth_expert"
                            value={formData.meth_expert}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                meth_expert: e.target.value,
                              })
                            }
                            disabled
                          >
                            <option selected value={""}>
                              Select
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 8)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-4 mb-3">
                        <label htmlFor="taexpert" className="form-label">
                          Trainee Validator
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="trainee_validator"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="trainee_validator"
                            value={formData.trainee_validator}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                trainee_validator: e.target.value,
                              })
                            }
                            disabled
                          >
                            <option selected value={""}>
                              Select
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 8)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="technicalreviewer" className="form-label">
                          Technical Reviewer
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="technical_reviewer"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="technical_reviewer"
                            required
                            value={formData.technical_reviewer}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                technical_reviewer: e.target.value,
                              })
                            }
                            disabled
                          >
                            <option selected value={""}>
                              Select
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 7)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                      <div className="col-4 mb-3">
                        <label htmlFor="technicalreviewer" className="form-label">
                          Expert to Technical Reviewer
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <select
                            id="expert_tr"
                            className="form-select borderlightgreen form-select-sm"
                            aria-label="Default select example"
                            name="expert_tr"
                            required
                            value={formData.expert_tr}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                expert_tr: e.target.value,
                              })
                            }
                            disabled
                          >
                            <option selected value={""}>
                              Select 
                            </option>
                            {atlist
                              .filter((option) => option.designation_id === 7)
                              .map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
                )
                }


                <div className="col-10 border-0 bg-white shadow-sm p-5 mx-auto">
                  {(projectstatus == 1 || projectstatus == 4)&& designation_id==3 ? (
                    <>
                      <div>
                        <label>Actions :</label>
                        <span>
                          <input
                            type="radio"
                            id="approve"
                            name="technical_reviewer"
                            value="1"
                            // checked={action === 1}
                            onChange={handleActionChange}
                            className="mx-3"
                          />
                          <label htmlFor="approve">Approved</label>
                        </span>
                        <span>
                          <input
                            type="radio"
                            id="clarification_required"
                            name="technical_reviewer"
                            value="3"
                            // checked={action === 3}
                            onChange={handleActionChange}
                            className="mx-3"
                          />
                          <label htmlFor="clarification_required">
                            Clarification Required
                          </label>
                        </span>
                      </div>
                      <div class="mt-3 mb-3" style={{ display: "flex" }}>
                        <label>Remarks :</label>
                        <textarea
                          placeholder="Add Remarks"
                          className="form-control"
                          style={{ width: "70%", marginLeft: "10px" }}
                          id="exampleFormControlTextarea1"
                          rows={3}
                          value={remarks}
                          onChange={handleRemarksChange}
                        ></textarea>
                      </div>
                      <button
                        className="btn btn-outline-primary"
                        onClick={handleSubmitAction}
                      >
                        Submit
                      </button>
                    </>
                  ) : (
                    <>
                      <div>
                        <label>Actions :</label>
                        <span>
                          <input
                            type="radio"
                            id="approve"
                            name="technical_reviewer"
                            value="1"
                            checked={action == 1}
                            onChange={handleActionChange}
                            className="mx-3"
                            disabled
                          />
                          <label htmlFor="approve">Approved</label>
                        </span>
                        <span>
                          <input
                            type="radio"
                            id="clarification_required"
                            name="technical_reviewer"
                            value="3"
                            checked={action == 3}
                            onChange={handleActionChange}
                            className="mx-3"
                            disabled
                          />
                          <label htmlFor="clarification_required">
                            Clarification Required
                          </label>
                        </span>
                      </div>
                      <div class="mt-3 mb-3" style={{ display: "flex" }}>
                        <label>Remarks :</label>
                        <textarea
                          placeholder="Add Remarks"
                          className="form-control"
                          style={{ width: "70%", marginLeft: "10px" }}
                          id="exampleFormControlTextarea1"
                          rows={3}
                          value={remarks}
                          onChange={handleRemarksChange}
                          disabled
                        ></textarea>
                      </div>
                      <button
                        className="btn btn-outline-primary"
                        onClick={handleApproved}
                      >
                        Submit
                      </button>
                    </>
                  )}
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <div className="border-0 shadow-lg textlightgreen rounded-0 px-5 py-2 text-center">
                    <p>Attachment</p>
                  </div>
                }
                key="2"
              >
                <div className="col-10 border-0 bg-white shadow-sm p-5 mx-auto">

                  { projectstatus == 3&& designation_id==6 ?
                    <form
                      onSubmit={handleSubmitFiles}
                      method="POST"
                      encType="multipart/form-data"
                    >
                      <table className="table table-bordered table-responsive">
                        <thead>
                          <tr>
                            <th>Document name </th>
                            <th>Select File</th>
                            <th>Uploaded File</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>RFP Document</td>
                            <td>
                              <input class="form-control" type="file" id="formRpf" accept=".jpg,.pdf,.rar,.xls,.xlsx,.doc,.docx,.zip" />

                            </td>
                            <td>
                              <a target="_blank" href={rfpname}>
                                Document Link
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td>F20 Document</td>
                            <td>
                              <input class="form-control" type="file" id="formF20" accept=".jpg,.pdf,.rar,.xls,.xlsx,.doc,.docx,.zip" />

                            </td>
                            <td>
                              <a target="_blank" href={f21name}>
                                Document Link
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td>F21 Document</td>
                            <td>
                              <input class="form-control" type="file" id="formF21" accept=".jpg,.pdf,.rar,.xls,.xlsx,.doc,.docx,.zip" />

                            </td>
                            <td>
                              <a target="_blank" href={f21name}>
                                Document Link
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td>F23 Document</td>
                            <td>
                              <input class="form-control" type="file" id="formF23" accept=".jpg,.pdf,.rar,.xls,.xlsx,.doc,.docx,.zip" />

                            </td>
                            <td>
                              <a target="_blank" href={f23name}>
                                Document Link
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td>COI Document</td>

                            <td>
                              <input class="form-control" type="file" id="formcoi" accept=".jpg,.pdf,.rar,.xls,.xlsx,.doc,.docx,.zip" />

                            </td>
                            <td>
                              <a target="_blank" href={coiname}>
                                Document Link
                              </a>
                            </td>

                          </tr>

                          <tr>
                            <td>Other Documents</td>

                            <td>
                              <input class="form-control" type="file" id="formother" accept=".jpg,.pdf,.rar,.xls,.xlsx,.doc,.docx,.zip" />

                            </td>
                            <td>
                              <a target="_blank" href={othername}>
                                Document Link
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <button
                        style={{ marginLeft: "10px" }}
                        type="submit"
                        className="btn btn-outline-primary"
                      >
                        Save
                      </button>
                    </form>
                    : (
                      <form enctype="multipart/form-data">
                        <table className="table table-bordered table-responsive">
                          <thead>
                            <tr>
                              <th>Document name </th>
                              <th>Uploaded Files</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>RFP Document</td>
                              <td>
                                <a target="_blank" href={rfpname}>
                                  Document Link
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>F20 Document</td>
                              { }
                              <td>
                                <a target="_blank" href={f20name}>
                                  Document Link
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>F21 Document</td>
                              <td>
                                <a target="_blank" href={f21name}>
                                  Document Link
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>F23 Document</td>
                              <td>
                                <a target="_blank" href={f23name}>
                                  Document Link
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>COI Document</td>
                              <td>
                                <a target="_blank" href={coiname}>
                                  Document Link
                                </a>
                              </td>
                            </tr>

                            <tr>
                              <td>Other Document</td>
                              <td>
                                <a target="_blank" href={othername}>
                                  Document Link
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </form>
                    )
                  }

                </div>
              </Tabs.TabPane>
              {/* Sales Action */}
              {designation_id == 5 || designation_id >5 ? (
                <>
                 <Tabs.TabPane
                tab={
                  <div className="border-0 textlightgreen shadow-sm rounded-0 px-5 py-2 text-center">
                    <p>Sales Action</p>
                  </div>
                }
                key="3"
              >
                <div className="col-10 border-0 bg-white p-5 mx-auto">
                  {projectstatus == 5 ? (
                    <>

                      <div class="mt-3 mb-3 d-grid">
                        <label>PT Remarks </label>
                        
                        <ReactQuill
                          theme="snow"
                          value={ptremarks}
                          onChange={handlePtRemarksChange}
                        />
                      </div>
                      <button
                        className="btn btn-outline-primary mt-5"
                        onClick={handleSubmitPtToSales}
                      >
                        Forward to Sales
                      </button>
                    </>
                  ) : (projectstatus == 6 && designation_id == 5) ? (
                    <>
                      <div class="mt-3 mb-3 d-grid">
                        <label>PT Remarks </label>
                        <ReactQuill
                          theme="snow"
                          value={ptremarks}
                          // onChange={handlePtRemarksChange}
                          modules={{ toolbar: false }}
                          readOnly={true}
                          
                          dangerouslySetInnerHTML={{ __html: ptremarks }}
                        />
                        
                      </div>
                      <div class="mt-3 mb-3 d-grid" style={{ display: "flex" }}>
                        <label>Sales Remarks </label>
                      
                        <ReactQuill theme="snow" value={stremarks} onChange={handleStRemarksChange} />
                      </div>
                      <button
                        className="btn btn-outline-primary mt-5"
                        onClick={handleForwardClient}
                      >
                        Forward to Client
                      </button>
                    </>
                  ) : (projectstatus == 6) ? (
                    <>
                      <div class="mt-3 mb-3 d-grid">
                        <label>PT Remarks </label>
                        
                        <ReactQuill
                          theme="snow"
                          value={ptremarks}
                          // onChange={handlePtRemarksChange}
                          modules={{ toolbar: false }}
                          readOnly={true}
                          
                          dangerouslySetInnerHTML={{ __html: ptremarks }}
                        />
                      </div>
                    </>
                  )
                    : (projectstatus == 7 && designation_id == 5) ? (
                      <>
                        <div class="mt-3 mb-3 d-grid">
                          <label>PT Remarks </label>
                          <ReactQuill
                          theme="snow"
                          value={ptremarks}
                          // onChange={handlePtRemarksChange}
                          modules={{ toolbar: false }}
                          readOnly={true}
                          
                          dangerouslySetInnerHTML={{ __html: ptremarks }}
                        />
                        </div>
                        <div class="mt-3 mb-3 d-grid" style={{ display: "flex" }}>
                          <label>Sales Remarks </label>
                          <ReactQuill
                          theme="snow"
                          value={stremarks}
                          // onChange={handlePtRemarksChange}
                          modules={{ toolbar: false }}
                          readOnly={true}
                          
                          dangerouslySetInnerHTML={{ __html: stremarks }}
                        />
                        </div>
                        <div class="mt-3 mb-3 d-grid" style={{ display: "flex" }}>
                          <label>Upload Signed Contract </label>
                          <FileUploader handleChange={handleFileChange} onDrop={handleFileDrop} name="file" types={fileTypes} />
                          {/* <Dragger
                            className='col-6 mt-3 mb-5'
                            multiple={false}
                            onChange={(info) => {
                              const { status, originFileObj } = info.file;
                              if (status == 1) {
                                message.success(`${info.file.name} file uploaded successfully.`);
                                handleUpload(originFileObj);
                              } else if (status == 0) {
                                message.error(`${info.file.name} file upload failed.`);
                              }
                            }}
                          >
                            <div className="">
                              <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                              </p>
                              <p className="ant-upload-text">Click or drag file to this area to upload</p>
                              <p className="ant-upload-hint">Single Upload Only.</p>
                            </div>
                          </Dragger> */}
                        </div>
                        <div class="mt-5 mb-3 d-grid" style={{ display: "flex" }}>
                          <label>Add Remarks </label>
                        
                          <ReactQuill theme="snow" value={contractremarks} onChange={handleContractRemarksChange} />
                        </div>
                        <button
                          className="btn btn-outline-primary mt-5"
                          onClick={handleUploadSignedContract}
                        >
                          Submit
                        </button>
                      </>
                    ) : (projectstatus == 8 && designation_id == 5) ? (
                      <>
                        <div class="mt-3 mb-3 d-grid">
                          <label>PT Remarks </label>
                          <ReactQuill
                          theme="snow"
                          value={ptremarks}
                          // onChange={handlePtRemarksChange}
                          modules={{ toolbar: false }}
                          readOnly={true}
                          
                          dangerouslySetInnerHTML={{ __html: ptremarks }}
                        />
                        </div>
                        <div class="mt-3 mb-3 d-grid" style={{ display: "flex" }}>
                          <label>Sales Remarks </label>
                          <ReactQuill
                          theme="snow"
                          value={stremarks}
                          onChange={handlePtRemarksChange}
                          modules={{ toolbar: false }}
                          readOnly={true}
                          
                          dangerouslySetInnerHTML={{ __html: stremarks }}
                        />
                        </div>
                        <div class="mt-3 mb-3 d-grid" style={{ display: "flex" }}>
                          <label>Uploaded Signed Contract </label>
                         
                        
                        </div>
                        <div class="mt-5 mb-3 d-grid" style={{ display: "flex" }}>
                          <label>Add Remarks </label>
                          <ReactQuill
                          theme="snow"
                          value={contractremarks}
                          // onChange={handlePtRemarksChange}
                          modules={{ toolbar: false }}
                          readOnly={true}
                          
                          dangerouslySetInnerHTML={{ __html: contractremarks }}
                        />
                          {/* <ReactQuill theme="snow" value={contractremarks} onChange={setValue} /> */}
                        </div>
                      </>
                    )
                      : (
                        <>
                        </>
                      )
                  }
                </div>
              </Tabs.TabPane>
                </>
              ):(
                <></> 
              )}
             
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};
export default PtActions;

import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Tabs, Upload } from 'antd'
import axios from "axios"
import { API_BASE_URL, API_HEADER, BASE_DOCUMENT, get_client_name_url } from '../config';
import { get_scope_url } from '../config';
import { get_sectoralscope_url } from '../config';
import { get_program_url } from '../config';
import { get_country_url } from '../config';
import { get_assesment_url } from '../config';
import { pt_proposal_team_url } from '../config';
import { pt_proposal_submit_url } from '../config';
import { toast } from 'react-toastify';
import { pt_tm_proposalaction_url } from '../config';
import Header from './Header';


const PtActions = () => {

    const navigate = useNavigate();
    const [projectid, setProjectId] = useState(null)
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
    const [action, setAction] = useState('');
    const [remarks, setRemarks] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [allRemarks, setAllRemarks] = useState('');
    const [allAction, setAllAction] = useState('')

    const [formData, setFormData] = useState({
        project_name: '',
        earthood_id: '',
        client_id: '',
        country: '',
        program: '',
        program_id: '',
        implemented_fees: '',
        created_at: '',
        scope: '',
        scope_pa: '',
        sectoral_scope: '',
        team_leader: '',
        ta_expert: '',
        validator_verifier: '',
        finance_expert: '',
        local_expert: '',
        meth_expert: '',
        trainee_validator: '',
        technical_reviewer: ''
    });



    const location = useLocation();


    useEffect(() => {
        if (location.state && location.state.data) {
            const { data } = location.state;

            setProjectId(data.id)
            setFormData({
                project_name: data.project_name,
                earthood_id: data.earthood_id,
                client_id: data.client_id,
                country: data.country,
                program: data.program,
                program_id: data.program_id,
                implemented_fees: data.implemented_fees,
                created_at: data.created_at,
                scope: data.scope,
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

            });

            let url1 = `${BASE_DOCUMENT}/documents/${data.earthood_id}/${data.f20_doc}`;
            setF20Name(url1);

            let url2 = `${BASE_DOCUMENT}/documents/${data.earthood_id}/${data.f21_doc}`;
            setF21Name(url2);

            let url3 = `${BASE_DOCUMENT}/documents/${data.earthood_id}/${data.f23_doc}`;
            setF23Name(url3);

            let url4 = `${BASE_DOCUMENT}/documents/${data.earthood_id}/${data.coi_doc}`;
            setCoiName(url4);
         

            setRemarks(data.remarks)
            setAction(data.action)

        }
    }, [location]);




    const CONFIG_Token = {                                         //config object
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        }
    }


    const CONFIG_Token2 = {                                         //config object
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token"),
            'Content-Type': 'multipart/form-data'
        }
    }




    const handleActionChange = (e) => {
        setAction(e.target.value);
      setAction(e.target.value)
    };

    const handleRemarksChange = (e) => {
        setRemarks(e.target.value);
        setRemarks(e.target.value)
    };

    const handleSubmitAction = async () => {

        if (action && remarks) {
            try {

                let payload = {
                    'proposal_id': projectid,
                    'status': action,
                    'remarks': remarks
                }
                const response = await axios.post(`${pt_tm_proposalaction_url}`, payload, API_HEADER);
                // Handle response accordingly
                if (response.status === 200) {
                    // Reset form fields after successful submission
                    setAllRemarks([...allRemarks, remarks]);
                    setAction('');
                    setRemarks('');
                    toast.success("Action added successfully")
                    navigate('/allprojects')
                    // Optionally, you can handle success feedback to the user
                } else {
                    // Handle error response
                    console.error('Failed to submit data');
                    toast.error(response.data.message)
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error(error)
            }
        } else {
            // Handle case where one or more fields are missing
            console.error('One or more required fields are missing');
            toast.error("All fields are not filled")
        }
        setSubmitted(true);
    };


    const handleMyProjectChange = (event) => {
        setFormData({ ...formData, project_name: event.target.value })
    };


    const handleEarthoodIdChange = (event) => {
        setFormData({ ...formData, earthood_id: event.target.value })
    };

    const handleProgramIdChange = (event) => {
        setFormData({ ...formData, program_id: event.target.value })
    };


    const handleFeesChange = (event) => {
        setFormData({ ...formData, implemented_fees: event.target.value })
    };

    const handleDateChange = (e) => {
        setFormData({ ...formData, created_at: e.target.value })
    };



    useEffect(() => {
        const fetchDataClientName = async () => {
            try {
                const responseclientname = await axios.get(`${get_client_name_url}`);
                setClientName(responseclientname.data.data); // Assuming the API returns an array of objects
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };

        fetchDataClientName();
    }, []);

    useEffect(() => {
        const fetchDataSectoralScope = async () => {
            try {
                const responsesector = await axios.get(`${get_sectoralscope_url}`);
                setSectoralScope(responsesector.data.data); // Assuming the API returns an array of objects
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };

        fetchDataSectoralScope();
    }, []);



    useEffect(() => {
        const fetchDataScope = async () => {
            try {
                const responsescope = await axios.get(`${get_scope_url}`);
                setMyScope(responsescope.data.data); // Assuming the API returns an array of objects
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };

        fetchDataScope();
    }, []);


    useEffect(() => {
        const fetchDataProgram = async () => {
            try {
                const responseprogram = await axios.get(`${get_program_url}`);
                setProgram(responseprogram.data.data); // Assuming the API returns an array of objects
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };

        fetchDataProgram();
    }, []);


    useEffect(() => {
        const fetchDataCountry = async () => {
            try {
                const responsecountry = await axios.get(`${get_country_url}`);
                setCountry(responsecountry.data.data); // Assuming the API returns an array of objects
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };

        fetchDataCountry();
    }, []);


    useEffect(() => {
        const fetchDataTechnicalReviewer = async () => {
            try {
                const responseteamleader = await axios.get(`${get_assesment_url}`);
                setAtList(responseteamleader.data.data); // Assuming the API returns an array of objects
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };

        fetchDataTechnicalReviewer();
    }, []);


    return (
        <>

            <Header />
            <div className="container-fluid bg-light">
                <div className="row">
                    <div className="col-12">
                        <h2 className='text-center textcolorblue fw-bolder p-2 text-capitalize'>proposal details</h2>
                        <Tabs defaultActiveKey='1' centered
                            indicator={{ Backgroundcolor: '#07B6AF' }}
                            size='large'
                        >
                            <Tabs.items tab={
                                <div className='border-0 shadow-sm textlightgreen rounded-0 px-5 py-2 text-center'>
                                    <p>Proposal Details</p>
                                </div>

                            } key="1">
                                <form >
                                    <div className='col-10 border-0 bg-white shadow-sm p-5 mx-auto'>
                                        <div className="row">
                                            <div className="col-4 mb-3">
                                                <label for="projectname" className="form-label">Project Name<span style={{ color: 'red' }}>*</span></label>
                                                <input type="text" className='form-control borderlightgreen' id="project_name" placeholder="Project Name" required name="project_name" value={formData.project_name} onChange={handleMyProjectChange} readOnly disabled />
                                            </div>
                                            <div className="col-4 mb-3">
                                                <label for="eid" className="form-label">Earthood Id<span style={{ color: 'red' }}>*</span></label>
                                                <input type="text" className='form-control borderlightgreen' id="earthood_id" placeholder="Earthood Id" name="earthood_id" required value={formData.earthood_id} onChange={handleEarthoodIdChange} readOnly disabled />
                                            </div>
                                            <div className="col-4 mb-3">
                                                <label for="clientname" className="form-label">Client Name<span style={{ color: 'red' }}>*</span></label>
                                                {loading ? (
                                                    <p>Loading...</p>
                                                )
                                                    : (
                                                        <select id="client_id" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="client_id" value={formData.client_id} onChange={(e) => setFormData({ ...formData, client_id: e.target.value })} disabled>
                                                            <option selected value={''}>Select Client Name</option>
                                                            {clientName.map(option => (
                                                                <option key={option.id} value={option.id}>{option.name}</option>
                                                            ))}
                                                        </select>
                                                    )}
                                            </div>
                                        </div>
                                        {/* row 2 */}
                                        <div className="row">
                                            <div className="col-4 mb-3">
                                                <label htmlFor="country" className="form-label" required>Country<span style={{ color: 'red' }}>*</span></label>
                                                {loading ? (
                                                    <p>Loading...</p>
                                                )
                                                    : (
                                                        <select id="country" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} disabled>
                                                            <option selected value={''}>Select Country</option>
                                                            {country.map(option => (
                                                                <option key={option.id} value={option.id}>
                                                                    {option.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                            </div>
                                            <div className="col-4 mb-3">
                                                <label for="Program" className="form-label">Program<span style={{ color: 'red' }}>*</span></label>
                                                {loading ? (
                                                    <p>Loading...</p>
                                                )
                                                    : (
                                                        <select id="program" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="program" value={formData.program} onChange={(e) => setFormData({ ...formData, program: e.target.value })} disabled>
                                                            <option selected value={''}>Select Program</option>
                                                            {program.map(option => (
                                                                <option key={option.id} value={option.id}>
                                                                    {option.program_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                            </div>
                                            <div className="col-4 mb-3">
                                                <label for="Program Id" className="form-label">Program Id<span style={{ color: 'red' }}>*</span></label>
                                                <input type="text" id="program_id" placeholder="Program Id" required name="program_id" className='form-control borderlightgreen' value={formData.program_id} onChange={handleProgramIdChange} readOnly disabled />

                                            </div>
                                        </div>
                                        {/* row 3 */}
                                        <div className="row">
                                            <div className="col-4 mb-3">
                                                <label for="Implementation Fees" className="form-label">Implementation Fees<span style={{ color: 'red' }}>*</span></label>
                                                <input type="number" className='form-control borderlightgreen' id="implemented_fees" placeholder="Implementation Fees" required name="implemented_fees" value={formData.implemented_fees} onChange={handleFeesChange} readOnly disabled />

                                            </div>
                                            <div className="col-4 mb-3">
                                                <label for="Proposal Date" className="form-label">Proposal Date<span style={{ color: 'red' }}>*</span></label>
                                                <input type="date" className='form-control borderlightgreen' id="proposaldate" required name="created_at" value={formData.created_at} onChange={handleDateChange} readOnly disabled />

                                            </div>
                                            <div className="col-4 mb-3">
                                                <label for="Scope" className="form-label">Scope<span style={{ color: 'red' }}>*</span></label>
                                                {loading ? (
                                                    <p>Loading...</p>
                                                )
                                                    : (
                                                        <select id="scope" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="scope" value={formData.scope} onChange={(e) => setFormData({ ...formData, scope: e.target.value })} disabled>
                                                            <option selected value={''}>Select Scope</option>
                                                            {myscope.map(option => (
                                                                <option key={option.id} value={option.id}>
                                                                    {option.scope}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                            </div>
                                        </div>

                                        {/* row 4 */}
                                        <div className="row">
                                            <div className="col-4 mb-3">
                                                <label for="Scope(PO/POA)" className="form-label">Scope(PO/POA)<span style={{ color: 'red' }}>*</span></label>
                                                <select id="scope_pa" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="scope_pa" value={formData.scope_pa} onChange={(e) => setFormData({ ...formData, scope_pa: e.target.value })} disabled>
                                                    <option selected>Select Scope PO/POA</option>
                                                    <option value={1}>PO</option>
                                                    <option value={2}>POA</option>
                                                </select>
                                            </div>
                                            <div className="col-4 mb-3">

                                                <div>
                                                    <label for="Sectoral Scope" className="form-label">Sectoral Scope<span style={{ color: 'red' }}>*</span></label>

                                                    {loading ? (
                                                        <p>Loading...</p>
                                                    )
                                                        : (
                                                            <select id="sectoral_scope" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="sectoral_scope" value={formData.sectoral_scope} onChange={(e) => setFormData({ ...formData, sectoral_scope: e.target.value })} disabled>
                                                                <option selected value={''}>Sectoral Scope</option>
                                                                {sectoralScope.map(option => (
                                                                    <option key={option.id} value={option.id}>{option.sector_name}</option>
                                                                ))}
                                                            </select>
                                                        )}

                                                </div>
                                            </div>
                                            {/* row 5 */}
                                            <p className='textlightgreen fw-bold m-3'>Assessment Team</p>
                                            <hr />
                                            <div className="row">
                                                <div className="col-4 mb-3">
                                                    <label for="teamleader" className="form-label">Team Leader<span style={{ color: 'red' }}>*</span></label>
                                                    {loading ? (
                                                        <p>Loading...</p>
                                                    )
                                                        : (
                                                            <select id="team_leader" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="team_leader" required value={formData.team_leader} onChange={(e) => setFormData({ ...formData, team_leader: e.target.value })} disabled>
                                                                <option selected value={''}>Select Team Leaders</option>
                                                                {atlist.filter(option => option.designation_id === 8).map(option => (
                                                                    <option key={option.id} value={option.id}>{option.name}</option>
                                                                ))}
                                                            </select>
                                                        )}

                                                </div>
                                                <div className="col-4 mb-3">
                                                    <label for="taexpert" className="form-label">Select TA Expert<span style={{ color: 'red' }}>*</span></label>
                                                    {loading ? (
                                                        <p>Loading...</p>
                                                    )
                                                        : (
                                                            <select id="ta_expert" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="ta_expert" required value={formData.ta_expert} onChange={(e) => setFormData({ ...formData, ta_expert: e.target.value })} disabled>
                                                                <option selected value={''}>Select TA Expert</option>
                                                                {atlist.filter(option => option.designation_id === 8).map(option => (
                                                                    <option key={option.id} value={option.id}>{option.name}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                </div>
                                                <div className="col-4 mb-3">
                                                    <label for="validator" className="form-label">Validator</label>
                                                    {loading ? (
                                                        <p>Loading...</p>
                                                    )
                                                        : (
                                                            <select id="validator_verifier" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="validator_verifier" value={formData.validator_verifier} onChange={(e) => setFormData({ ...formData, validator_verifier: e.target.value })} disabled>
                                                                <option selected value={''}>Select Validator</option>
                                                                {atlist.filter(option => option.designation_id === 8).map(option => (
                                                                    <option key={option.id} value={option.id}>{option.name}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-4 mb-3">
                                                    <label for="financeexpert" className="form-label">Finance Expert</label>
                                                    {loading ? (
                                                        <p>Loading...</p>
                                                    )
                                                        : (
                                                            <select id="finance_expert" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="finance_expert" value={formData.finance_expert} onChange={(e) => setFormData({ ...formData, finance_expert: e.target.value })} disabled>
                                                                <option selected value={''}>Select Finance Experts</option>
                                                                {atlist.filter(option => option.designation_id === 8).map(option => (
                                                                    <option key={option.id} value={option.id}>{option.name}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                </div>
                                                <div className="col-4 mb-3">
                                                    <label for="teamleader" className="form-label">Local Expert</label>
                                                    {loading ? (
                                                        <p>Loading...</p>
                                                    )
                                                        : (
                                                            <select id="local_expert" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="local_expert" value={formData.local_expert} onChange={(e) => setFormData({ ...formData, local_expert: e.target.value })} disabled>
                                                                <option selected value={''}>Local Experts</option>
                                                                {atlist.filter(option => option.designation_id === 8).map(option => (
                                                                    <option key={option.id} value={option.id}>{option.name}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                </div>
                                                <div className="col-4 mb-3">
                                                    <label for="methexpert" className="form-label">Meth Expert</label>
                                                    {loading ? (
                                                        <p>Loading...</p>
                                                    )
                                                        : (
                                                            <select id="meth_expert" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="meth_expert" value={formData.meth_expert} onChange={(e) => setFormData({ ...formData, meth_expert: e.target.value })} disabled>
                                                                <option selected value={''}>Select Math Expert</option>
                                                                {atlist.filter(option => option.designation_id === 8).map(option => (
                                                                    <option key={option.id} value={option.id}>{option.name}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                </div>
                                            </div>
                                            <div className="row">

                                                <div className="col-4 mb-3">
                                                    <label for="taexpert" className="form-label">Trainee Validator</label>
                                                    {loading ? (
                                                        <p>Loading...</p>
                                                    )
                                                        : (
                                                            <select id="trainee_validator" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="trainee_validator" value={formData.trainee_validator} onChange={(e) => setFormData({ ...formData, trainee_validator: e.target.value })} disabled>
                                                                <option selected value={''}>Select Trainee Validators</option>
                                                                {atlist.filter(option => option.designation_id === 8).map(option => (
                                                                    <option key={option.id} value={option.id}>{option.name}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                </div>
                                                <div className="col-4 mb-3">
                                                    <label for="technicalreviewer" className="form-label">Technical Reviewer<span style={{ color: 'red' }}>*</span></label>
                                                    {loading ? (
                                                        <p>Loading...</p>
                                                    )
                                                        : (
                                                            <select id="technical_reviewer" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="technical_reviewer" required value={formData.technical_reviewer} onChange={(e) => setFormData({ ...formData, technical_reviewer: e.target.value })} disabled>
                                                                <option selected value={''}>Select Technical Reviewer</option>
                                                                {atlist.filter(option => option.designation_id === 7).map(option => (
                                                                    <option key={option.id} value={option.id}>{option.name}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                </div>
                                                {/* <div>
                                                    <button type="submit" class="btn btn-outline-primary" >Save & Next</button>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </Tabs.items>
                            <Tabs.items tab={
                                <div className='border-0 shadow-sm textlightgreen rounded-0 px-5 py-2 text-center'>
                                    <p>Attachment</p>
                                </div>
                            } key="2">
                                <div className='col-10 border-0 bg-white shadow-sm p-5 mx-auto'>
                                    <form enctype='multipart/form-data'>
                                        <table className='table table-bordered table-responsive'>
                                            <thead>
                                                <tr>
                                                    <th>Document name </th>
                                                    <th>Uploaded Files</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>F20 Document</td>
                                                    {/* <td> <input class="form-control" type="file" id="formFileMultiple" name='f20_doc' readOnly disabled/></td> */}
                                                    <td><a target='_blank' href={f20name}>Document Link</a></td>
                                                </tr>
                                                <tr>
                                                    <td>F21 Document</td>
                                                    <td><a target='_blank' href={f21name}>Document Link</a></td>
                                                </tr>
                                                <tr>
                                                    <td>F23 Document</td>
                                                    <td><a target='_blank' href={f23name}>Document Link</a></td>
                                                </tr>
                                                <tr>
                                                    <td>COI Document</td>
                                                    <td><a target='_blank' href={coiname}>Document Link</a></td>


                                                </tr>
                                            </tbody>
                                        </table>
                                    </form>

                                </div>
                            </Tabs.items>
                            <Tabs.items tab={
                                <div className='border-0 shadow-sm textlightgreen rounded-0 px-5 py-2 text-center'>
                                    <p>TM Actions</p>
                                </div>
                            } key="3">
                                {/* {submitted ? (
                                    <>

                                        <select id="technical_reviewer" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="technical_reviewer" required onChange={handleActionChange} value={action} disabled>
                                            <option selected value={''}>Select Action</option>
                                            <option value="1" disabled={action === '1'}>Approve</option>
                                            <option value="3" disabled={action === '3'}>Clarification Required</option>
                                        </select>
                                        <div className="mt-5 mb-3 ">
                                            <textarea placeholder='Add Remarks' className="form-control" id="exampleFormControlTextarea1" rows="3" value={remarks} onChange={handleRemarksChange} disabled></textarea>
                                        </div>
                                        <button className="btn btn-outline-primary" onClick={handleSubmitAction} disabled>Submit</button>
                                    </>
                                ) : (
                                    <>

                                        <select id="technical_reviewer" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="technical_reviewer" required onChange={handleActionChange} value={action}>
                                            <option selected value={''}>Select Action</option>
                                            <option value="1" disabled={action === '1'}>Approve</option>
                                            <option value="3" disabled={action === '3'}>Clarification Required</option>
                                        </select>
                                        <div className="mt-5 mb-3 ">
                                            <textarea placeholder='Add Remarks' className="form-control" id="exampleFormControlTextarea1" rows="3" value={remarks} onChange={handleRemarksChange}></textarea>
                                        </div>

                                    </>
                                )} */}
                                <div className='col-10 border-0 bg-white shadow-sm p-5 mx-auto'>
                                    <select id="technical_reviewer" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="technical_reviewer" required onChange={handleActionChange} value={action} >
                                        <option selected value={''}>Select Action</option>
                                        <option value="1">Approved</option>
                                        <option value="3">Clarification Required</option>
                                    </select>
                                    <div class="mt-5 mb-3 ">

                                        <textarea placeholder='Add Remarks' className="form-control" id="exampleFormControlTextarea1" rows="3" value={remarks} onChange={handleRemarksChange}></textarea>
                                    </div>
                                    <button className="btn btn-outline-primary" onClick={handleSubmitAction}>Submit</button>
                                </div> 
                               
                            </Tabs.items>

                        </Tabs>
                    </div>
                </div>
            </div >
        </>
    )
}
export default PtActions
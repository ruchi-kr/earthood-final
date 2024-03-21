import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Tabs, Upload } from 'antd'
import axios from "axios"
import { API_BASE_URL, BASE_DOCUMENT, get_client_name_url } from '../config';
import { get_scope_url } from '../config';
import { get_sectoralscope_url } from '../config';
import { get_program_url } from '../config';
import { get_country_url } from '../config';
import { get_assesment_url } from '../config';
import { pt_proposal_team_url } from '../config';
import { pt_proposal_submit_url } from '../config';
import { toast } from 'react-toastify';
import Header from './Header';


const AddProject = () => {

    const navigate = useNavigate();
    const [projectid, setProjectId] = useState(null)
    const [clientName, setClientName] = useState([]);
    const [sectoralScope, setSectoralScope] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myscope, setMyScope] = useState([]);
    const [program, setProgram] = useState([]);
    const [country, setCountry] = useState([]);
    const [atlist, setAtList] = useState([]);
    const [activeTab, setActiveTab] = useState('1');
    const [myprojectName, setMyProjectName] = useState('');
    const [error, setError] = useState('');
    const [earthoodId, setEarthoodId] = useState('');
    const [earthoodIdError, setEarthoodIdError] = useState('');
    const [programId, setProgramId] = useState('');
    const [programIdError, setProgramIdError] = useState('');
    const [fees, setFees] = useState('');
    const [feesError, setFeesError] = useState('');
    const [proposalDate, setProposalDate] = useState('');
    const [proposalDateError, setProposalDateError] = useState('');
    const [f20name, setF20Name] = useState(null);
    const [f21name, setF21Name] = useState(null);
    const [f23name, setF23Name] = useState(null);
    const [coiname, setCoiName] = useState(null);

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




    const handleMyProjectChange = (event) => {
        const { value } = event.target;
        setMyProjectName(value);
        // Validate input value
        if (value.length < 3 || value.length > 40 || !isNaN(value)) {
            setError('Project Name must be in alphabatic characters with 3 to 40 characters');
        } else {
            setError('');
        }
        setFormData({ ...formData, project_name: event.target.value })
    };


    const handleEarthoodIdChange = (event) => {
        const value = event.target.value;
        setEarthoodId(value); // Update input value

        // Validate input value
        if (!/^[a-zA-Z0-9]{3,40}$/.test(value)) {
            setEarthoodIdError('Earthood Id must be alphanumeric and between 3 to 40 characters');
        } else {
            setEarthoodIdError(''); // Clear error if validation passes
        }
        setFormData({ ...formData, earthood_id: event.target.value })
    };

    const handleProgramIdChange = (event) => {
        const value = event.target.value;
        setProgramId(value); // Update input value

        // Validate input value
        if (!/^[a-zA-Z0-9]{3,40}$/.test(value)) {
            setProgramIdError('Earthood Id must be alphanumeric and between 3 to 40 characters');
        } else {
            setProgramIdError(''); // Clear error if validation passes
        }
        setFormData({ ...formData, program_id: event.target.value })
    };


    const handleFeesChange = (event) => {
        const value = event.target.value;
        // Update input value
        setFees(value);
        // Validate input value
        if (value < 1 || value > 999999999999 || !/^\d+$/.test(value)) {
            setFeesError('Implementation Fees must be a positive integer between 1 and 999,999,999,999.');
        } else {
            setFeesError('');
        }
        setFormData({ ...formData, implemented_fees: event.target.value })
    };

    const handleDateChange = (e) => {
        const value = e.target.value;
        // Update input value
        setProposalDate(value);
        // Validate date format and future date
        const currentDate = new Date();
        const selectedDate = new Date(value);
        if (value === '' || isNaN(selectedDate.getTime())) {
            setProposalDateError('Please enter a valid date.');
        } else if (selectedDate > currentDate) {
            setProposalDateError('Proposal Date cannot be a future date.');
        } else {
            setProposalDateError('');
        }
        setFormData({ ...formData, created_at: e.target.value })
    };






    const handleSubmit = async (e) => {

        e.preventDefault();
        console.log(e);
        const formData = new FormData(e.target);

        console.log(projectid);
        formData.append('proposal_id', projectid)

        try {
            const response = await axios.post(`${pt_proposal_team_url}`, formData, CONFIG_Token);
            setProjectId(response.data.project_id);
            if (!response.data.status) {
                toast.error(response.data.message)
            }
            else if (error || earthoodIdError || programIdError || feesError || proposalDateError) {
                toast.error("Data is not filled correctly in every field")
            }
            else {
                toast.success("Form Submitted Successfully")
                // console.log('Data saved:', response.data);
                // Optionally, navigate to the next step or perform any other action
                setActiveTab('2');
            }


        } catch (error) {
            console.error('Error saving data:', error);
            // Optionally, display an error message to the user
        }
    };
    console.log("first", projectid)

  

   
  

    const handleSubmitFile = async (e) => {
        e.preventDefault();
        console.log(e.target)
        const formData = new FormData();
        console.log("firstjkhkj", projectid)
        formData.append('proposal_id', projectid)
        console.log(formData)
        const fileInputs = e.target.querySelectorAll('input[type="file"]');

        fileInputs.forEach(input => {
            const files = input.files;
            // Append each file to the FormData object
            for (let i = 0; i < files.length; i++) {
                formData.append(input.name, files[i]);
            }
            console.log(files)
        });

        try {
            // Make a POST request to save the files in the database
            const response = await axios.post(`${pt_proposal_submit_url}`, formData, CONFIG_Token2);
            console.log('Files saved:', response.data);
            if (!response.data.status) {
                toast.error("Files do not uploaded")
            }
            else {
                toast.success("Files Submitted Successfully")
                console.log('Data saved:', response.data);
                navigate('/dashboard')
            }
        } catch (error) {
            console.error('Error saving files:', error);
        }

    };


    const handleBackToTab1 = () => {
        setActiveTab('1');
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
                const responsesector = await axios.get(`${get_scope_url}`);
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
                const responsescope = await axios.get(`${get_sectoralscope_url}`);
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

            <Header/>
            <div className="container-fluid bg-light">
                <div className="row">
                    <div className="col-12">
                        <h2 className='text-center textcolorblue fw-bolder p-2 text-capitalize bg-light'>proposal details</h2>
                        <Tabs defaultActiveKey='1' activeKey={activeTab} centered
                            
                            size='large'
                        >
                            <Tabs.items tab={
                                <div className='border-0 shadow-sm textlightgreen rounded-0 px-5 py-2 text-center'>
                                    <p>Proposal Details</p>
                                </div>

                            } key="1">
                                <form onSubmit={handleSubmit} method='POST'>
                                    <div className='col-10 border-0 bg-white p-5 mx-auto'>
                                        <div className="row">
                                            <div className="col-4 mb-3">
                                                <label for="projectname" className="form-label">Project Name<span style={{ color: 'red' }}>*</span></label>
                                                <input type="text" className={`form-control borderlightgreen ${error ? 'is-invalid' : ''}`} id="project_name" placeholder="Project Name" required name="project_name" value={formData.project_name} onChange={handleMyProjectChange} />
                                                {error && <div className="error text-danger">{error}</div>}
                                            </div>
                                            <div className="col-4 mb-3">
                                                <label for="eid" className="form-label">Earthood Id<span style={{ color: 'red' }}>*</span></label>
                                                <input type="text" className={`form-control borderlightgreen ${earthoodIdError ? 'is-invalid' : ''}`} id="earthood_id" placeholder="Earthood Id" name="earthood_id" required value={formData.earthood_id} onChange={handleEarthoodIdChange} />
                                                {earthoodIdError && <div className="invalid-feedback text-danger">{earthoodIdError}</div>}
                                            </div>
                                            <div className="col-4 mb-3">
                                                <label for="clientname" className="form-label">Client Name<span style={{ color: 'red' }}>*</span></label>
                                                {loading ? (
                                                    <p>Loading...</p>
                                                )
                                                    : (
                                                        <select id="client_id" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="client_id" value={formData.client_id} onChange={(e) => setFormData({ ...formData, client_id: e.target.value })} >
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
                                                        <select id="country" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })}>
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
                                                        <select id="program" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="program" value={formData.program} onChange={(e) => setFormData({ ...formData, program: e.target.value })}>
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
                                                <input type="text" id="program_id" placeholder="Program Id" required name="program_id" className={`form-control borderlightgreen ${programIdError ? 'is-invalid' : ''}`} value={formData.program_id} onChange={handleProgramIdChange} />
                                                {programIdError && <div className="invalid-feedback text-danger">{programIdError}</div>}
                                            </div>
                                        </div>
                                        {/* row 3 */}
                                        <div className="row">
                                            <div className="col-4 mb-3">
                                                <label for="Implementation Fees" className="form-label">Implementation Fees<span style={{ color: 'red' }}>*</span></label>
                                                <input type="number" className={`form-control borderlightgreen ${feesError ? 'is-invalid' : ''}`} id="implemented_fees" placeholder="Implementation Fees" required name="implemented_fees" value={formData.implemented_fees} onChange={handleFeesChange} />
                                                {feesError && <div className="invalid-feedback text-danger">{feesError}</div>}
                                            </div>
                                            <div className="col-4 mb-3">
                                                <label for="Proposal Date" className="form-label">Proposal Date<span style={{ color: 'red' }}>*</span></label>
                                                <input type="date" className={`form-control borderlightgreen ${proposalDateError ? 'is-invalid' : ''}`} id="proposaldate" required name="created_at" value={formData.created_at} onChange={handleDateChange} />
                                                {proposalDateError && <div className="invalid-feedback">{proposalDateError}</div>}
                                            </div>
                                            <div className="col-4 mb-3">
                                                <label for="Scope" className="form-label">Scope<span style={{ color: 'red' }}>*</span></label>
                                                {loading ? (
                                                    <p>Loading...</p>
                                                )
                                                    : (
                                                        <select id="scope" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="scope" value={formData.scope} onChange={(e) => setFormData({ ...formData, scope: e.target.value })}>
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
                                                <select id="scope_pa" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="scope_pa" value={formData.scope_pa} onChange={(e) => setFormData({ ...formData, scope_pa: e.target.value })}>
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
                                                            <select id="sectoral_scope" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="sectoral_scope" value={formData.sectoral_scope} onChange={(e) => setFormData({ ...formData, sectoral_scope: e.target.value })}>
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
                                                            <select id="team_leader" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="team_leader" required value={formData.team_leader} onChange={(e) => setFormData({ ...formData, team_leader: e.target.value })}>
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
                                                            <select id="ta_expert" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="ta_expert" required value={formData.ta_expert} onChange={(e) => setFormData({ ...formData, ta_expert: e.target.value })}>
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
                                                            <select id="validator_verifier" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="validator_verifier" value={formData.validator_verifier} onChange={(e) => setFormData({ ...formData, validator_verifier: e.target.value })}>
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
                                                            <select id="finance_expert" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="finance_expert" value={formData.finance_expert} onChange={(e) => setFormData({ ...formData, finance_expert: e.target.value })}>
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
                                                            <select id="local_expert" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="local_expert" value={formData.local_expert} onChange={(e) => setFormData({ ...formData, local_expert: e.target.value })}>
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
                                                            <select id="meth_expert" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="meth_expert" value={formData.meth_expert} onChange={(e) => setFormData({ ...formData, meth_expert: e.target.value })}>
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
                                                            <select id="trainee_validator" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="trainee_validator" value={formData.trainee_validator} onChange={(e) => setFormData({ ...formData, trainee_validator: e.target.value })}>
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
                                                            <select id="technical_reviewer" className="form-select borderlightgreen form-select-sm" aria-label="Default select example" name="technical_reviewer" required value={formData.technical_reviewer} onChange={(e) => setFormData({ ...formData, technical_reviewer: e.target.value })}>
                                                                <option selected value={''}>Select Technical Reviewer</option>
                                                                {atlist.filter(option => option.designation_id === 7).map(option => (
                                                                    <option key={option.id} value={option.id}>{option.name}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                </div>
                                                <div>
                                                    <button type="submit" class="btn btn-outline-primary" >Save & Next</button>
                                                </div>
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
                                <div className='col-10 border-0 bg-white p-5 mx-auto'>
                                <form onSubmit={handleSubmitFile} method='POST' enctype='multipart/form-data'>
                                        <table className='table table-bordered table-responsive'>
                                            <thead>
                                                <tr>
                                                    <th>Document name </th>
                                                    <th>Select File</th>
                                                    {/* <th>Previous Files</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>F20 Document</td>
                                                    <td> <input class="form-control" type="file" id="formFileMultiple" name='f20_doc' /></td>
                                                    {/* <td><a target='_blank' href={f20name}>Document Link</a></td> */}
                                                </tr>
                                                <tr>
                                                    <td>F21 Document</td>
                                                    <td><input class="form-control" type="file" name='f21_doc' id="formFileMultiple" /></td>
                                                    {/* <td><a target='_blank' href={f21name}>Document Link</a></td> */}
                                                </tr>
                                                <tr>
                                                    <td>F23 Document</td>
                                                    <td><input class="form-control" type="file" name='f23_doc' id="formFileMultiple" /></td>
                                                    {/* <td><a target='_blank' href={f23name}>Document Link</a></td> */}
                                                </tr>
                                                <tr>
                                                    <td>COI Document</td>
                                                    <td><input class="form-control" type="file" name='coi_doc' id="formFileMultiple" /></td>
                                                    {/* <td><a target='_blank' href={coiname}>Document Link</a></td> */}


                                                </tr>
                                            </tbody>
                                        </table>
                                        <button onClick={handleBackToTab1} className="btn btn-outline-primary">Back</button>
                                        <button style={{ marginLeft: '10px' }} type="submit" class="btn btn-outline-primary" >Save</button>
                                    </form>
                                  
                                </div>

                            </Tabs.items>
                        </Tabs>
                    </div>
                </div>
            </div >
        </>
    )
}

export default AddProject

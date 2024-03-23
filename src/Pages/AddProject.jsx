import { Form, Select, Tabs, Upload, message } from "antd";
import '../App.css';
import axios from "axios";
import React, { useState, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import { MultiSelect } from "react-multi-select-component";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { get_client_name_url } from "../config";
import { get_scope_url } from "../config";
import { get_sectoralscope_url } from "../config";
import { get_program_url } from "../config";
import { get_country_url } from "../config";
import { get_assesment_url } from "../config";
import { pt_proposal_team_url } from "../config";
import { pt_proposal_submit_url } from "../config";
import Header from "./Header";
const fileTypes = [
	"JPG",
	"JPEG",
	"PDF",
	"RAR",
	"XLS",
	"XLSX",
	"DOC",
	"DOCX",
	"ZIP",
];
const { Dragger } = Upload;
const { Option } = Select;

const AddProject = () => {
	const navigate = useNavigate();

	const [projectid, setProjectId] = useState(null);
	const [clientName, setClientName] = useState([]);
	const [sectoralScope, setSectoralScope] = useState([]);
	const [loading, setLoading] = useState(true);
	const [myscope, setMyScope] = useState([]);
	const [selected, setSelected] = useState([]);
	const [sbuhead, setSbuHead] = useState([]);
	const [program, setProgram] = useState([]);
	const [country, setCountry] = useState([]);
	const [atlist, setAtList] = useState([]);
	const [activeTab, setActiveTab] = useState("1");
	const [myprojectName, setMyProjectName] = useState("");
	const [error, setError] = useState("");
	const [earthoodId, setEarthoodId] = useState("");
	const [earthoodIdError, setEarthoodIdError] = useState("");
	const [programId, setProgramId] = useState("");
	const [programIdError, setProgramIdError] = useState("");
	const [fees, setFees] = useState("");
	const [feesError, setFeesError] = useState("");
	const [proposalDate, setProposalDate] = useState("");
	const [proposalDateError, setProposalDateError] = useState("");
	const [f20name, setF20Name] = useState(null);
	const [f21name, setF21Name] = useState(null);
	const [f23name, setF23Name] = useState(null);

	const [rfpname, setRFPName] = useState(null);
	const [othername, setOtherName] = useState(null);
	const [coiname, setCoiName] = useState(null);

	const [formData, setFormData] = useState({
		project_name: "",
		earthood_id: "",
		client_id: "",
		country: "",
		program: "",
		program_id: "",
		implemented_fees: "",
		created_at: "",
		scope: [],
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
	// console.log("selected console log: ", selected);

	useEffect(() => {
		if (location.state && location.state.data) {
			const { data } = location.state;
			console.log("abhishek data", data);
			setProjectId(data.id);
			const scopes = data.scope.split(",").map(Number);
			// console.log(scopes);
			const filteredScopes = myscope.filter((scope) =>
				scopes.includes(scope.value),
			);
			setSelected(filteredScopes);
			// console.log(filteredScopes);

			// console.log("Hello filtered scopes", filteredScopes);

			setFormData({
				project_name: data.project_name,
				earthood_id: data.earthood_id,
				client_id: data.client_id,
				country: data.country,
				program: data.program,
				program_id: data.program_id,
				implemented_fees: data.implemented_fees,
				created_at: data.proposal_date,
				scope: selected,
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

			// console.log("Hello from abhishek", formData);
		}
	}, [location, myscope]);

	const CONFIG_Token = {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + sessionStorage.getItem("token"),
		},
	};

	const CONFIG_Token2 = {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: "Bearer " + sessionStorage.getItem("token"),
		},
	};

	const handleMyProjectChange = (event) => {
		const { value } = event.target;
		setMyProjectName(value);

		if (value.length < 3 || value.length > 40 || !isNaN(value)) {
			setError(
				"Project Name must be in alphabatic characters with 3 to 40 characters",
			);
		} else {
			setError("");
		}
		setFormData({ ...formData, project_name: event.target.value });
	};

	const handleEarthoodIdChange = (event) => {
		const value = event.target.value;
		setEarthoodId(value);

		if (!/^[a-zA-Z0-9]{3,40}$/.test(value)) {
			setEarthoodIdError(
				"Earthood Id must be alphanumeric and between 3 to 40 characters",
			);
		} else {
			setEarthoodIdError("");
		}
		setFormData({ ...formData, earthood_id: event.target.value });
	};

	const handleProgramIdChange = (event) => {
		const value = event.target.value;
		setProgramId(value);

		if (!/^[a-zA-Z0-9]{3,40}$/.test(value)) {
			setProgramIdError(
				"Earthood Id must be alphanumeric and between 3 to 40 characters",
			);
		} else {
			setProgramIdError("");
		}
		setFormData({ ...formData, program_id: event.target.value });
	};

	const handleFeesChange = (event) => {
		const value = event.target.value;

		setFees(value);

		if (value < 1 || value > 999999999999 || !/^\d+$/.test(value)) {
			setFeesError(
				"Implementation Fees must be a positive integer between 1 and 999,999,999,999.",
			);
		} else {
			setFeesError("");
		}
		setFormData({ ...formData, implemented_fees: event.target.value });
	};

	const handleDateChange = (e) => {
		const value = e.target.value;

		setProposalDate(value);

		const currentDate = new Date();
		const selectedDate = new Date(value);
		if (value === "" || isNaN(selectedDate.getTime())) {
			setProposalDateError("Please enter a valid date.");
		} else if (selectedDate > currentDate) {
			setProposalDateError("Proposal Date cannot be a future date.");
		} else {
			setProposalDateError("");
		}
		setFormData({ ...formData, created_at: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const scopeData = selected.map((value) => value.value);
		const payload = { ...formData, proposal_id: projectid, scope: scopeData };

		try {
			const response = await axios.post(
				`${pt_proposal_team_url}`,
				payload,
				CONFIG_Token,
			);
			setProjectId(response.data.project_id);
			if (!response.data.status) {
				toast.error(response.data.message);
			} else if (
				error ||
				earthoodIdError ||
				programIdError ||
				feesError ||
				proposalDateError
			) {
				toast.error("Data is not filled correctly in every field");
			} else {
				toast.success("Form Submitted Successfully");
				setActiveTab("2");
			}
		} catch (error) {
			console.error("Error saving data:", error);
		}
	};

	const handleBackToTab1 = () => {
		setActiveTab("1");
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

				setMyScope(
					responsescope.data.data.map((scope) => ({
						value: scope.id,
						label: scope.sector_name,
					})),
				);
				// console.log("Scope list", responsescope.data.data);
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

	const handleDropF20 = (file) => {
		// e.preventDefault();
		// const droppedFile = e.dataTransfer.files[0];
		setF20Name(file);
	};

	const handleDropRfp = (file) => {
		console.log(file);
		// e.preventDefault();
		// const droppedFile = e.dataTransfer.files[0];
		setRFPName(file);
	};

	const handleDropF21 = (file) => {
		// e.preventDefault();
		// const droppedFile = e.dataTransfer.files[0];
		setF21Name(file);
	};

	const handleDropF23 = (file) => {
		// e.preventDefault();
		// const droppedFile = e.dataTransfer.files[0];
		setF23Name(file);
	};

	const handleDropCoi = (file) => {
		// e.preventDefault();
		// const droppedFile = e.dataTransfer.files[0];
		setCoiName(file);
	};

	const handleDropOther = (file) => {
		// e.preventDefault();
		// const droppedFile = e.dataTransfer.files[0];
		setOtherName(file);
	};

	const handleFileF20Change = (file) => {
		// const selectedFile = e.target.files[0];
		setF20Name(file);
	};

	const handleFileRFPChange = (file) => {
		// const selectedFile = e.target.files[0];
		console.log(file);
		setRFPName(file);
	};

	const handleFileF21Change = (file) => {
		// const selectedFile = e.target.files[0];
		setF21Name(file);
	};

	const handleFileF23Change = (file) => {
		// const selectedFile = e.target.files[0];
		setF23Name(file);
	};

	const handleFileCOIChange = (file) => {
		// const selectedFile = e.target.files[0];
		setCoiName(file);
	};

	const handleFileOtherChange = (file) => {
		// const selectedFile = e.target.files[0];
		setOtherName(file);
		console.log(othername);
	};

	const handleSubmitFiles = async (e) => {
		e.preventDefault();

		try {
			const formData = new FormData();
			formData.append("f20_doc", f20name[0]);
			formData.append("f21_doc", f21name[0]);
			formData.append("f23_doc", f23name[0]);
			formData.append("rfp_doc", rfpname[0]);
			formData.append("coi_doc", coiname[0]);
			formData.append("other_doc", othername);

			formData.append("proposal_id", projectid);

			const response = await axios.post(
				`${pt_proposal_submit_url}`,
				formData,
				CONFIG_Token2,
			);

			console.log(formData);

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

	return (
		<>
			<Header />
			<div className="container-fluid">
				<div className="row">
					<div className="col-12">
						<h2 className="text-center textcolorblue fw-bolder p-2 text-capitalize my-5">
							Proposal Details
						</h2>
						<Tabs
							defaultActiveKey="1"
							activeKey={activeTab}
							// centered
							className="mx-3"
							indicator={{ Backgroundcolor: "#07B6AF" }}
							// size="large"
						>
							<Tabs.TabPane
								tab={
									<div className="border-0 textlightgreen rounded-0 px-3 py-2 text-center borderlightgreen">
										<p className="fs-lg-4 fs-md-5 fs-6">Proposal Details</p>
									</div>
								}
								key="1"
							>
								<form onSubmit={handleSubmit} method="POST">
									<div className="col-12 border-0 p-5 mx-auto">
										<div className="row">
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label htmlFor="projectname" className="form-label lightgreen">
													Proposal Name<span style={{ color: "red" }}>*</span>
												</label>
												<input
													type="text"
													className={`form-control borderlightgreen ${
														error ? "is-invalid" : ""
													}`}
													id="project_name"
													placeholder="Project Name"
													required
													name="project_name"
													value={formData.project_name}
													onChange={handleMyProjectChange}
												/>
												{error && (
													<div className="error text-danger">{error}</div>
												)}
											</div>
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label htmlFor="eid" className="form-label lightgreen">
													Earthood Id<span style={{ color: "red" }}>*</span>
												</label>
												<input
													type="text"
													className={`form-control borderlightgreen ${
														earthoodIdError ? "is-invalid" : ""
													}`}
													id="earthood_id"
													placeholder="Earthood Id"
													name="earthood_id"
													required
													value={formData.earthood_id}
													onChange={handleEarthoodIdChange}
												/>
												{earthoodIdError && (
													<div className="invalid-feedback text-danger">
														{earthoodIdError}
													</div>
												)}
											</div>
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label htmlFor="clientname" className="form-label lightgreen">
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
															Select Client Name
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
										{}
										<div className="row">
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label
													htmlFor="country"
													className="form-label lightgreen"
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
															Select Country
														</option>
														{country.map((option) => (
															<option key={option.id} value={option.id}>
																{option.name}
															</option>
														))}
													</select>
												)}
											</div>
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label htmlFor="Program" className="form-label lightgreen">
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
															Select Program
														</option>
														{program.map((option) => (
															<option key={option.id} value={option.id}>
																{option.program_name}
															</option>
														))}
													</select>
												)}
											</div>
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label htmlFor="Program Id" className="form-label lightgreen">
													Program Id<span style={{ color: "red" }}>*</span>
												</label>
												<input
													type="text"
													id="program_id"
													placeholder="Program Id"
													required
													name="program_id"
													className={`form-control borderlightgreen ${
														programIdError ? "is-invalid" : ""
													}`}
													value={formData.program_id}
													onChange={handleProgramIdChange}
												/>
												{programIdError && (
													<div className="invalid-feedback text-danger">
														{programIdError}
													</div>
												)}
											</div>
										</div>
										{}
										<div className="row">
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label
													htmlFor="Implementation Fees"
													className="form-label lightgreen"
												>
													Implementation Fees
													<span style={{ color: "red" }}>*</span>
												</label>
												<input
													type="number"
													className={`form-control borderlightgreen ${
														feesError ? "is-invalid" : ""
													}`}
													id="implemented_fees"
													placeholder="Implementation Fees"
													required
													name="implemented_fees"
													value={formData.implemented_fees}
													onChange={handleFeesChange}
												/>
												{feesError && (
													<div className="invalid-feedback text-danger">
														{feesError}
													</div>
												)}
											</div>
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label htmlFor="Proposal Date" className="form-label lightgreen">
													Proposal Date<span style={{ color: "red" }}>*</span>
												</label>
												<input
													type="date"
													className={`form-control borderlightgreen ${
														proposalDateError ? "is-invalid" : ""
													}`}
													id="proposaldate"
													required
													name="created_at"
													value={formData.created_at}
													onChange={handleDateChange}
												/>
												{proposalDateError && (
													<div className="invalid-feedback">
														{proposalDateError}
													</div>
												)}
											</div>
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label htmlFor="Scope(PO/POA)" className="form-label lightgreen ">
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
													<option selected>Select Scope PO/POA</option>
													<option value={1}>PO</option>
													<option value={2}>POA</option>
												</select>
											</div>
										</div>

										<div className="row">
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<div>
													<label
														htmlFor="Sectoral Scope"
														className="form-label lightgreen"
													>
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
															Select Sectoral Scope
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

											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label htmlFor="Scope" className="form-label lightgreen">
													Scope<span style={{ color: "red" }}>*</span>
												</label>

												{loading ? (
													<p>Loading...</p>
												) : (
													<MultiSelect
														options={myscope}
														value={selected}
														onChange={setSelected}
														labelledBy="Select"
													/>
												)}
											</div>

											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<div>
													<label
														htmlFor="Sectoral Scope"
														className="form-label lightgreen"
													>
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
																Select SBU Head
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

										<p className="textlightgreen fw-bold my-3 fs-5">
											Assessment Team
										</p>
										<hr className="mb-5 lightgreen"/>
										<div className="row">
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label htmlFor="teamleader" className="form-label lightgreen">
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
															Select Team Leaders
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
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label htmlFor="taexpert" className="form-label lightgreen">
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
															Select TA Expert
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
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label htmlFor="teamleader" className="form-label lightgreen">
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
														required
														value={formData.local_expert}
														onChange={(e) =>
															setFormData({
																...formData,
																local_expert: e.target.value,
															})
														}
													>
														<option selected value={""}>
															Select Local Experts
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
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label htmlFor="financeexpert" className="form-label lightgreen">
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
															Select Finance Experts
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
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label htmlFor="validator" className="form-label lightgreen">
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
															Select Validator
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

											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label htmlFor="methexpert" className="form-label lightgreen">
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
															Select Math Expert
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
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label htmlFor="taexpert" className="form-label lightgreen">
													Trainee Validator/Verifier
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
															Select Trainee Validators/Verifier
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
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label
													htmlFor="technicalreviewer"
													className="form-label lightgreen"
												>
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
															Select Technical Reviewer
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
											<div className="col-lg-4 col-md-4 col-12 mb-3">
												<label
													htmlFor="technicalreviewer"
													className="form-label lightgreen"
												>
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
															Select Expert to Technical Reviewer
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
											<div className="col-12 d-flex justify-content-end">
												<button
													type="submit"
													className="btn btn-success mt-5" 
												>
													Save & Next
												</button>
											</div>
										</div>
									</div>
								</form>
							</Tabs.TabPane>
							<Tabs.TabPane
								tab={
									<div className="border-0 textlightgreen rounded-0 px-3 py-2 text-center">
										<p className="fs-lg-4 fs-md-5 fs-6">Attachment</p>
									</div>
								}
								key="2"
							>
								<div className="container">
									<div className="row">
									<div className="col-12 border-0 p-5 mx-auto">
									<form
										onSubmit={handleSubmitFiles}
										method="POST"
										encType="multipart/form-data"
									>
										<table className="table table-bordered table-responsive table-hover">
											<thead>
												<tr>
													<th className="text-center lightgreen p-3 fw-bolder fs-5">Document name </th>
													<th className="text-center lightgreen p-3 fw-bolder fs-5">Select File</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td className="text-center lightgreen p-3">RFP Document</td>
													<td className="p-3">
														
														<FileUploader
															handleChange={handleFileRFPChange}
															// onDrop={handleDropRfp}
															name="rfp_doc"
															types={fileTypes}
															multiple="false"
															// required
														/>
														<span>
															{rfpname && `File name: ${rfpname[0].name}`}
														</span>
													</td>
												</tr>
												<tr>
													<td className="text-center lightgreen p-3">F20 Document</td>
													<td className="p-3">
														
														<FileUploader
															handleChange={handleFileF20Change}
															name="f20_doc"
															types={fileTypes}
															multiple="false"
															// required
														/>
														<span>
															{f20name && `File name: ${f20name[0].name}`}
														</span>
													</td>
												</tr>
												<tr>
													<td className="text-center lightgreen p-3">F21 Document</td>
													<td className="p-3">
														
														<FileUploader
															handleChange={handleFileF21Change}
															name="f21_doc"
															types={fileTypes}
															multiple="false"
															// required
														/>
														<span>
															{f21name && `File name: ${f21name[0].name}`}
														</span>
													</td>
												</tr>
												<tr>
													<td className="text-center lightgreen p-3">F23 Document</td>
													<td className="p-3">
														
														<FileUploader
															handleChange={handleFileF23Change}
															name="f23_doc"
															types={fileTypes}
															multiple="false"
															// required
														/>
														<span>
															{f23name && `File name: ${f23name[0].name}`}
														</span>
													</td>
												</tr>
												<tr>
													<td className="text-center lightgreen p-3">COI Document</td>

													<td className="p-3">
													
														<FileUploader
															handleChange={handleFileCOIChange}
															name="coi_doc"
															types={fileTypes}
															multiple="false"
															// required
														/>
														<span>
															{coiname && `File name: ${coiname[0].name}`}
														</span>
													</td>
												</tr>

												<tr>
													<td className="text-center lightgreen p-3">Other Documents</td>

													<td className="p-3">
														
														<FileUploader
															handleChange={handleFileOtherChange}
															name="other_doc"
															types={fileTypes}
															// multiple={true}
															// required
														/>
														<span>
															{othername && `File name: ${othername[0].name}`}
														</span>
													</td>
												</tr>
											</tbody>
										</table>
										<div className="col-12 d-flex justify-content-end gap-3">
										<button
											onClick={handleBackToTab1}
											className="btn btn-success mt-5"
										>
											Previous
										</button>
										<button
											// style={{ marginLeft: "10px" }}
											type="submit"
											className="btn btn-success mt-5"
										>
											Save
										</button>
										</div>
										
									</form>
								</div>
									</div>
								</div>
							
							</Tabs.TabPane>
						</Tabs>
					</div>
				</div>
			</div>
		</>
	);
};

export default AddProject;

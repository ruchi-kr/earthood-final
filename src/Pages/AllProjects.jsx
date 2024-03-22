import { EditOutlined } from "@ant-design/icons";
import { Table, Tag } from "antd";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_HEADER, get_all_propoposal_url } from "../config";
import { get_proposal_detail_url } from "../config";
import Header from "./Header";

const AllProjects = () => {
	const [dataSource, setDataSource] = useState([]);
	const [loadData, setloadData] = useState(false);

	const navigate = useNavigate();

	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
		total: 0,
	});

	const handleTableChange = (pagination, filters, sorter) => {
		setPagination(pagination);
		setloadData(true);
	};

	const editForm = async (record) => {
		const payload = {
			proposal_id: record.proposal_id,
		};

		const response = await axios.post(
			`${get_proposal_detail_url}`,
			payload,
			API_HEADER,
		);
		const data = response.data.record;
		// console.log(data)

		navigate("/projects", { state: { data } });
	};

	const columns = [
		{
			title: (
				<span className="text-capitalize textcolumntitle font14px fw-bold">
					S.No
				</span>
			),
			dataIndex: "proposal_id",
			fixed: "left",
			width: 80,
			render: (text, record, index) => {
				const pageIndex = (pagination.current - 1) * pagination.pageSize;
				return pageIndex + index + 1;
			},
		},
		{
			title: (
				<span className="text-capitalize textcolumntitle font14px fw-bold">
					EID
				</span>
			),
			fixed: "left",
			dataIndex: "earthood_id",
		},
		{
			title: (
				<span className="text-capitalize textcolumntitle font14px fw-bold">
					Project Name
				</span>
			),
			dataIndex: "project_name",
		},
		{
			title: (
				<span className="text-capitalize textcolumntitle font14px fw-bold">
					Client Name
				</span>
			),
			dataIndex: "client_name",
		},
		{
			title: (
				<span className="text-capitalize textcolumntitle font14px fw-bold">
					Status
				</span>
			),
			dataIndex: "status_msg",
			render: (text, record) => {
				let color = "green";
				let msg = "";
				if (record.status == 0) {
					msg = "Pending";
					color = "yellow";
				} else if (record.status == 1) {
					msg = "Proposal Submitted";
				} else if (record.status == 2) {
					msg = "Rejected";
				} else if (record.status == 3) {
					msg = "Clarification Required";
					color = "volcano";
				} else if (record.status == 4) {
					msg = "Resubmit";
					color = "volcano";
				} else if (record.status == 5) {
					msg = "Approved";
				} else if (record.status == 6) {
					msg = "Forwarded to Sales";
					color = "blue";
				} else if (record.status == 7) {
					msg = "Forwarded to Client";
					color = "blue";
				} else if (record.status == 8) {
					msg = "Signed Contract Uploaded";
				} else {
					msg = record.status;
				}

				return (
					<Tag className="px-4 py-2 rounded-5 font12px fw-bold" color={color}>
						{msg}
					</Tag>
				);
			},
		},
		{
			title: (
				<span className="text-capitalize textcolumntitle font14px fw-bold">
					Action
				</span>
			),
			dataIndex: "",
			key: "x",
			fixed: "right",
			width: 130,
			render: (record) => (
				<a className="">
					{" "}
					<EditOutlined
						style={{ marginRight: "8px", color: "blue" }}
						onClick={() => editForm(record)}
					/>{" "}
				</a>
			),
		},
	];

	const allData = async () => {
		try {
			let payload = {
				status: "",
				page: pagination.current,
				limit: pagination.pageSize,
			};

			const response = await axios.post(
				`${get_all_propoposal_url}`,
				payload,
				API_HEADER,
			);
			setDataSource(response.data.data);
			setloadData(false);

			setPagination((prevPagination) => ({
				...prevPagination,
				total: response.data.count,
			}));
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
		}
	};

	useEffect(() => {
		allData();
	}, [loadData]);

	return (
		<>
			<Header />

			<div className="container-fluid">
				<div
					style={{
						justifyContent: "center",
						backgroundColor: "#F8F9F9 ",
						height: "100vh",
					}}
				>
					<h5
						style={{
							textAlign: "center",
							padding: "10px",
							marginBottom: "10px",
						}}
					>
						All Proposals
					</h5>

					<div>
						<div className="row mx-4">
							<Table
								style={{ width: "100%", height: "100%" }}
								columns={columns}
								dataSource={dataSource}
								rowKey="proposal_id"
								pagination={pagination}
								onChange={handleTableChange}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AllProjects;

import { Space, Table, Tag } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_HEADER, proposal_summary_url } from "../config";
const columns = [
	{
		title: "S.No.",
		dataIndex: "id",
		key: "id",
		render: (text) => <a>{text}</a>,
	},
	{
		title: "User",
		dataIndex: "action_by",
		key: "action_by",
	},

	{
		title: "Status",
		key: "status",
		dataIndex: "status",
		render: (_, { status }) => (
			<Tag color={"green"} key={status}>
				{status}
			</Tag>
		),
	},
	{
		title: "Remarks",
		dataIndex: "remarks",
		key: "remarks",
	},

	{
		title: "Date",
		dataIndex: "created_at",
		key: "created_at",
	},
];

const Summary = ({ proposalId }) => {
	const [summaryData, setSummaryData] = useState([]);
	useEffect(() => {
		const fetchSummary = async () => {
			try {
				const response = await axios.post(
					proposal_summary_url,
					{
						proposal_id: proposalId,
					},
					API_HEADER,
				);
				setSummaryData(response.data.record);
			} catch (error) {
				console.log(error);
			}
		};

		fetchSummary();
	}, [proposalId]);

	return <Table scroll={{ x: 1500 }} columns={columns} dataSource={summaryData} />;
};
export default Summary;

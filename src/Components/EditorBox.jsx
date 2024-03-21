import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Button, Input } from 'antd';
import axios from 'axios';
import {
    API_HEADER
  } from "../config";
import { get_sales_action_url } from '../config';

const { Dragger } = Upload;

const App = () => {
  const [projectid, setProjectId] = useState('');
  const [contractremarks, setContractRemarks] = useState('');
  const handleContractRemarksChange = (e) => {
    setContractRemarks(e.target.value);
  };

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

  return (
    <div>
      <Dragger
        className='col-6 mt-3 mb-5'
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
      </Dragger>
      <Input.TextArea 
        placeholder="Enter Contract Remarks" 
        value={contractremarks} 
        onChange={handleContractRemarksChange} 
      />
    </div>
  );
};

export default App;

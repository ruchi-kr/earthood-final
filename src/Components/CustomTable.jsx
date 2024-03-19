import { Input, Table } from 'antd'
import React from 'react'

export default function CustomTable(props) {
  return (
   <>
    <div className='container'>
      <div className="row">
        <div className="col-12 border-2 border border-light-subtle p-0 rounded-3">
          <div className="d-flex justify-content-end align-items-center p-2 bg-white border-0 shadow-sm rounded-top-3">
            <div>
              <Input.Search />
            </div>
          </div>
          <Table  columns={props.columns} dataSource={props.data}  rowKey='id'  pagination={props.pagination}
            onChange={props.handleTableChange}/>
        </div>
      </div>
    </div>
   </>
  )
}

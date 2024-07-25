import React, { useState } from 'react'
import { Button, Col, Input, Row, Space, Table, TableProps } from 'antd'
// import axios from 'axios'

interface DataType {
  name: string;
  age: number;
  address: string;
  tags: string[];
  key: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a href="www">{text}</a>
  },
  {
    title: 'SSN',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Work Authorization Title',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Phone Number',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Email',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Operation',
    key: 'action',
    render: (_) => (
      <Space size="middle">
        <a href="22">View</a>
      </Space>
    )
  }
]
const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
]

const Home = () => {
  return (
    <div>
      <Row style={{ margin: '15px -10px' }} gutter={20}>
        <Col span={6}>
          <Input placeholder="Please enter the name"></Input>
        </Col>
        <Col span={6}>
          <Button type="primary">Search</Button>
        </Col>
      </Row>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}
export default Home

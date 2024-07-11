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
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a href="www">{text}</a>
  },
  {
    title: '社会保险号',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '工作授权头衔',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '电话号码',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '电子邮箱',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a href="22">查看</a>
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
          <Input placeholder="请输入姓名"></Input>
        </Col>
        <Col span={6}>
          <Button type="primary">查询</Button>
        </Col>
      </Row>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}
export default Home

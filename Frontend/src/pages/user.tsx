import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Input, message, Row, Space, Table, TableProps } from 'antd'
import axios from 'axios'

import { DataType, IResult, IQuery } from '../type';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const history = useNavigate()
  const [list, setList] = useState<DataType[]>([])
  const queryRef = useRef<IQuery>({})
  const [load, setLoad] = useState<boolean>(true)

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => <Button type="link" onClick={() => {
        history(`/user/info/${record._id}`)
      }}>{record?.user?.middleName}</Button>
    },
    {
      title: '社会保险号',
      dataIndex: 'ssn',
      key: 'ssn',
      render: (_, record) => {
        return `${record?.user?.ssn || '-'}`
      }
    },
    {
      title: '工作授权头衔',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => {
        return `${record?.user?.workAuthorization?.title || '-'}`
      }
    },
    {
      title: '电话号码',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => {
        return `${record?.user?.contactInfo?.cellPhone || '-'}/${record?.user?.contactInfo?.workPhone || '-'}`
      }
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (_, record) => {
        return `${record?.user?.email}`
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => {
            history(`/user/info/${record._id}`)
          }}>查看</Button>

        </Space>
      )
    }
  ]

  useEffect(() => {
    if (!load) return
    axios
      .post('http://localhost:8088/Record/List', {
        page: 1,
        size: 10,
        ...queryRef.current
      })
      .then(({ data }: IResult & { data: { data: { list: any[] } } }) => {
        if (data.Code === 200) {
          setList(data.data.list)
          setLoad(false)
        } else {
          message.error(data.Msg)
        }
      })
  }, [load])
  return (
    <div>
      <Row style={{ margin: '15px -10px' }} gutter={20}>
        <Col span={4}>
          <Input placeholder="firstName" onChange={val => {
            queryRef.current.firstName = val.target.value
          }}></Input>
        </Col>
        <Col span={4}>
          <Input placeholder="lastName" onChange={val => {
            queryRef.current.lastName = val.target.value
          }}></Input>
        </Col>
        <Col span={4}>
          <Input placeholder="preferredName" onChange={val => {
            queryRef.current.preferredName = val.target.value
          }}></Input>
        </Col>
        <Button type="primary" onClick={() => {
          setLoad(true)
        }}>查询</Button>
      </Row>
      <Table columns={columns} dataSource={list} />
    </div>
  )
}
export default Home

import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Input, message, Row, Space, Table, TableProps } from 'antd'
import axios from 'axios'

import { UserDataType, IResult, IQuery } from '../type';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const history = useNavigate()
  const [list, setList] = useState<UserDataType[]>([])
  const queryRef = useRef<IQuery>({})
  const [load, setLoad] = useState<boolean>(true)

  const columns: TableProps<UserDataType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => <Button type="link" onClick={() => {
        history(`/user/info/${record._id}`)
      }}>{record?.preferredName}</Button>
    },
    {
      title: 'SSN',
      dataIndex: 'ssn',
      key: 'ssn',
      render: (_, record) => {
        return `${record?.ssn || '-'}`
      }
    },
    {
      title: 'Work Authorizaiton Title',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => {
        return `${record?.workAuthorization?.title || '-'}`
      }
    },
    {
      title: 'Phone number',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => {
        return `${record?.contactInfo?.cellPhone || '-'}/${record?.contactInfo?.workPhone || '-'}`
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (_, record) => {
        return `${record?.email}`
      }
    },
    {
      title: 'Operation',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => {
            history(`/user/info/${record._id}`)
          }}>Search</Button>

        </Space>
      )
    }
  ]

  useEffect(() => {
    if (!load) return

    axios
      .post('http://localhost:8088/Employee/List', {

        ...queryRef.current
      })
      .then(({ data }: IResult & { data: { data: any[] } }) => {
        if (data.Code === 200) {
          setList(data.data)
          setLoad(false)
        } else {
          message.error(typeof data.Msg === 'string' ? data.Msg : 'Unknwon Server error')
        }
      }).catch(() => {
        //
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
        }}>Search</Button>
      </Row>
      <Table columns={columns} dataSource={list} rowKey="_id" />
    </div>
  )
}
export default Home

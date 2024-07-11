import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Col,
  Input,
  Row,
  Space,
  Table,
  Modal,
  Form,
  Radio,
  Tag,
  Popconfirm,
  TableProps,
  RadioChangeEvent,
  FormProps,
  message
} from 'antd'
import axios from 'axios'
import { DataType, IResult, currentVisaStepEnum, IQuery } from '../type';


const currentVisaStepText = {
  not_started: '未注册',
  receipt: 'OPT收据阶段',  // OPT收据阶段
  ead_card: 'EAD卡阶段',  // EAD卡阶段
  i983: 'I-983表格阶段',  // I-983表格阶段
  i20: 'I-20表格阶段',  // I-20表格阶段
  complete: '完成所有步骤'  // 完成所有步骤
}


const options = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '待审查',
    value: '3'
  },
  {
    label: '已批准',
    value: '8'
  },
  {
    label: '已拒绝',
    value: '9'
  }
]
const Home = () => {
  const [status, setStatus] = useState<string>('')
  const userId = useRef<string>()
  const queryRef = useRef<IQuery>({})
  const [load, setLoad] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isRefuseOpen, setIsRefuseOpen] = useState<boolean>(false)
  const [list, setList] = useState<DataType[]>([])
  const [form] = Form.useForm()
  const [refuseForm] = Form.useForm()
  const { TextArea } = Input
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        return `${record?.user?.middleName}`
      }
    },

    {
      title: '电子邮件',
      dataIndex: 'email',
      key: 'email',
      render: (_, record) => {
        return record?.user?.email
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (_, record) => {
        return <Tag color="magenta">
          {currentVisaStepText[record?.onboardingStatus?.currentStep as currentVisaStepEnum]}
          {record?.onboardingStatus?.currentStep === currentVisaStepEnum.NOT_STARTED ? '' : ''}
        </Tag>

      }
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="link"
          >
            查看申请
          </Button>
          {record?.onboardingStatus?.currentStep !== currentVisaStepEnum.NOT_STARTED ? (
            <>
              <Popconfirm
                title="提示"
                description="确定要通过审批吗?"
                okText="确定"
                onConfirm={() => {
                  axios
                    .post('http://localhost:8088/apply/agree', {
                      userId: record._id
                    })
                    .then(({ data }: IResult) => {
                      if (data.Code === 200) {
                        setLoad(true)
                      } else {
                        message.error(data.Msg)
                      }
                    })
                }}
                cancelText="取消"
              >
                <Button type="link">同意</Button>
              </Popconfirm>

              <Button
                type="link"
                danger
                onClick={() => {
                  userId.current = record._id
                  setIsRefuseOpen(true)
                }}
              >
                拒绝
              </Button>
            </>
          ) : null}
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

  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
  }
  const handleRefuseOk = () => {
    refuseForm.submit()
  }
  const handleRefuseCancel = () => {
    refuseForm.resetFields()
    setIsRefuseOpen(false)
  }
  const onFinish: FormProps<{
    email: string, firstName: string, lastName: string, preferredName: string
  }>['onFinish'] = ({ email, firstName, lastName, preferredName }) => {
    axios
      .post('http://localhost:8088/User/register', {
        account: email,
        firstName,
        lastName,
        preferredName
      })
      .then(({ data }: IResult) => {
        if (data.Code === 200) {
          handleCancel()
        } else {
          message.error(data.Msg)
        }
      })

  }
  const onRefuseFinish: FormProps<{ refuse: string }>['onFinish'] = ({ refuse }) => {

    axios
      .post('http://localhost:8088/apply/refuse', {
        refuse,
        userId: userId.current
      })
      .then(({ data }: IResult) => {
        if (data.Code === 200) {
          handleRefuseCancel()
        } else {
          message.error(data.Msg)
        }
      })

  }
  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setStatus(value)
  }
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
        <Col span={6}>
          <Button type="primary" onClick={() => {
            setLoad(true)
          }}>查询</Button>
          <Button
            type="primary"
            style={{ margin: '0 10px' }}
            onClick={() => {
              setIsModalOpen(true)
            }}
          >
            生成注册令牌
          </Button>
        </Col>
      </Row>
      <Radio.Group
        options={options}
        onChange={onChange}
        value={status}
        optionType="button"
        style={{ marginBottom: 20 }}
        buttonStyle="solid"
      />
      <Table columns={columns} dataSource={list} key="_id" />
      <Modal
        title="生成注册令牌"
        open={isModalOpen}
        onOk={handleOk}
        cancelText="取消"
        okText="确定"
        onCancel={handleCancel}
      >
        <Form form={form} style={{ margin: '20px 0' }} onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: 'email',
                message: '请输入合法的邮箱地址！'
              },
              { required: true, message: 'Please input your email!' }
            ]}
          >
            <Input placeholder="input Email" />
          </Form.Item>

          <Form.Item
            label="firstName"
            name="firstName"
            rules={[
              { required: true, message: 'Please input your firstName!' }
            ]}
          >
            <Input placeholder="input firstName" />
          </Form.Item>
          <Form.Item
            label="lastName"
            name="lastName"
            rules={[
              { required: true, message: 'Please input your lastName!' }
            ]}
          >
            <Input placeholder="input lastName" />
          </Form.Item>
          <Form.Item
            label="preferredName"
            name="preferredName"
            rules={[
              { required: true, message: 'Please input your preferredName!' }
            ]}
          >
            <Input placeholder="input preferredName" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="拒绝原因"
        open={isRefuseOpen}
        cancelText="取消"
        okText="确定"
        onOk={handleRefuseOk}
        onCancel={handleRefuseCancel}
      >
        <Form
          form={refuseForm}
          style={{ margin: '20px 0' }}
          onFinish={onRefuseFinish}
        >
          <Form.Item
            label="拒绝原因"
            name="refuse"
            rules={[{ required: true, message: 'Please input your Refuse!' }]}
          >
            <TextArea
              placeholder="拒绝原因"
              autoSize={{
                minRows: 3,
                maxRows: 5
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default Home

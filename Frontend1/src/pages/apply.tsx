import React, { useEffect, useRef, useState } from 'react';
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
  message,
  List,
  Steps
} from 'antd';
import axios from 'axios';
import { DataType, IResult, currentVisaStepEnum, IQuery, visaStepStatusEnum, VisaStepEnum, IOnboardingStatus } from '../type';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';

const currentVisaStepText = {
  not_started: '入职申请阶段',
  receipt: 'OPT收据阶段',
  ead_card: 'EAD卡阶段',
  i983: 'I-983表格阶段',
  i20: 'I-20表格阶段',
  complete: '完成所有步骤'
}
const currentVisaStepMap = {
  receipt: 'receiptStatus',
  ead_card: 'eadCardStatus',
  i983: 'i983Status',
  i20: 'i20Status',
}

const options = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '待审查',
    value: 'submitted'
  },
  {
    label: '已批准',
    value: 'approved'
  },
  {
    label: '已拒绝',
    value: 'rejected'
  }
]

const Home = () => {
  const [status, setStatus] = useState<string>('')
  const recordId = useRef<string>()
  const queryRef = useRef<IQuery>({})
  const currentStepStatus = useRef<string>('')
  const [current, setStepCurrent] = useState<number>(0)
  const [load, setLoad] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isRefuseOpen, setIsRefuseOpen] = useState<boolean>(false)
  const [list, setList] = useState<DataType[]>([])
  const [isStepOpen, setIsStepOpen] = useState<boolean>(false)

  const [form] = Form.useForm()
  const [refuseForm] = Form.useForm()
  const { TextArea } = Input

  const handleDownload = async (id: string, name: string) => {
    try {
      const response = await axios.get(`http://localhost:8088/Files/download/${id}`, {
        responseType: 'blob',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name.endsWith('.pdf') ? name : `${name}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      message.error('Download failed');
    }
  };

  const handlePreview = (id: string, name: string) => {
    const fileUrl = `http://localhost:8088/Files/preview/${id}?name=${encodeURIComponent(name.endsWith('.pdf') ? name : `${name}.pdf`)}`;
    window.open(fileUrl, '_blank');
  };


  const columns: TableProps<DataType>['columns'] = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        return `${record?.user?.preferredName}`
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
      title: 'RECEIPT',
      dataIndex: 'RECEIPT',
      key: 'RECEIPT',
      render: (_, record) => (
          <List
              // @ts-ignore
              dataSource={record?.documents?.RECEIPT}
              renderItem={item => (
                  <List.Item
                      actions={[
                        <Button icon={<DownloadOutlined />} onClick={
                          // @ts-ignore
                          () => handleDownload(item.id, item.name)}>Download</Button>,
                        <Button icon={<EyeOutlined />} onClick={
                          // @ts-ignore
                          () => handlePreview(item.id, item.name)}>Preview</Button>
                      ]}
                  >
                    {// @ts-ignore
                      item.name}
                  </List.Item>
              )}
          />
      )
    },
    {
      title: 'EAD_CARD',
      dataIndex: 'EAD_CARD',
      key: 'EAD_CARD',
      render: (_, record) => (
          <List
              // @ts-ignore
              dataSource={record?.documents?.EAD_CARD}
              renderItem={item => (
                  <List.Item
                      actions={[
                        <Button icon={<DownloadOutlined />} onClick={() => handleDownload(
                            // @ts-ignore
                            item.id, item.name)}>Download</Button>,
                        <Button icon={<EyeOutlined />} onClick={() => handlePreview(
                            // @ts-ignore
                            item.id, item.name)}>Preview</Button>
                      ]}
                  >
                    {
                        // @ts-ignore
                        item.name}
                  </List.Item>
              )}
          />
      )
    },
    {
      title: 'I983_FORM',
      dataIndex: 'I983_FORM',
      key: 'I983_FORM',
      render: (_, record) => (
          <List
              // @ts-ignore
              dataSource={record?.documents?.I983_FORM}
              renderItem={item => (
                  <List.Item
                      actions={[
                        <Button icon={<DownloadOutlined />} onClick={() => handleDownload(
                            // @ts-ignore
                            item.id, item.name)}>Download</Button>,
                        <Button icon={<EyeOutlined />} onClick={() => handlePreview(
                            // @ts-ignore
                            item.id, item.name)}>Preview</Button>
                      ]}
                  >
                    {
                        // @ts-ignore
                        item.name}
                  </List.Item>
              )}
          />
      )
    },
    {
      title: 'I20_FORM',
      dataIndex: 'I20_FORM',
      key: 'I20_FORM',
      render: (_, record) => (
          <List
              // @ts-ignore
              dataSource={record?.documents?.I20_FORM}
              renderItem={item => (
                  <List.Item
                      actions={[
                        <Button icon={<DownloadOutlined />} onClick={() => handleDownload(
                            // @ts-ignore
                            item.id, item.name)}>Download</Button>,
                        <Button icon={<EyeOutlined />} onClick={() => handlePreview(
                            // @ts-ignore
                            item.id, item.name)}>Preview</Button>
                      ]}
                  >
                    {
                        // @ts-ignore
                        item.name}
                  </List.Item>
              )}
          />
      )
    },
    {
      title: 'OTHERS',
      dataIndex: 'OTHERS',
      key: 'OTHERS',
      render: (_, record) => (
          <List
              // @ts-ignore
              dataSource={record?.documents?.OTHERS}
              renderItem={item => (
                  <List.Item
                      actions={[
                        <Button icon={<DownloadOutlined />} onClick={() => handleDownload(
                            // @ts-ignore
                            item.id, item.name)}>Download</Button>,
                        <Button icon={<EyeOutlined />} onClick={() => handlePreview(
                            // @ts-ignore
                            item.id, item.name)}>Preview</Button>
                      ]}
                  >
                    {
                        // @ts-ignore
                        item.name}
                  </List.Item>
              )}
          />
      )
    },
    {
      title: '当前阶段',
      dataIndex: 'step',
      key: 'step',
      width: 120,
      render: (_, record) => {
        return <Tag color="magenta">
          {currentVisaStepText[record?.onboardingStatus?.currentStep as currentVisaStepEnum]}
        </Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_, record) => {
        const key = currentVisaStepMap[record.onboardingStatus.currentStep as VisaStepEnum] as keyof IOnboardingStatus
        return <Tag color="magenta">
          {!key || record?.onboardingStatus['currentStep'] === 'complete' ? '已完成' :
              record?.onboardingStatus[key] === visaStepStatusEnum.NOT_SUBMITTED ? '未提交' : record?.onboardingStatus[key] === visaStepStatusEnum.SUBMITTED ? '已提交' : record?.onboardingStatus[key] === visaStepStatusEnum.APPROVED ? '已批准' : record?.onboardingStatus[key] === visaStepStatusEnum.REJECTED ? '已拒绝' : ''}
        </Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      render: (text, record) => {
        const { currentStep, receiptStatus, eadCardStatus, i983Status, i20Status } = record?.onboardingStatus ?? {}
        const show =
            (currentStep === currentVisaStepEnum.RECEIPT && receiptStatus === visaStepStatusEnum.SUBMITTED) ||
            (currentStep === currentVisaStepEnum.EAD_CARD && eadCardStatus === visaStepStatusEnum.SUBMITTED) ||
            (currentStep === currentVisaStepEnum.I983 && i983Status === visaStepStatusEnum.SUBMITTED) ||
            (currentStep === currentVisaStepEnum.I20 && i20Status === visaStepStatusEnum.SUBMITTED)

        return (
            <Space size="middle">
              <Button
                  type="link"
                  onClick={() => {
                    const step = record?.onboardingStatus?.currentStep
                    const key = currentVisaStepMap[record.onboardingStatus.currentStep as VisaStepEnum] as keyof IOnboardingStatus
                    const status = record?.onboardingStatus[key] === visaStepStatusEnum.NOT_SUBMITTED ? '未提交' : record?.onboardingStatus[key] === visaStepStatusEnum.SUBMITTED ? '已提交' : record?.onboardingStatus[key] === visaStepStatusEnum.APPROVED ? '已批准' : record?.onboardingStatus[key] === visaStepStatusEnum.REJECTED ? '已拒绝' : ''
                    if (step === currentVisaStepEnum.NOT_STARTED) {
                      setStepCurrent(0)
                    } else if (step === currentVisaStepEnum.RECEIPT) {
                      setStepCurrent(1)
                    } else if (step === currentVisaStepEnum.EAD_CARD) {
                      setStepCurrent(2)
                    } else if (step === currentVisaStepEnum.I983) {
                      setStepCurrent(3)
                    } else if (step === currentVisaStepEnum.I20) {
                      setStepCurrent(4)
                    } else if (step === currentVisaStepEnum.COMPLETE) {
                      setStepCurrent(5)
                    }
                    recordId.current = record._id
                    currentStepStatus.current = status as string
                    setIsStepOpen(true)
                  }}
              >
                查看申请
              </Button>
              {show ? (
                  <>
                    <Popconfirm
                        title="提示"
                        description="确定要通过审批吗?"
                        okText="确定"
                        onConfirm={() => {
                          axios
                              .post('http://localhost:8088/Record/agree', {
                                id: record._id
                              })
                              .then(({ data }: IResult) => {
                                if (data.Code === 200) {
                                  setLoad(true)
                                } else {
                                  message.error(typeof data.Msg === 'string' ? data.Msg : '服务器错误')
                                }
                              }).catch(() => {
                            //
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
                          recordId.current = record._id
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
    }
  ]

  useEffect(() => {
    if (!load) return
    axios
        .post('http://localhost:8088/Record/List', {
          ...queryRef.current,
          status
        })
        .then(({ data }: IResult & { data: { data: { list: any[] } } }) => {
          if (data.Code === 200) {
            setList(data.data.list)
            setLoad(false)
          } else {
            message.error(typeof data.Msg === 'string' ? data.Msg : '服务器错误')
          }
        }).catch(() => {
      //
    })
  }, [load, status])

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
  const handleStepCancel = () => {
    setIsStepOpen(false)
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
            message.error(typeof data.Msg === 'string' ? data.Msg : '服务器错误')
          }
        }).catch(() => {
      //
    })

  }
  const onRefuseFinish: FormProps<{ refuse: string }>['onFinish'] = ({ refuse }) => {
    axios
        .post('http://localhost:8088/Record/refuse', {
          feedback: refuse,
          id: recordId.current
        })
        .then(({ data }: IResult) => {
          if (data.Code === 200) {
            handleRefuseCancel()
            setLoad(true)
          } else {
            message.error(typeof data.Msg === 'string' ? data.Msg : '服务器错误')
          }
        }).catch(() => {
      //
    })

  }
  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setStatus(value)
    setLoad(true)
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
        <Table columns={columns} dataSource={list} rowKey="_id" />
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

        <Modal
            title="流程状态"
            open={isStepOpen}
            cancelText="取消"
            okText="确定"
            onOk={handleStepCancel}
            onCancel={handleStepCancel}
        >
          <Steps
              current={current}
              direction="vertical"
              style={{ padding: 20 }}
              items={[
                {
                  title: currentVisaStepText.not_started,
                  description: current === 0 ? currentStepStatus.current : '',
                },
                {
                  title: currentVisaStepText.receipt,
                  description: current === 1 ? currentStepStatus.current : '',
                },
                {
                  title: currentVisaStepText.ead_card,
                  description: current === 2 ? currentStepStatus.current : '',
                },
                {
                  title: currentVisaStepText.i983,
                  description: current === 3 ? currentStepStatus.current : '',
                },
                {
                  title: currentVisaStepText.i20,
                  description: current === 4 ? currentStepStatus.current : '',
                },
              ]}
          />
        </Modal>
      </div>
  )
}
export default Home
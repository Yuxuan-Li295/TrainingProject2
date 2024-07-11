import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Col,
  Input,
  Row,
  Space,
  Table,
  Radio,
  Tag,
  Popconfirm,
  RadioChangeEvent,
  TableProps,
  message
} from 'antd'
import axios from 'axios'
import { DataType, IResult, IQuery, currentVisaStepEnum, visaStepStatusEnum, visaStepNextEnum } from '../type';

const options = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '进行中',
    value: '1'
  },
  {
    label: '已完成',
    value: '2'
  }
]

const Home = () => {
  const queryRef = useRef<IQuery>({})
  const [list, setList] = useState<DataType[]>([])
  const [load, setLoad] = useState<boolean>(true)
  const [status, setStatus] = useState('')
  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setStatus(value)
  }

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
      title: '工作授权',
      dataIndex: 'empower',
      key: 'empower',
      render: (_, record) => {
        return `${record?.user?.middleName}`
      }
    },
    {
      title: '职称',
      dataIndex: 'work',
      key: 'work',
      render: (_, record) => {
        return `${record?.user?.middleName}`
      }
    },
    {
      title: '开始时间',
      dataIndex: 'starttime',
      key: 'starttime'
    },
    {
      title: '结束时间',
      dataIndex: 'endtime',
      key: 'endtime'
    },
    {
      title: '剩余天数',
      dataIndex: 'day',
      key: 'day'
    },
    {
      title: '文件',
      dataIndex: 'file',
      key: 'file'
    },
    {
      title: '下一步行动',
      dataIndex: 'next',
      key: 'next',
      render: (_, record) => {
        const { currentStep, receiptStatus, eadCardStatus, i983Status, i20Status } = record?.onboardingStatus ?? {}

        if (currentStep === currentVisaStepEnum.NOT_STARTED) {
          return <Tag color="gold">{visaStepNextEnum.NOT_STARTED}</Tag>
        } else if (currentStep === currentVisaStepEnum.RECEIPT) {
          if (receiptStatus === visaStepStatusEnum.NOT_SUBMITTED) {
            return <Tag color="gold">{visaStepNextEnum.RECEIPT_APPLY}</Tag>
          } else if (receiptStatus === visaStepStatusEnum.SUBMITTED) {
            return <Tag color="gold">{visaStepNextEnum.RECEIPT_VERIFY}</Tag>
          }
        } else if (currentStep === currentVisaStepEnum.EAD_CARD) {
          if (eadCardStatus === visaStepStatusEnum.NOT_SUBMITTED) {
            return <Tag color="gold">{visaStepNextEnum.EAD_CARD_APPLY}</Tag>
          } else if (eadCardStatus === visaStepStatusEnum.SUBMITTED) {
            return <Tag color="gold">{visaStepNextEnum.EAD_CARD_VERIFY}</Tag>
          }
        } else if (currentStep === currentVisaStepEnum.I983) {
          if (i983Status === visaStepStatusEnum.NOT_SUBMITTED) {
            return <Tag color="gold">{visaStepNextEnum.I983_APPLY}</Tag>
          } else if (i983Status === visaStepStatusEnum.SUBMITTED) {
            return <Tag color="gold">{visaStepNextEnum.I983_VERIFY}</Tag>
          }
        } else if (currentStep === currentVisaStepEnum.I20) {
          if (i20Status === visaStepStatusEnum.NOT_SUBMITTED) {
            return <Tag color="gold">{visaStepNextEnum.I20_APPLY}</Tag>
          } else if (i20Status === visaStepStatusEnum.SUBMITTED) {
            return <Tag color="gold">{visaStepNextEnum.I20_VERIFY}</Tag>
          }
        } else {
          return <Tag color="gold">-</Tag>
        }
      }
    },

    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        const { currentStep, receiptStatus, eadCardStatus, i983Status, i20Status } = record?.onboardingStatus ?? {}

        let step
        if (currentStep === currentVisaStepEnum.NOT_STARTED) {
          step = visaStepNextEnum.NOT_STARTED
        } else if (currentStep === currentVisaStepEnum.RECEIPT && receiptStatus === visaStepStatusEnum.NOT_SUBMITTED) {
          step = visaStepNextEnum.RECEIPT_APPLY
        } else if (currentStep === currentVisaStepEnum.EAD_CARD && eadCardStatus === visaStepStatusEnum.NOT_SUBMITTED) {
          step = visaStepNextEnum.EAD_CARD_APPLY
        } else if (currentStep === currentVisaStepEnum.I983 && i983Status === visaStepStatusEnum.NOT_SUBMITTED) {
          step = visaStepNextEnum.I983_APPLY
        } else if (currentStep === currentVisaStepEnum.I20 && i20Status === visaStepStatusEnum.NOT_SUBMITTED) {
          step = visaStepNextEnum.I20_APPLY
        }

        if (step) {
          return <Space size="middle">
            <Popconfirm
              title="提示"
              description="确定要发送通知吗?"
              okText="确定"
              onConfirm={() => {
                axios
                  .post('http://localhost:8088/User/sendEmail', {
                    userId: record._id,
                    step
                  })
                  .then(({ data }: IResult) => {
                    if (data.Code === 200) {
                      message.success("发送成功")
                    } else {
                      message.error(data.Msg)
                    }
                  })
              }}
              cancelText="取消"
            >
              <Button type="link">发送通知</Button>
            </Popconfirm>
          </Space>
        }
        return null
      }
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
      <Radio.Group
        options={options}
        onChange={onChange}
        value={status}
        optionType="button"
        style={{ marginBottom: 20 }}
        buttonStyle="solid"
      />
      <Table columns={columns} dataSource={list} />
    </div>
  )
}
export default Home

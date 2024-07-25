
import React, { useEffect, useRef, useState } from 'react';
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
  message,
  List,
  Modal
} from 'antd';
import axios from 'axios';
import { DataType, IResult, IQuery, currentVisaStepEnum, visaStepStatusEnum, visaStepNextEnum } from '../type';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
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
    value: 'complete'
  }
];

const Home = () => {
  const queryRef = useRef<IQuery>({});
  const [list, setList] = useState<DataType[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [status, setStatus] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setStatus(value);
    setLoad(true);
  };

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
    setFileUrl(`http://localhost:8088/Files/preview/${id}?name=${encodeURIComponent(name.endsWith('.pdf') ? name : `${name}.pdf`)}`);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFileUrl('');
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => `${record?.user?.preferredName}`
    },
    {
      title: '工作授权',
      dataIndex: 'empower',
      key: 'empower',
      render: (_, record) => `${record?.user?.workAuthorization?.title || '-'}`
    },
    {
      title: '开始时间',
      dataIndex: 'starttime',
      key: 'starttime',
      render: (_, record) => `${new Date(+(record?.starttime as string)).toLocaleDateString()}`
    },
    {
      title: '结束时间',
      dataIndex: 'endtime',
      key: 'endtime',
      render: (_, record) => `${new Date(+(record?.endtime as string)).toLocaleDateString()}`
    },
    {
      title: '剩余天数',
      dataIndex: 'day',
      key: 'day'
    },
    {
      title: 'RECEIPT',
      dataIndex: 'RECEIPT',
      key: 'RECEIPT',
      render: (_, record) => (
          <List
              //@ts-ignore
              dataSource={record?.documents?.RECEIPT}
              renderItem={item => (
                  <List.Item
                      actions={[
                        <Button icon={<DownloadOutlined />} onClick={() => handleDownload(
                            //@ts-ignore
                            item.id, item.name)}>Download</Button>,
                        <Button icon={<EyeOutlined />} onClick={() => handlePreview(
                            //@ts-ignore
                            item.id, item.name)}>Preview</Button>
                      ]}
                  >
                    {
                      //@ts-ignore
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

              //@ts-ignore
              dataSource={record?.documents?.EAD_CARD}
              renderItem={item => (
                  <List.Item
                      actions={[
                        <Button icon={<DownloadOutlined />} onClick={() => handleDownload(
                            //@ts-ignore
                            item.id, item.name)}>Download</Button>,
                        <Button icon={<EyeOutlined />} onClick={() => handlePreview(
                            //@ts-ignore
                            item.id, item.name)}>Preview</Button>
                      ]}
                  >
                    {
                      //@ts-ignore
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

              //@ts-ignore
              dataSource={record?.documents?.I983_FORM}
              renderItem={item => (
                  <List.Item
                      actions={[
                        <Button icon={<DownloadOutlined />} onClick={() => handleDownload(
                            //@ts-ignore
                            item.id, item.name)}>Download</Button>,
                        <Button icon={<EyeOutlined />} onClick={() => handlePreview(
                            //@ts-ignore
                            item.id, item.name)}>Preview</Button>
                      ]}
                  >
                    {
                      //@ts-ignore
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

              //@ts-ignore
              dataSource={record?.documents?.I20_FORM}
              renderItem={item => (
                  <List.Item
                      actions={[
                        <Button icon={<DownloadOutlined />} onClick={() => handleDownload(
                            //@ts-ignore
                            item.id, item.name)}>Download</Button>,
                        <Button icon={<EyeOutlined />} onClick={() => handlePreview(
                            //@ts-ignore
                            item.id, item.name)}>Preview</Button>
                      ]}
                  >
                    {
                      //@ts-ignore
                      item.name}
                  </List.Item>
              )}
          />
      )
    },
    {
      title: '下一步行动',
      dataIndex: 'next',
      key: 'next',
      render: (_, record) => {
        const { currentStep, receiptStatus, eadCardStatus, i983Status, i20Status } = record?.onboardingStatus ?? {};

        if (currentStep === currentVisaStepEnum.NOT_STARTED) {
          return <Tag color="gold">{visaStepNextEnum.NOT_STARTED}</Tag>;
        } else if (currentStep === currentVisaStepEnum.RECEIPT) {
          if (receiptStatus === visaStepStatusEnum.NOT_SUBMITTED || receiptStatus === visaStepStatusEnum.REJECTED) {
            return <Tag color="gold">{visaStepNextEnum.RECEIPT_APPLY}</Tag>;
          } else if (receiptStatus === visaStepStatusEnum.SUBMITTED) {
            return <Tag color="gold">{visaStepNextEnum.RECEIPT_VERIFY}</Tag>;
          }
        } else if (currentStep === currentVisaStepEnum.EAD_CARD) {
          if (eadCardStatus === visaStepStatusEnum.NOT_SUBMITTED || eadCardStatus === visaStepStatusEnum.REJECTED) {
            return <Tag color="gold">{visaStepNextEnum.EAD_CARD_APPLY}</Tag>;
          } else if (eadCardStatus === visaStepStatusEnum.SUBMITTED) {
            return <Tag color="gold">{visaStepNextEnum.EAD_CARD_VERIFY}</Tag>;
          }
        } else if (currentStep === currentVisaStepEnum.I983) {
          if (i983Status === visaStepStatusEnum.NOT_SUBMITTED || i983Status === visaStepStatusEnum.REJECTED) {
            return <Tag color="gold">{visaStepNextEnum.I983_APPLY}</Tag>;
          } else if (i983Status === visaStepStatusEnum.SUBMITTED) {
            return <Tag color="gold">{visaStepNextEnum.I983_VERIFY}</Tag>;
          }
        } else if (currentStep === currentVisaStepEnum.I20) {
          if (i20Status === visaStepStatusEnum.NOT_SUBMITTED || i20Status === visaStepStatusEnum.REJECTED) {
            return <Tag color="gold">{visaStepNextEnum.I20_APPLY}</Tag>;
          } else if (i20Status === visaStepStatusEnum.SUBMITTED) {
            return <Tag color="gold">{visaStepNextEnum.I20_VERIFY}</Tag>;
          }
        } else {
          return <Tag color="gold">-</Tag>;
        }
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        const { currentStep, receiptStatus, eadCardStatus, i983Status, i20Status, currentFeedback } = record?.onboardingStatus ?? {};


        //@ts-ignore
        let step;
        let refuse = `，您上次的提交已被拒绝，拒绝原因:${currentFeedback}`;
        if (currentStep === currentVisaStepEnum.NOT_STARTED) {
          step = visaStepNextEnum.NOT_STARTED;
        } else if (currentStep === currentVisaStepEnum.RECEIPT) {
          if (receiptStatus === visaStepStatusEnum.NOT_SUBMITTED) {
            step = visaStepNextEnum.RECEIPT_APPLY;
          } else if (receiptStatus === visaStepStatusEnum.REJECTED) {
            step = visaStepNextEnum.RECEIPT_APPLY + refuse;
          }
        } else if (currentStep === currentVisaStepEnum.EAD_CARD) {
          if (eadCardStatus === visaStepStatusEnum.NOT_SUBMITTED) {
            step = visaStepNextEnum.EAD_CARD_APPLY;
          } else if (eadCardStatus === visaStepStatusEnum.REJECTED) {
            step = visaStepNextEnum.EAD_CARD_APPLY + refuse;
          }
        } else if (currentStep === currentVisaStepEnum.I983) {
          if (i983Status === visaStepStatusEnum.NOT_SUBMITTED) {
            step = visaStepNextEnum.I983_APPLY;
          } else if (i983Status === visaStepStatusEnum.REJECTED) {
            step = visaStepNextEnum.I983_APPLY + refuse;
          }
        } else if (currentStep === currentVisaStepEnum.I20) {
          if (i20Status === visaStepStatusEnum.NOT_SUBMITTED) {
            step = visaStepNextEnum.I20_APPLY;
          } else if (i20Status === visaStepStatusEnum.REJECTED) {
            step = visaStepNextEnum.I20_APPLY + refuse;
          }
        }

        if (step) {
          return (
              <Space size="middle">
                <Popconfirm
                    title="提示"
                    description="确定要发送通知吗?"
                    okText="确定"
                    onConfirm={() => {
                      axios
                          .post('http://localhost:8088/User/sendEmail', {
                            userId: record.user?._id,

                            //@ts-ignore
                            step
                          })
                          .then(({ data }: IResult) => {
                            if (data.Code === 200) {
                              message.success("发送成功");
                            } else {
                              message.error(typeof data.Msg === 'string' ? data.Msg : '服务器错误');
                            }
                          })
                          .catch(() => {
                            //
                          });
                    }}
                    cancelText="取消"
                >
                  <Button type="link">发送通知</Button>
                </Popconfirm>
              </Space>
          );
        }
        return null;
      }
    }
  ];

  useEffect(() => {
    if (!load) return;
    axios
        .post('http://localhost:8088/Record/List', {
          ...queryRef.current,
          status
        })
        .then(({ data }: IResult & { data: { data: { list: any[] } } }) => {
          if (data.Code === 200) {
            setList(data.data.list);
            setLoad(false);
          } else {
            message.error(typeof data.Msg === 'string' ? data.Msg : '服务器错误');
          }
        })
        .catch(() => {
          //
        });
  }, [load, status]);

  return (
      <div>
        <Row style={{ margin: '15px -10px' }} gutter={20}>
          <Col span={4}>
            <Input
                placeholder="firstName"
                onChange={val => {
                  queryRef.current.firstName = val.target.value;
                }}
            ></Input>
          </Col>
          <Col span={4}>
            <Input
                placeholder="lastName"
                onChange={val => {
                  queryRef.current.lastName = val.target.value;
                }}
            ></Input>
          </Col>
          <Col span={4}>
            <Input
                placeholder="preferredName"
                onChange={val => {
                  queryRef.current.preferredName = val.target.value;
                }}
            ></Input>
          </Col>
          <Button
              type="primary"
              onClick={() => {
                setLoad(true);
              }}
          >
            查询
          </Button>
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
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width="80%"
        >
          <iframe
              src={fileUrl}
              style={{ width: '100%', height: '500px', border: 'none' }}
              title="文件预览"
          ></iframe>
        </Modal>
      </div>
  );
};
/* eslint-disable */
export default Home;

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
    not_started: 'Onbording Application Phase',
    receipt: 'OPT Receipt Phase',
    ead_card: 'EAD Card Phase',
    i983: 'I-983 Table Phase',
    i20: 'I-20 Phase',
    complete: 'Completed All Steps'
};
const currentVisaStepMap = {
    receipt: 'receiptStatus',
    ead_card: 'eadCardStatus',
    i983: 'i983Status',
    i20: 'i20Status',
};

const options = [
    {
        label: 'All',
        value: ''
    },
    {
        label: 'Pending',
        value: 'submitted'
    },
    {
        label: 'Approved',
        value: 'approved'
    },
    {
        label: 'Rejected',
        value: 'rejected'
    }
];

const Home = () => {
    const [status, setStatus] = useState<string>('');
    const recordId = useRef<string>();
    const queryRef = useRef<IQuery>({});
    const currentStepStatus = useRef<string>('');
    const [current, setStepCurrent] = useState<number>(0);
    const [load, setLoad] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isRefuseOpen, setIsRefuseOpen] = useState<boolean>(false);
    const [list, setList] = useState<DataType[]>([]);
    const [isStepOpen, setIsStepOpen] = useState<boolean>(false);
    const [fileUrl, setFileUrl] = useState('');
    const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);

    const [form] = Form.useForm();
    const [refuseForm] = Form.useForm();
    const { TextArea } = Input;

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
        const url = `http://localhost:8088/Files/preview/${id}?name=${encodeURIComponent(name.endsWith('.pdf') ? name : `${name}.pdf`)}`;
        setFileUrl(url);
        setIsFilePreviewOpen(true);
    };

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => `${record?.user?.preferredName}`
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (_, record) => record?.user?.email
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
                        <List.Item>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {
                                    // @ts-ignore
                                    item.name
                                }
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleDownload(
                                        // @ts-ignore
                                        item.id, item.name
                                    )}
                                    style={{ marginTop: 8 }}
                                />
                                <Button
                                    icon={<EyeOutlined />}
                                    onClick={() => handlePreview(
                                        // @ts-ignore
                                        item.id, item.name
                                    )}
                                    style={{ marginTop: 8 }}
                                />
                            </div>
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
                        <List.Item>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {
                                    // @ts-ignore
                                    item.name
                                }
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleDownload(
                                        // @ts-ignore
                                        item.id, item.name
                                    )}
                                    style={{ marginTop: 8 }}
                                />
                                <Button
                                    icon={<EyeOutlined />}
                                    onClick={() => handlePreview(
                                        // @ts-ignore
                                        item.id, item.name
                                    )}
                                    style={{ marginTop: 8 }}
                                />
                            </div>
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
                        <List.Item>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {
                                    // @ts-ignore
                                    item.name
                                }
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleDownload(
                                        // @ts-ignore
                                        item.id, item.name
                                    )}
                                    style={{ marginTop: 8 }}
                                />
                                <Button
                                    icon={<EyeOutlined />}
                                    onClick={() => handlePreview(
                                        // @ts-ignore
                                        item.id, item.name
                                    )}
                                    style={{ marginTop: 8 }}
                                />
                            </div>
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
                        <List.Item>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {
                                    // @ts-ignore
                                    item.name
                                }
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleDownload(
                                        // @ts-ignore
                                        item.id, item.name
                                    )}
                                    style={{ marginTop: 8 }}
                                />
                                <Button
                                    icon={<EyeOutlined />}
                                    onClick={() => handlePreview(
                                        // @ts-ignore
                                        item.id, item.name
                                    )}
                                    style={{ marginTop: 8 }}
                                />
                            </div>
                        </List.Item>
                    )}
                />
            )
        },
        {
            title: 'Current Stage',
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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (_, record) => {
                const key = currentVisaStepMap[record.onboardingStatus.currentStep as VisaStepEnum] as keyof IOnboardingStatus;
                return <Tag color="magenta">
                    {!key || record?.onboardingStatus['currentStep'] === 'complete' ? 'Completed' :
                        record?.onboardingStatus[key] === visaStepStatusEnum.NOT_SUBMITTED ? 'Unsubmit' :
                            record?.onboardingStatus[key] === visaStepStatusEnum.SUBMITTED ? 'Submitted' :
                                record?.onboardingStatus[key] === visaStepStatusEnum.APPROVED ? 'Approved' :
                                    record?.onboardingStatus[key] === visaStepStatusEnum.REJECTED ? 'Rejected' : ''}
                </Tag>
            }
        },
        {
            title: 'Operation',
            key: 'action',
            width: 240,
            render: (_, record) => {
                const { currentStep, receiptStatus, eadCardStatus, i983Status, i20Status } = record?.onboardingStatus ?? {};
                const show =
                    (currentStep === currentVisaStepEnum.RECEIPT && receiptStatus === visaStepStatusEnum.SUBMITTED) ||
                    (currentStep === currentVisaStepEnum.EAD_CARD && eadCardStatus === visaStepStatusEnum.SUBMITTED) ||
                    (currentStep === currentVisaStepEnum.I983 && i983Status === visaStepStatusEnum.SUBMITTED) ||
                    (currentStep === currentVisaStepEnum.I20 && i20Status === visaStepStatusEnum.SUBMITTED);

                return (
                    <Space size="middle">
                        <Button
                            type="link"
                            onClick={() => {
                                const step = record?.onboardingStatus?.currentStep;
                                const key = currentVisaStepMap[record.onboardingStatus.currentStep as VisaStepEnum] as keyof IOnboardingStatus;
                                const status = record?.onboardingStatus[key] === visaStepStatusEnum.NOT_SUBMITTED ? 'Unsubmit' :
                                    record?.onboardingStatus[key] === visaStepStatusEnum.SUBMITTED ? 'Submitted' :
                                        record?.onboardingStatus[key] === visaStepStatusEnum.APPROVED ? 'Approved' :
                                            record?.onboardingStatus[key] === visaStepStatusEnum.REJECTED ? 'Rejected' : '';
                                if (step === currentVisaStepEnum.NOT_STARTED) {
                                    setStepCurrent(0);
                                } else if (step === currentVisaStepEnum.RECEIPT) {
                                    setStepCurrent(1);
                                } else if (step === currentVisaStepEnum.EAD_CARD) {
                                    setStepCurrent(2);
                                } else if (step === currentVisaStepEnum.I983) {
                                    setStepCurrent(3);
                                } else if (step === currentVisaStepEnum.I20) {
                                    setStepCurrent(4);
                                } else if (step === currentVisaStepEnum.COMPLETE) {
                                    setStepCurrent(5);
                                }
                                recordId.current = record._id;
                                currentStepStatus.current = status as string;
                                setIsStepOpen(true);
                            }}
                        >
                            View Application
                        </Button>
                        {show ? (
                            <>
                                <Popconfirm
                                    title="Reminder"
                                    description="Are you sure to approve?"
                                    okText="Yes"
                                    onConfirm={() => {
                                        axios
                                            .post('http://localhost:8088/Record/agree', {
                                                id: record._id
                                            })
                                            .then(({ data }: IResult) => {
                                                if (data.Code === 200) {
                                                    setLoad(true);
                                                } else {
                                                    message.error(typeof data.Msg === 'string' ? data.Msg : 'Unknown server error');
                                                }
                                            }).catch(() => {
                                            //
                                        });
                                    }}
                                    cancelText="Cancel"
                                >
                                    <Button type="link">Approve</Button>
                                </Popconfirm>

                                <Button
                                    type="link"
                                    danger
                                    onClick={() => {
                                        recordId.current = record._id;
                                        setIsRefuseOpen(true);
                                    }}
                                >
                                    Reject
                                </Button>
                            </>
                        ) : null}
                    </Space>
                );
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
                    message.error(typeof data.Msg === 'string' ? data.Msg : 'Unknown server error');
                }
            }).catch(() => {
            //
        });
    }, [load, status]);

    const handleOk = () => {
        form.submit();
    };
    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };
    const handleRefuseOk = () => {
        refuseForm.submit();
    };
    const handleRefuseCancel = () => {
        refuseForm.resetFields();
        setIsRefuseOpen(false);
    };
    const handleStepCancel = () => {
        setIsStepOpen(false);
    };
    const handleFilePreviewCancel = () => {
        setIsFilePreviewOpen(false);
        setFileUrl('');
    };

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
                    handleCancel();
                } else {
                    message.error(typeof data.Msg === 'string' ? data.Msg : 'Unknown server error');
                }
            }).catch(() => {
            //
        });
    };
    const onRefuseFinish: FormProps<{ refuse: string }>['onFinish'] = ({ refuse }) => {
        axios
            .post('http://localhost:8088/Record/refuse', {
                feedback: refuse,
                id: recordId.current
            })
            .then(({ data }: IResult) => {
                if (data.Code === 200) {
                    handleRefuseCancel();
                    setLoad(true);
                } else {
                    message.error(typeof data.Msg === 'string' ? data.Msg : 'Unknown server error');
                }
            }).catch(() => {
            //
        });
    };
    const onChange = ({ target: { value } }: RadioChangeEvent) => {
        setStatus(value);
        setLoad(true);
    };

    return (
        <div>
            <Row style={{ margin: '15px -10px' }} gutter={20}>
                <Col span={4}>
                    <Input placeholder="firstName" onChange={val => {
                        queryRef.current.firstName = val.target.value;
                    }}></Input>
                </Col>
                <Col span={4}>
                    <Input placeholder="lastName" onChange={val => {
                        queryRef.current.lastName = val.target.value;
                    }}></Input>
                </Col>
                <Col span={4}>
                    <Input placeholder="preferredName" onChange={val => {
                        queryRef.current.preferredName = val.target.value;
                    }}></Input>
                </Col>
                <Col span={6}>
                    <Button type="primary" onClick={() => {
                        setLoad(true);
                    }}>Search</Button>
                    <Button
                        type="primary"
                        style={{ margin: '0 10px' }}
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                    >
                        Generate register token
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
                title="Generate registration token"
                open={isModalOpen}
                onOk={handleOk}
                cancelText="Cancel"
                okText="OK"
                onCancel={handleCancel}
            >
                <Form form={form} style={{ margin: '20px 0' }} onFinish={onFinish}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: 'Please enter a valid mail address！'
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
                title="Reject Reason"
                open={isRefuseOpen}
                cancelText="Cancel"
                okText="OK"
                onOk={handleRefuseOk}
                onCancel={handleRefuseCancel}
            >
                <Form
                    form={refuseForm}
                    style={{ margin: '20px 0' }}
                    onFinish={onRefuseFinish}
                >
                    <Form.Item
                        label="Reject Reason"
                        name="refuse"
                        rules={[{ required: true, message: 'Please input your Refuse!' }]}
                    >
                        <TextArea
                            placeholder="Reject Reason"
                            autoSize={{
                                minRows: 3,
                                maxRows: 5
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Process Status"
                open={isStepOpen}
                cancelText="Cancel"
                okText="OK"
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

            <Modal
                visible={isFilePreviewOpen}
                onCancel={handleFilePreviewCancel}
                footer={null}
                width="80%"
            >
                <iframe
                    src={fileUrl}
                    style={{ width: '100%', height: '500px', border: 'none' }}
                    title="File Preview"
                ></iframe>
            </Modal>
        </div>
    );
};
export default Home;

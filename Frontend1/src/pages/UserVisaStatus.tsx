import React, { useEffect, useState } from 'react';
import { Steps, message, List, Button, Modal, Card, Row, Col, Upload } from 'antd';
import axios from 'axios';
import { useAppSelector } from '../hooks/store';
import { UploadOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { DataType, currentVisaStepEnum, IResult, visaStepStatusEnum } from '../type';
import Header from '../components/Header';
import Footer from '../components/Footer';

const currentVisaStepText = {
    not_started: 'Onboarding Application Phase',
    receipt: 'OPT Receipt Phase',
    ead_card: 'EAD Card Phase',
    i983: 'I-983 Form Phase',
    i20: 'I-20 Form Phase',
    complete: 'All Steps Completed'
};

const documentsFieldMap = {
    receipt: 'RECEIPT',
    ead_card: 'EAD_CARD',
    i983: 'I983_FORM',
    i20: 'I20_FORM'
};

const UserVisaStatus = () => {
    const { username, token } = useAppSelector(state => state.counter);
    const [current, setStepCurrent] = useState<number>(0);
    const [currentStepStatus, setCurrentStepStatus] = useState<string>('');
    const [currentFeedback, setCurrentFeedback] = useState<string>('');
    const [record, setRecord] = useState<DataType | null>(null);
    const [workAuthorization, setWorkAuthorization] = useState<{ title: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [fileUrl, setFileUrl] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fileList, setFileList] = useState<any[]>([]);

    useEffect(() => {
        fetchUserData();
    }, [username]);

    const fetchUserData = () => {
        setLoading(true);
        axios
            .post<{ Code: number; Msg: string; data: DataType }>(`http://localhost:8088/Employee/info`, { username }, {
                headers: { authorization: token },
            })
            .then(({ data }) => {
                if (data.Code === 200) {
                    const userData = data.data;
                    setRecord(userData);

                    // @ts-ignore
                    setWorkAuthorization(userData.workAuthorization);
                    // @ts-ignore
                    if (userData.workAuthorization.title === 'OPT') {
                        fetchRecordData();
                    }
                } else {
                    message.error(data.Msg || 'Server error');
                }
            })
            .catch(() => {
                message.error('Server error');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchRecordData = () => {
        setLoading(true);
        axios
            .post('http://localhost:8088/Record/info', { username })
            .then(({ data }: IResult & { data: DataType[] }) => {
                // @ts-ignore
                if (data.Code === 200 && data.data.length > 0) {
                    // @ts-ignore
                    const userData = data.data[0];
                    setRecord(userData);
                    const { currentStep, receiptStatus, eadCardStatus, i983Status, i20Status, currentFeedback } = userData.onboardingStatus ?? {};
                    let status = '';
                    if (currentStep === currentVisaStepEnum.RECEIPT) {
                        setStepCurrent(1);
                        status = receiptStatus === visaStepStatusEnum.NOT_SUBMITTED ? 'Not Submitted' : receiptStatus === visaStepStatusEnum.SUBMITTED ? 'Submitted' : receiptStatus === visaStepStatusEnum.APPROVED ? 'Approved' : receiptStatus === visaStepStatusEnum.REJECTED ? 'Rejected' : '';
                    } else if (currentStep === currentVisaStepEnum.EAD_CARD) {
                        setStepCurrent(2);
                        status = eadCardStatus === visaStepStatusEnum.NOT_SUBMITTED ? 'Not Submitted' : eadCardStatus === visaStepStatusEnum.SUBMITTED ? 'Submitted' : eadCardStatus === visaStepStatusEnum.APPROVED ? 'Approved' : eadCardStatus === visaStepStatusEnum.REJECTED ? 'Rejected' : '';
                    } else if (currentStep === currentVisaStepEnum.I983) {
                        setStepCurrent(3);
                        status = i983Status === visaStepStatusEnum.NOT_SUBMITTED ? 'Not Submitted' : i983Status === visaStepStatusEnum.SUBMITTED ? 'Submitted' : i983Status === visaStepStatusEnum.APPROVED ? 'Approved' : i983Status === visaStepStatusEnum.REJECTED ? 'Rejected' : '';
                    } else if (currentStep === currentVisaStepEnum.I20) {
                        setStepCurrent(4);
                        status = i20Status === visaStepStatusEnum.NOT_SUBMITTED ? 'Not Submitted' : i20Status === visaStepStatusEnum.SUBMITTED ? 'Submitted' : i20Status === visaStepStatusEnum.APPROVED ? 'Approved' : i20Status === visaStepStatusEnum.REJECTED ? 'Rejected' : '';
                    } else if (currentStep === currentVisaStepEnum.COMPLETE) {
                        setStepCurrent(5);
                        status = 'All Steps Completed';
                    } else {
                        setStepCurrent(0);
                    }
                    setCurrentStepStatus(status);
                    setCurrentFeedback(currentFeedback || '');
                } else {
                    message.error(data.Msg || 'Server error');
                }
            })
            .catch(() => {
                message.error('Server error');
            })
            .finally(() => {
                setLoading(false);
            });
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

    const handleUploadChange = ({ fileList }: { fileList: any[] }) => {
        setFileList(fileList);
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            fileList.forEach(file => {
                formData.append('file', file.originFileObj);
            });

            const uploadResponse = await axios.post('http://localhost:8088/Files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (uploadResponse.data.Code === 200) {
                const uploadedFile = {
                    name: uploadResponse.data.data.filename,
                    id: uploadResponse.data.data._id
                };

                await axios.post('http://localhost:8088/Record/updateRecord', {
                    username,
                    currentStep: record?.onboardingStatus.currentStep,
                    uploadedFiles: [uploadedFile]
                });

                message.success('Files submitted successfully');
                setFileList([]);
                fetchRecordData(); // Re-fetch the record data to update the state
            } else {
                message.error(uploadResponse.data.Msg || 'Upload failed');
            }
        } catch (error) {
            message.error('Submit failed');
        }
    };

    if (loading || !record) {
        return <div>Loading...</div>;
    }

    const renderFiles = (files: { name: string; id: string }[]) => (
        <List
            header={<div>Uploaded Files</div>}
            bordered
            dataSource={files}
            renderItem={item => (
                <List.Item
                    actions={[
                        <Button icon={<DownloadOutlined />} onClick={() => handleDownload(item.id, item.name)}>Download</Button>,
                        <Button icon={<EyeOutlined />} onClick={() => handlePreview(item.id, item.name)}>Preview</Button>
                    ]}
                >
                    {item.name.endsWith('.pdf') ? item.name : `${item.name}.pdf`}
                </List.Item>
            )}
            style={{ marginTop: 16 }}
        />
    );

    const getDocumentFiles = (step: string) => {
        if (!record || !record.documents) return [];
        switch (step) {
            case 'receipt':
                return record.documents.RECEIPT || [];
            case 'ead_card':
                return record.documents.EAD_CARD || [];
            case 'i983':
                return record.documents.I983_FORM || [];
            case 'i20':
                return record.documents.I20_FORM || [];
            default:
                return record.documents.OTHERS || [];
        }
    };

    const renderStepDescription = (stepIndex: number, stepKey: string) => {
        if (stepIndex > current) return null;
        const stepStatus = stepIndex === current ? currentStepStatus : '';
        const files = getDocumentFiles(stepKey);
        const isUploadable = stepStatus === 'Not Submitted' || stepStatus === 'Rejected';

        return (
            <div>
                {stepStatus}
                {stepStatus === 'Rejected' && (
                    <div style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>
                        Feedback: {currentFeedback}
                    </div>
                )}
                {isUploadable && (
                    <div style={{ marginBottom: 16 }}>
                        <Upload
                            fileList={fileList}
                            onChange={handleUploadChange}
                            beforeUpload={() => false}
                            accept=".pdf"
                        >
                            <Button icon={<UploadOutlined />}>Select PDF File</Button>
                        </Upload>
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            disabled={fileList.length === 0}
                            style={{ marginTop: 16 }}
                        >
                            Submit
                        </Button>
                    </div>
                )}
                {//@ts-ignore
                    files.length > 0 && renderFiles(files)}
            </div>
        );
    };

    if (!workAuthorization || workAuthorization.title !== 'OPT') {
        return (
            <div className="page-container">
                <Header />
                <Card
                    title="Work Authorization"
                    bordered={false}
                    style={{ maxWidth: 800, margin: '0 auto', marginTop: 20 }}
                >
                    <p>Work Authorization Type: {workAuthorization?.title}</p>
                </Card>
                <Footer />
            </div>
        );
    }

    return (
        <div className="page-container">
            <Header />
            <Card
                title="Visa Status"
                bordered={false}
                style={{ maxWidth: 800, margin: '0 auto', marginTop: 20 }}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Steps
                            current={current}
                            direction="vertical"
                            style={{ padding: 20 }}
                            items={[
                                {
                                    title: currentVisaStepText.not_started,
                                    description: renderStepDescription(0, 'not_started'),
                                },
                                {
                                    title: currentVisaStepText.receipt,
                                    description: renderStepDescription(1, 'receipt'),
                                },
                                {
                                    title: currentVisaStepText.ead_card,
                                    description: renderStepDescription(2, 'ead_card'),
                                },
                                {
                                    title: currentVisaStepText.i983,
                                    description: renderStepDescription(3, 'i983'),
                                },
                                {
                                    title: currentVisaStepText.i20,
                                    description: renderStepDescription(4, 'i20'),
                                },
                            ]}
                        />
                    </Col>
                </Row>
            </Card>
            <Footer />
            <Modal
                visible={isModalVisible}
                onCancel={handleCancel}
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

export default UserVisaStatus;

import React, { useState, useEffect } from 'react';
import { Upload, Button, List, message, Modal } from 'antd';
import axios from 'axios';
import { UploadOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useAppSelector } from "../hooks/store";

const FileManagement = () => {
    const [fileList, setFileList] = useState<any[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<{ name: string; id: string }[]>([]);
    const [fileUrl, setFileUrl] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { username } = useAppSelector(state => state.counter);

    useEffect(() => {
        // Fetch userDocuments when component mounts
        const fetchUserDocuments = async () => {
            try {
                const response = await axios.get(`http://localhost:8088/Employee/getfilelist/${username}`);
                if (response.data.Code === 200) {
                    setUploadedFiles(response.data.data);
                } else {
                    message.error(response.data.Msg);
                }
            } catch (error) {
                message.error('Failed to fetch documents');
            }
        };

        fetchUserDocuments();
    }, [username]);

    const handleUploadChange = ({ fileList }: { fileList: any[] }) => {
        setFileList(fileList);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('file', (file as any).originFileObj);
        });

        try {
            const response = await axios.post('http://localhost:8088/Files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.Code === 200) {
                const newFile = { name: fileList[0].name, id: response.data.data._id };
                const updatedFiles = [...uploadedFiles, newFile];

                // Update userDocuments using updatefilelist API
                await axios.post(`http://localhost:8088/Employee/updatefilelist/${username}`, {
                    userDocuments: updatedFiles,
                });

                message.success('File uploaded successfully');
                setUploadedFiles(updatedFiles);
                setFileList([]);
            } else {
                message.error(response.data.Msg);
            }
        } catch (error) {
            message.error('Upload failed');
        }
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

    return (
        <div>
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
                onClick={handleUpload}
                disabled={fileList.length === 0}
                style={{ marginTop: 16 }}
            >
                Upload
            </Button>
            <List
                header={<div>Uploaded Files</div>}
                bordered
                dataSource={uploadedFiles}
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

export default FileManagement;

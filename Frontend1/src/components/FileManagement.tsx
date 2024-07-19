import React, { useState } from 'react';
import { Upload, Button, List, message } from 'antd';
import axios from 'axios';
import { UploadOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';

const FileManagement = () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; id: string }[]>([]);

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
        message.success('File uploaded successfully');
        setUploadedFiles([...uploadedFiles, { name: fileList[0].name, id: response.data.data._id }]);
        setFileList([]);
      } else {
        message.error(response.data.Msg);
      }
    } catch (error) {
      message.error('Upload failed');
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:8088/Files/download/${id}`, {
        responseType: 'blob',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const contentDisposition = response.headers['content-disposition'];
      let filename = id;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) {
          filename = match[1];
        }
      }
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); 
    } catch (error) {
      message.error('Download failed');
    }
  };

  const handlePreview = (id: any) => {
    window.open(`http://localhost:8088/Files/preview/${id}`);
  };

  return (
    <div>
      <Upload
        fileList={fileList}
        onChange={handleUploadChange}
        beforeUpload={() => false}
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
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
              <Button icon={<DownloadOutlined />} onClick={() => handleDownload(item.id)}>Download</Button>,
              <Button icon={<EyeOutlined />} onClick={() => handlePreview(item.id)}>Preview</Button>
            ]}
          >
            {item.name}
          </List.Item>
        )}
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default FileManagement;

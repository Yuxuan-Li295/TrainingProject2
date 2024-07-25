import React, { useEffect, useState } from 'react';
import { Descriptions, message, Image, List, Button, Modal } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { IResult, UserDataType } from '../type';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import moment from "moment";

const Home = () => {
  const [info, setInfo] = useState<UserDataType>({});
  const [fileUrl, setFileUrl] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const params = useParams();

  const formatDate = (date: string | undefined) => {
    return date ? moment(date).format('YYYY-MM-DD') : '';
  };

  const borderedItems = [
    {
      label: 'First Name',
      span: 2,
      children: info?.firstName,
    },
    {
      label: 'Last Name',
      span: 2,
      children: info?.lastName,
    },
    {
      label: 'Middle Name',
      span: 2,
      children: info?.middleName,
    },
    {
      label: 'Preferred Name',
      span: 2,
      children: info?.preferredName,
    },
    {
      label: 'Gender',
      span: 2,
      children: info?.gender,
    },
    {
      label: 'Email',
      span: 2,
      children: info?.email,
    },
    {
      label: 'Date of Birth',
      span: 2,
      children: formatDate(info?.dob),
    },
    {
      label: 'SSN',
      span: 2,
      children: info?.ssn,
    },
    {
      label: 'City',
      span: 2,
      children: info?.address?.city,
    },
    {
      label: 'Cell Phone',
      span: 2,
      children: info?.contactInfo?.cellPhone,
    },
    {
      label: 'Profile Picture',
      span: 4,
      children: (
          <Image
              width={170}
              height={200}
              fallback="data:image/png;base64,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"
              src={info?.profilePicture}
          />
      ),
    },
  ];

  useEffect(() => {
    axios
        .post('http://localhost:8088/Employee/info', {
          id: params.id,
        })
        .then(({ data }: IResult & any) => {
          if (data.Code === 200) {
            setInfo(data.data);
          } else {
            message.error(data.Msg || 'Unknown Server error');
          }
        })
        .catch(() => {
          message.error('Server error');
        });
  }, [params.id]);

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

  return (
      <div>
        <Descriptions
            style={{ background: '#fff', padding: 20, borderRadius: 5 }}
            bordered
            title="User Details"
            column={4}
            items={borderedItems}
        />
        {//@ts-ignore
          info?.userDocuments && renderFiles(info.userDocuments)}
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

export default Home;

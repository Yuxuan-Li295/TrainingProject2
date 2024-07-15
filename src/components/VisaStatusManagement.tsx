import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from '../hooks/hooks.ts';
import { fetchVisaStatus, submitDocument } from "../api/mockVisaApi.ts";
import { setSubmissionStatus, setVisaStatus } from "../store/visaSlice.ts";
import { message, Spin, Upload, Button, Card } from "antd";
import React from "react";
import { UploadOutlined } from "@ant-design/icons";

export const VisaStatusManagement = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const visaStatus = useAppSelector(state => state.visa);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchVisaStatus();
        dispatch(setVisaStatus(data.visa));
      } catch (error) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [dispatch]);


  const handleUpload = async (info: any, fileType: string) => {
    if (info.file.status === 'done') {
      try {
        const response = await submitDocument(fileType);
        message.success(`${info.file.name} uploaded successfully`);
        dispatch(setSubmissionStatus({ fileType, status: response.status }));
      } catch (error) {
        message.error(`${info.file.name} upload failed`);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload failed`);
    }
  }

  if (loading) return <Spin tip="Loading..." />

  const renderFileInput = (title: string, fileType: string, feedback?: string) => (
    <>
      <header className="text-2xl font-semibold my-5">{title}</header>
      <Upload onChange={(info) => handleUpload(info, fileType)}>
        <Button icon={<UploadOutlined />}>Please upload a copy of your {title}</Button>
      </Upload>
      {feedback && <p className="text-red-500 text-sm font-semibold">{feedback}</p>}
    </>
  );

  const renderI983Upload = () => {
    return (
      <>
        <header className="text-2xl font-semibold my-5">Please download and fill out the I-983 form</header>
        <div className="mb-4">
          <a href="https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf" target="_blank" rel="noopener noreferrer">
            <Button type="link">Download Empty Template</Button>
          </a>
          <a href="https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf" target="_blank" rel="noopener noreferrer">
            <Button type="link">Download Sample Template</Button>
          </a>
        </div>
        {renderFileInput('I-983', 'i983')}
      </>
    );
  };

  const getStatusElement = () => {
    if (visaStatus.optReceipt === 'unsubmitted') {
      return renderFileInput('OPT Receipt', 'optReceipt');
    }
    if (visaStatus.optReceipt === 'pending') {
      return <header className="text-2xl font-semibold my-5">Waiting for HR to approve your OPT Receipt</header>;
    }
    if (visaStatus.optReceipt === 'rejected') {
      return (
        <>
          <header className="text-2xl font-semibold my-5 text-red-500">OPT Receipt Rejected</header>
          <p className="text-red-500 text-sm font-semibold mb-4">{visaStatus.feedback}</p>
          <p className="text-lg font-semibold mb-4">Please address the above feedback and re-upload your OPT Receipt for review.</p>
          {renderFileInput('Re-upload OPT Receipt', 'optReceipt')}
        </>
      );
    }
    if (visaStatus.optReceipt === 'approved') {
      if (visaStatus.optEad === 'unsubmitted') {
        return renderFileInput('OPT EAD', 'optEad');
      }
      if (visaStatus.optEad === 'pending') {
        return <header className="text-2xl font-semibold my-5">Waiting for HR to approve your OPT EAD</header>;
      }
      if (visaStatus.optEad === 'rejected') {
        return (
          <>
            <header className="text-2xl font-semibold my-5 text-red-500">OPT EAD Rejected</header>
            <p className="text-red-500 text-sm font-semibold mb-4">{visaStatus.feedback}</p>
            <p className="text-lg font-semibold mb-4">Please address the above feedback and re-upload your OPT EAD for review.</p>
            {renderFileInput('Re-upload OPT EAD', 'optEad')}
          </>
        );
      }
      if (visaStatus.optEad === 'approved') {
        if (visaStatus.i983 === 'unsubmitted') {
          return renderI983Upload();
        }
        if (visaStatus.i983 === 'pending') {
          return <header className="text-2xl font-semibold my-5">Waiting for HR to approve your I-983</header>;
        }
        if (visaStatus.i983 === 'rejected') {
          return (
            <>
              <header className="text-2xl font-semibold my-5 text-red-500">I-983 Rejected</header>
              <p className="text-red-500 text-sm font-semibold mb-4">{visaStatus.feedback}</p>
              <p className="text-lg font-semibold mb-4">Please address the above feedback and re-upload your I-983 for review.</p>
              {renderFileInput('Re-upload I-983', 'i983')}
            </>
          );
        }
        if (visaStatus.i983 === 'approved') {
          if (visaStatus.i20 === 'unsubmitted') {
            return (
              <>
                <header className="text-2xl font-semibold my-5">Please send the I-983 along with all necessary documents to your school and upload the new I-20</header>
                {renderFileInput('I-20', 'i20')}
              </>
            );
          }
          if (visaStatus.i20 === 'pending') {
            return <header className="text-2xl font-semibold my-5">Waiting for HR to approve your I-20</header>;
          }
          if (visaStatus.i20 === 'rejected') {
            return (
              <>
                <header className="text-2xl font-semibold my-5 text-red-500">I-20 Rejected</header>
                <p className="text-red-500 text-sm font-semibold mb-4">{visaStatus.feedback}</p>
                <p className="text-lg font-semibold mb-4">Please address the above feedback and re-upload your I-20 for review.</p>
                {renderFileInput('Re-upload I-20', 'i20')}
              </>
            );
          }
          if (visaStatus.i20 === 'approved') {
            return <header className="text-2xl font-semibold my-5">All your visa documents have been approved</header>;
          }
        }
      }
    }
    return null;
  };

  return (
    <div className="visa-status-management">
      <Card title="Visa Status Management">
        {getStatusElement()}
      </Card>
    </div>
  );
};
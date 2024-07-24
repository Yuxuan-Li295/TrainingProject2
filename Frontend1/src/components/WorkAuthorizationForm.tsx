import React from 'react'
import { Form, Select, DatePicker, Input } from 'antd'
import moment from 'moment'

const { Option } = Select

interface WorkAuthorizationFormProps {
    form: any
    workAuthTitle?: string
}

const WorkAuthorizationForm: React.FC<WorkAuthorizationFormProps> = ({ form, workAuthTitle }) => {
    return (
        <>
            {workAuthTitle ? (
                <>
                    <Form.Item label="Work Authorization Title" name="workAuthorization.title">
                        <Input disabled />
                    </Form.Item>

                    {(workAuthTitle!=='greenCard' && workAuthTitle!=='citizen') ? (
                        <>
                            <Form.Item label="Start Date" name="workAuthorization.startDate" rules={[{ required: true, message: 'Please select the start date!' }]}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label="End Date" name="workAuthorization.endDate" rules={[{ required: true, message: 'Please select the end date!' }]}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </>
                    ) : (<></>)}

                </>
            ) : (
                <>
                    <Form.Item label="Permanent resident or citizen of the U.S.?" name="permanentResident" rules={[{ required: true, message: 'Please select an option!' }]}>
                        <Select placeholder="Select option">
                            <Option value="yes">Yes</Option>
                            <Option value="no">No</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.permanentResident !== currentValues.permanentResident}>
                        {({ getFieldValue }) =>
                            getFieldValue('permanentResident') === 'yes' ? (
                                <Form.Item label="Select Type" name="usResidentType" rules={[{ required: true, message: 'Please select an option!' }]}>
                                    <Select placeholder="Select type">
                                        <Option value="greenCard">Green Card</Option>
                                        <Option value="citizen">Citizen</Option>
                                    </Select>
                                </Form.Item>
                            ) : getFieldValue('permanentResident') === 'no' ? (
                                <>
                                    <Form.Item label="What is your work authorization?" name="workAuthorizationType" rules={[{ required: true, message: 'Please select an option!' }]}>
                                        <Select placeholder="Select authorization type">
                                            <Option value="H1-B">H1-B</Option>
                                            <Option value="L2">L2</Option>
                                            <Option value="OPT">OPT</Option>
                                            <Option value="H4">H4</Option>
                                            <Option value="Other">Other</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.workAuthorizationType !== currentValues.workAuthorizationType}>
                                        {({ getFieldValue }) =>
                                            getFieldValue('workAuthorizationType') === 'Other' ? (
                                                <Form.Item label="Specify Visa Title" name="workAuthorizationOther" rules={[{ required: true, message: 'Please specify the visa title!' }]}>
                                                    <Input placeholder="Specify visa title" />
                                                </Form.Item>
                                            ) : null
                                        }
                                    </Form.Item>
                                    <Form.Item label="Start Date" name="workAuthorization.startDate" rules={[{ required: true, message: 'Please select the start date!' }]}>
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item label="End Date" name="workAuthorization.endDate" rules={[{ required: true, message: 'Please select the end date!' }]}>
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </>
                            ) : null
                        }
                    </Form.Item>
                </>
            )}
        </>
    )
}

export default WorkAuthorizationForm

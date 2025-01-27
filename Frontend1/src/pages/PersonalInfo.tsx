import React, { useEffect, useState } from 'react'
import { Button, Form, Input, message, FormProps, DatePicker, Upload, Select, Col, Row, Card, Modal } from 'antd'
import axios from 'axios'
import { useAppSelector } from '../hooks/store'
import { UserDataType } from '../type'
import { UploadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import WorkAuthorizationForm from '../components/WorkAuthorizationForm'
import FileManagement from '../components/FileManagement'

interface IForm extends Partial<UserDataType> { }

const { Option } = Select

const PersonalInfo = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState<boolean>(false)
    const [userInfo, setUserInfo] = useState<UserDataType | null>(null)
    const { isLogin, username, token } = useAppSelector(state => state.counter)
    const [fileList, setFileList] = useState<any[]>([])
    const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({})
    const [initialValues, setInitialValues] = useState<any>({})
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLogin) {
            navigate('/login')
        }
        if (username) {
            setLoading(true)
            axios
                .post<{ Code: number; Msg: string; data: UserDataType }>(`http://localhost:8088/Employee/info`, { username }, {
                    headers: { authorization: token },
                })
                .then(({ data }) => {
                    if (data.Code === 200) {
                        const userData = data.data
                        setUserInfo(userData)
                        setFileList(userData.profilePicture ? [{ url: userData.profilePicture }] : [])
                        const formValues = {
                            ...userData,
                            dob: userData.dob ? moment(userData.dob) : null,
                            'address.building': userData.address?.building,
                            'address.street': userData.address?.street,
                            'address.city': userData.address?.city,
                            'address.state': userData.address?.state,
                            'address.zip': userData.address?.zip,
                            'contactInfo.cellPhone': userData.contactInfo?.cellPhone,
                            'contactInfo.workPhone': userData.contactInfo?.workPhone,
                            'workAuthorization.title': userData.workAuthorization?.title,
                            'workAuthorization.startDate': userData.workAuthorization?.startDate ? moment(userData.workAuthorization.startDate) : null,
                            'workAuthorization.endDate': userData.workAuthorization?.endDate ? moment(userData.workAuthorization.endDate) : null,
                        }
                        setInitialValues(formValues)
                        form.setFieldsValue(formValues)
                    } else {
                        message.error(data.Msg || 'Failed to fetch user info')
                    }
                })
                .catch(() => {
                    message.error('Server error')
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [username, token, form])

    const handleUploadChange = ({ fileList }: any) => setFileList(fileList)

    const onFinish: FormProps<IForm>['onFinish'] = async (values) => {
        let profilePictureBase64 = userInfo?.profilePicture

        if (fileList.length > 0 && fileList[0].originFileObj) {
            const reader = new FileReader()
            reader.readAsDataURL(fileList[0].originFileObj)
            reader.onload = () => {
                profilePictureBase64 = reader.result as string
                saveProfileInfo(values, profilePictureBase64)
            }
            reader.onerror = error => {
                message.error('Error reading file')
            }
        } else {
            saveProfileInfo(values, profilePictureBase64)
        }
    }

    const saveProfileInfo = (values: IForm, profilePictureBase64: string | undefined) => {
        // @ts-ignore
        const { usResidentType, workAuthorizationType, workAuthorizationOther } = values

        // Construct workAuthorization.title based on the form values
        let workAuthorizationTitle = ''
        if (usResidentType) {
            workAuthorizationTitle = usResidentType
        } else if (workAuthorizationType) {
            if (workAuthorizationType === 'other' && workAuthorizationOther) {
                workAuthorizationTitle = workAuthorizationOther
            } else {
                workAuthorizationTitle = workAuthorizationType
            }
        }

        // Ensure workAuthorization object exists
        values.workAuthorization = values.workAuthorization || {}
        values.workAuthorization.title = workAuthorizationTitle

        // Construct nested fields properly
        const nestedValues = {
            ...values,
            address: {
                // @ts-ignore
                building: values['address.building'],
                // @ts-ignore
                street: values['address.street'],
                // @ts-ignore
                city: values['address.city'],
                // @ts-ignore
                state: values['address.state'],
                // @ts-ignore
                zip: values['address.zip'],
            },
            contactInfo: {
                // @ts-ignore
                cellPhone: values['contactInfo.cellPhone'],
                // @ts-ignore
                workPhone: values['contactInfo.workPhone'],
            },
            workAuthorization: {
                ...values.workAuthorization,
                // @ts-ignore
                startDate: values['workAuthorization.startDate'],
                // @ts-ignore
                endDate: values['workAuthorization.endDate'],
            },
        }

        // Remove flat fields
        // @ts-ignore
        delete nestedValues['address.building']
        // @ts-ignore
        delete nestedValues['address.street']
        // @ts-ignore
        delete nestedValues['address.city']
        // @ts-ignore
        delete nestedValues['address.state']
        // @ts-ignore
        delete nestedValues['address.zip']
        // @ts-ignore
        delete nestedValues['contactInfo.cellPhone']
        // @ts-ignore
        delete nestedValues['contactInfo.workPhone']
        // @ts-ignore
        delete nestedValues['workAuthorization.startDate']
        // @ts-ignore
        delete nestedValues['workAuthorization.endDate']
        // @ts-ignore
        if (nestedValues['workAuthorization.title']) {// @ts-ignore
            nestedValues.workAuthorization.title = nestedValues['workAuthorization.title']
            // @ts-ignore
            delete nestedValues['workAuthorization.title']
        }

        axios
            .post(`http://localhost:8088/Employee/update/${username}`, { ...nestedValues, profilePicture: profilePictureBase64 }, {
                headers: { authorization: token },
            })
            .then(({ data }) => {
                if (data.Code === 200) {
                    message.success('User info updated successfully')
                } else {
                    message.error(data.Msg || 'Failed to update user info')
                }
            })
            .catch(() => {
                message.error('Server error')
            })
    }

    const handleEditClick = (field: string) => {
        setIsEditing({ ...isEditing, [field]: true })
    }

    const handleSaveClick = (field: string) => {
        setIsEditing({ ...isEditing, [field]: false })
    }

    const handleCancelClick = (field: string) => {
        Modal.confirm({
            title: 'Discard changes?',
            content: 'Are you sure you want to discard all of your changes?',
            onOk: () => {
                setIsEditing({ ...isEditing, [field]: false })
                form.setFieldsValue(initialValues)
            }
        })
    }

    const renderEditButtons = (field: string) => (
        <>
            {!isEditing[field] ? (
                <Button onClick={() => handleEditClick(field)}>Edit</Button>
            ) : (
                <>
                    <Button onClick={() => handleSaveClick(field)} type="primary">Save</Button>
                    <Button onClick={() => handleCancelClick(field)} style={{ marginLeft: 8 }}>Cancel</Button>
                </>
            )}
        </>
    )

    if (loading || !userInfo) {
        return <div>Loading...</div>
    }

    return (
        <Card
            title="Personal Information"
            bordered={false}
            style={{ maxWidth: 800, margin: '0 auto', marginTop: 20 }}
        >
            <Form
                layout="vertical"
                form={form}
                className="personal-info-form"
                onFinish={onFinish}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="Profile Picture">
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleUploadChange}
                                beforeUpload={() => false}
                            >
                                {fileList.length === 0 && <UploadOutlined />}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please input your first name!' }]}>
                            <Input placeholder="Input first name" disabled={!isEditing['firstName']} />
                        </Form.Item>
                        {renderEditButtons('firstName')}
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please input your last name!' }]}>
                            <Input placeholder="Input last name" disabled={!isEditing['lastName']} />
                        </Form.Item>
                        {renderEditButtons('lastName')}
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Preferred Name" name="preferredName" rules={[{ required: true, message: 'Please input your preferred name!' }]}>
                            <Input placeholder="Input preferred name" disabled={!isEditing['preferredName']} />
                        </Form.Item>
                        {renderEditButtons('preferredName')}
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                            <Input placeholder="Input email" disabled={!isEditing['email']} />
                        </Form.Item>
                        {renderEditButtons('email')}
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Date of Birth" name="dob" rules={[{ required: true, message: 'Please input your date of birth!' }]}>
                            <DatePicker style={{ width: '100%' }} disabled={!isEditing['dob']} />
                        </Form.Item>
                        {renderEditButtons('dob')}
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Please select your gender!' }]}>
                            <Select placeholder="Select gender" disabled={!isEditing['gender']}>
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                                <Option value="i do not wish to answer">I do not wish to answer</Option>
                            </Select>
                        </Form.Item>
                        {renderEditButtons('gender')}
                    </Col>
                    <Col span={12}>
                        <Form.Item label="SSN" name="ssn" rules={[{ required: true, message: 'Please input your SSN!' }]}>
                            <Input placeholder="Input SSN" disabled={!isEditing['ssn']} />
                        </Form.Item>
                        {renderEditButtons('ssn')}
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Building" name="address.building">
                            <Input placeholder="Input building" disabled={!isEditing['address.building']} />
                        </Form.Item>
                        {renderEditButtons('address.building')}
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Street" name="address.street" rules={[{ required: true, message: 'Please input your street!' }]}>
                            <Input placeholder="Input street" disabled={!isEditing['address.street']} />
                        </Form.Item>
                        {renderEditButtons('address.street')}
                    </Col>
                    <Col span={12}>
                        <Form.Item label="City" name="address.city" rules={[{ required: true, message: 'Please input your city!' }]}>
                            <Input placeholder="Input city" disabled={!isEditing['address.city']} />
                        </Form.Item>
                        {renderEditButtons('address.city')}
                    </Col>
                    <Col span={12}>
                        <Form.Item label="State" name="address.state" rules={[{ required: true, message: 'Please input your state!' }]}>
                            <Input placeholder="Input state" disabled={!isEditing['address.state']} />
                        </Form.Item>
                        {renderEditButtons('address.state')}
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Zip Code" name="address.zip" rules={[{ required: true, message: 'Please input your zip code!' }]}>
                            <Input placeholder="Input zip code" disabled={!isEditing['address.zip']} />
                        </Form.Item>
                        {renderEditButtons('address.zip')}
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Cell Phone" name="contactInfo.cellPhone" rules={[{ required: true, message: 'Please input your cell phone!' }]}>
                            <Input placeholder="Input cell phone" disabled={!isEditing['contactInfo.cellPhone']} />
                        </Form.Item>
                        {renderEditButtons('contactInfo.cellPhone')}
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Work Phone" name="contactInfo.workPhone">
                            <Input placeholder="Input work phone" disabled={!isEditing['contactInfo.workPhone']} />
                        </Form.Item>
                        {renderEditButtons('contactInfo.workPhone')}
                    </Col>
                    <Col span={24}>
                        <WorkAuthorizationForm form={form} workAuthTitle={userInfo?.workAuthorization?.title} />
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Upload Driver’s license and Work authorization">
                            <FileManagement />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item>
                            <Button type="primary" block htmlType="submit">
                                Update Info
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Card>
    )
}

export default PersonalInfo

import React from 'react'
import {
  Input,
  Form,
  FormProps,
  message,
  Card,
  Button,
} from 'antd'
import axios from 'axios'
import { IResult } from '../type';

const Home = () => {
  const [form] = Form.useForm()
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
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
          message.success('注册令牌发送成功')
          form.resetFields()
        } else {
          message.error(typeof data.Msg === 'string' ? data.Msg : '服务器错误')
        }
      }).catch(() => {
        //
      })
  }

  return (
    <Card>
      <Form form={form} style={{ width: 500 }} onFinish={onFinish} {...layout}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: 'email',
              message: '请输入合法的邮箱地址！'
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
        <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
export default Home

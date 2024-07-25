import React from 'react'
import { Button, Form, Input, message, FormProps } from 'antd'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { CloseOutlined } from '@ant-design/icons'
import axios from 'axios'
import { IResult } from '../type'

interface IForm {
  email: string
}

const Update = () => {
  const [form] = Form.useForm()

  const onFinish: FormProps<IForm>['onFinish'] = ({ email }) => {
    axios
      .post('http://localhost:8088/User/sendCode', {
        account: email
      })
      .then(({ data }: IResult) => {
        if (data.Code === 200) {
          message.success(data.Msg)
          setTimeout(() => {
          }, 1000)
        } else {
          message.error(typeof data.Msg === 'string' ? data.Msg : 'Unknown server error')
        }
      }).catch(() => {
        //
      })
  }

  return (
    <div className="page-container">
      <Header />
      <div className="main">
        <Form
          layout="vertical"
          form={form}
          className="login-form"
          onFinish={onFinish}
        >
          <h2 className="title">Update your password</h2>
          <CloseOutlined className="close" />
          <p className="msg">
            Enter your email link, we will send you the recovery link
          </p>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: 'email',
                message: 'Please enter a valid email address！'
              },
              { required: true, message: 'Please input your email!' }
            ]}
          >
            <Input placeholder="input Email" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" block htmlType="submit">
              Update password
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Footer />
    </div>
  )
}
export default Update

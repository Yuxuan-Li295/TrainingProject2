import React from 'react'
import { Button, Form, FormProps, Input, message } from 'antd'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'


import { useAppDispatch } from '../hooks/store'
import { login } from '../store/counterSlice'

interface IForm {
  username: string
  password: string
}
const Login = () => {
  const [form] = Form.useForm()
  const history = useNavigate()

  const dispatch = useAppDispatch()

  const onFinish: FormProps<IForm>['onFinish'] = ({ username, password }) => {
    if ((username === 'admin' && password === '123456') || (username === 'admin123' && password === '123456')) {
      dispatch(login(username))
      setTimeout(() => {
        history(`/`)
      }, 1000)
    }
    else {
      message.error('密码错误')
    }
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

          <h2 className="title">Sign in to your account</h2>
          <Form.Item
            label="username"
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' }
            ]}
          >
            <Input placeholder="input username" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input type="password" placeholder="input Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" block htmlType="submit">
              Sign in
            </Button>
          </Form.Item>

        </Form>
      </div>
      <Footer />
    </div>
  )
}
export default Login

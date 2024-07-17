import React, { useEffect } from 'react'
import { Button, Form, FormProps, Input, message } from 'antd'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { useAppDispatch, useAppSelector } from '../hooks/store'
import { login, setToken } from '../store/counterSlice'

interface IForm {
  username: string
  password: string
}

const Login = () => {
  const [form] = Form.useForm()
  const history = useNavigate()
  const dispatch = useAppDispatch()
  //const { isLogin } = useAppSelector(state => state.counter)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(setToken(token))
    }
  }, [dispatch])

  // useEffect(() => {
  //   if (isLogin) {
  //     history('/personal-info')
  //   }
  // }, [isLogin, history])

  const onFinish: FormProps<IForm>['onFinish'] = ({ username, password }) => {
    const account:string = username;
    axios
        .post('http://localhost:8088/User/login', {
          account,
          password,
        })
        .then(({ data }) => {
          if (data.Code === 200) {
            const { Token } = data;
            const token = Token;
            dispatch(login({ username, token }))
            localStorage.setItem('token', token)
            message.success('登录成功')
            if (account === 'hr') {
              setTimeout(() => {
                history(`/user/list`)
              }, 1000)
            } else {
              setTimeout(() => {
                history(`/personal-info`)
              }, 1000)
            }
          } else {
            message.error(typeof data.Msg === 'string' ? data.Msg : '服务器错误')
          }
        })
        .catch(() => {
          message.error('服务器错误')
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
            <h2 className="title">Sign in to your account</h2>
            <Form.Item
                label="Username"
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

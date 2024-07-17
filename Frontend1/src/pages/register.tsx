import React, {useEffect} from 'react'
import { Button, Form, FormProps, Input, message } from 'antd'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { CloseOutlined } from '@ant-design/icons'
import axios from 'axios'
import { IResult } from '../type'
import {useNavigate} from "react-router-dom";
import {login} from "../store/counterSlice";
import {useAppDispatch} from "../hooks/store";

function getUrlParams(url: string) {
  const urlParams = new URLSearchParams(url.split('?')[1])
  const params: any = {}
  for (let param of urlParams.entries()) {
    params[param[0]] = param[1]
  }
  return params
}
interface IForm {
  password: string
}
const Update = () => {
  const [form] = Form.useForm()

    const { id, code } = getUrlParams(window.location.search)
    const history = useNavigate()
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (!id || !code) {
            history('/login')
        }
    }, [history])

  const onFinish: FormProps<IForm>['onFinish'] = ({ password }) => {
    const { id, code } = getUrlParams(window.location.search)
    axios
        .post('http://localhost:8088/User/forgot', {
          account: id,
          password: password,
          code
        })
        .then(({ data }: IResult) => {
          if (data.Code === 200) {
            message.success(data.Msg)
              const token = ""
            // @ts-ignore
              dispatch(login({ username: id, token }))
            history('/onboard')
          } else {
            message.error(typeof data.Msg === 'string' ? data.Msg : '服务器错误')
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
            <h2 className="title">Create your password</h2>
            <CloseOutlined className="close" />
            <p className="msg">Enter your password</p>
            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input placeholder="input password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" block htmlType="submit">
                  Create password
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Footer />
      </div>
  )
}
export default Update

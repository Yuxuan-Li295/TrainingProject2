import React from 'react'
import { Button, Form, Input, message ,FormProps} from 'antd'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { CloseOutlined } from '@ant-design/icons'
import { useNavigate,  } from 'react-router-dom'
import axios from 'axios'
import { IResult } from '../type'

interface IForm {
  email:string
}

const Update = () => {
  const [form] = Form.useForm()
  const history = useNavigate()

  const onFinish: FormProps<IForm>['onFinish'] = ({ email }) => {
    axios
      .post('http://localhost:8088/User/sendCode', {
        account: email
      })
      .then(({data}:IResult) => {
        if (data.Code === 200) {
          message.success(data.Msg)
          setTimeout(() => {
            // history.push('/send')
          }, 1000)
        } else {
          message.error(data.Msg)
        }
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
                message: '请输入合法的邮箱地址！'
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

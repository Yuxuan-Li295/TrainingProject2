import React from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { CloseOutlined, CopyOutlined } from '@ant-design/icons'

const Send = () => {
  return (
    <div className="page-container">
      <Header />
      <div className="main">
        <div className="login-form">
          <CloseOutlined className="close" />
          <div className="send">
            <CopyOutlined
              style={{ fontSize: 40, marginBottom: 20, color: '#2754db' }}
            />
            <p className="content">
              We have sent the update password link to youremial, please check
              that !
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default Send

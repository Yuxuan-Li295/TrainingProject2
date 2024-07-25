import React from 'react'
import { createFromIconfontCN, YoutubeOutlined } from '@ant-design/icons'
import { Space } from 'antd'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js'
})

const Footer = () => {
  return (
    <div className="footer">
      <div className="copyright">@2022 All Rights Reserved.</div>
      <div className="list mobile">
        <span>Contactus </span>
        <span>Privacy Policies </span>
        <span>Help </span>
      </div>
      <Space>
        <YoutubeOutlined style={{ margin: '0 4px', fontSize: 19 }} />
        <IconFont
          type="icon-twitter"
          style={{ margin: '0 4px', fontSize: 19 }}
        />
        <IconFont
          type="icon-facebook"
          style={{ margin: '0 4px', fontSize: 19 }}
        />
      </Space>
      <div className="list pc">
        <span>Contactus </span>
        <span>Privacy Policies </span>
        <span>Help </span>
      </div>
    </div>
  )
}
export default Footer

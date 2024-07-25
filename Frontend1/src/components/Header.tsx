import React from 'react'
import { UserOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { RootState, useAppDispatch, useAppSelector } from '../hooks/store'
import { loginout } from '../store/counterSlice'

const Header = () => {
  const { Search } = Input
  const history = useNavigate()
  const dispatch = useAppDispatch()
  const { isLogin, userType } = useAppSelector((state: RootState) => state.counter)

  return (
    <div className="header">
      <div className="header-box">
        <div className="left">
          <div className="logo">
            <div className="first pc">{userType === 'HR' ? 'HR System' : 'Employee Portal'}</div>
            <div className="first mobile">{userType === 'HR' ? 'HR System' : 'Employee Portal'}</div>
            <span>{userType === 'HR' ? 'HR' : 'Employee'}</span>
          </div>
          {/* <Search placeholder=" search" allowClear className="pc" /> */}
        </div>
        <div className="right">
            <div
                className="right-item"
                onClick={() => {
                    if (isLogin) {
                        dispatch(loginout())
                        history('/login')
                    } else {
                        history('/')
                    }
                }}
            >
                <UserOutlined style={{fontSize: 20, marginRight: 10}}/>
                <span className="item-name">{isLogin ? 'Log out' : 'Sign in'}</span>
            </div>
        </div>
      </div>
        <div className="mobile">
            <Search placeholder=" search" allowClear />
      </div>
    </div>
  )
}
export default Header

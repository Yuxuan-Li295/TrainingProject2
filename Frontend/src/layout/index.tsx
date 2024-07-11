import { Layout, Menu, Breadcrumb } from 'antd'
import {
  UserOutlined,
  LaptopOutlined,
} from '@ant-design/icons'
import { Link, matchRoutes, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { routers } from '../router'
import Header from '../components/Header'
import React from 'react'
import { RootState, useAppSelector } from '../hooks/store'

const { SubMenu } = Menu
const { Content, Sider } = Layout

interface IRoutes {
  route: {
    path: string
    meta: {
      title: string
    }
  }
}
export default function AppLayout() {
  const location = useLocation()
  const history = useNavigate()
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>([])
  const [defaultOpenKeys, setDefaultOpenKeys] = useState<string[]>([])
  const [isInit, setIsInit] = useState<boolean>(false)
  const [breadcrumb, setBreadcrumb] = useState<IRoutes[]>([])

  const { isLogin } = useAppSelector((state: RootState) => state.counter)

  useEffect(() => {
    if (!isLogin) {
      history('/login')
    }
  }, [history, isLogin])

  useEffect(() => {
    const routes = matchRoutes(routers, location.pathname) // 返回匹配到的路由数组对象，每一个对象都是一个路由对象
    const pathArrs: IRoutes[] = []
    const pathArr: string[] = []
    if (routes !== null) {
      routes.forEach((item) => {
        const path = item.route.path
        if (path) {
          pathArr.push(path)
        }
        pathArrs.push(item as IRoutes)
      })
    }
    setDefaultSelectedKeys(pathArr)
    setBreadcrumb(pathArrs)
    setDefaultOpenKeys(pathArr)
    setIsInit(true)
  }, [location.pathname])
  if (!isInit) {
    return null
  }
  return (
    <>
      <Layout>
        <Header />
        <Layout className="container">
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={defaultSelectedKeys}
              defaultOpenKeys={defaultOpenKeys}
              style={{ height: '100%', borderRight: 0 }}
            >
              <SubMenu key="/user" icon={<UserOutlined />} title="员工档案">
                <Menu.Item key="/user/list">
                  <Link to="/user/list">用户信息</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="/sign"
                icon={<LaptopOutlined />}
                title="签证状态管理"
              >
                <Menu.Item key="/sign/list">
                  <Link to="/sign/list">签证状态</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="/apply" icon={<LaptopOutlined />} title="招聘管理">
                <Menu.Item key="/apply/list">
                  <Link to="/apply/list">入职申请</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }} separator=">">
              {breadcrumb.map((item, index) => {
                return (
                  <Breadcrumb.Item key={index}>
                    {item?.route?.meta?.title}
                  </Breadcrumb.Item>
                )
              })}
            </Breadcrumb>
            <Content
              className="site-layout-background"
              style={{
                margin: 0,
                minHeight: 280
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </>
  )
}

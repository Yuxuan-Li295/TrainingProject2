import { Layout, Menu, Breadcrumb, MenuProps } from 'antd'
import {
  UserOutlined,
  LaptopOutlined,
} from '@ant-design/icons'
import { matchRoutes, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { routers } from '../router'
import Header from '../components/Header'
import React from 'react'
import { RootState, useAppSelector } from '../hooks/store'


const { Content, Sider } = Layout


interface IPathArrs {
  title: string
}
export default function AppLayout() {
  const location = useLocation()
  const history = useNavigate()
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>([])
  const [defaultOpenKeys, setDefaultOpenKeys] = useState<string[]>([])
  const [isInit, setIsInit] = useState<boolean>(false)
  const [breadcrumb, setBreadcrumb] = useState<IPathArrs[]>([])
  type MenuItem = Required<MenuProps>['items'][number];
  const { isLogin, username } = useAppSelector((state: RootState) => state.counter)

  useEffect(() => {
    if (!isLogin || username!=='hr') {
      history('/login')
    }
  }, [history, isLogin])

  useEffect(() => {
    const routes = matchRoutes(routers, location.pathname) // Returns an array of mached route objects each of which is a route object
    const pathArrs: IPathArrs[] = []
    const pathArr: string[] = []
    if (routes !== null) {
      routes.forEach((item) => {
        const path = item.route.path
        if (path) {
          pathArr.push(path)
        }
        pathArrs.push({ title: item?.route?.meta?.title as string })
      })
    }
    setDefaultSelectedKeys(pathArr)
    setBreadcrumb(pathArrs)
    setDefaultOpenKeys(pathArr)
    setIsInit(true)
  }, [location.pathname])

  const items: MenuItem[] = [
    {
      key: '/user',
      label: 'Employee Records',
      icon: <UserOutlined />,
      children: [
        {
          key: '/user/list',
          label: 'User Information',
        },
      ]
    },
    {
      key: '/sign',
      label: 'Visa Status Management',
      icon: <LaptopOutlined />,
      children: [
        {
          key: '/sign/list',
          label: 'Visa Status',
        },
      ]
    },
    {
      key: '/apply',
      label: 'Hiring Management',
      icon: <LaptopOutlined />,
      children: [
        {
          key: '/apply/list',
          label: 'Onboard Application',
        },
      ]
    },
    {
      key: '/create/user',
      label: 'Employee Registration Token',
      icon: <LaptopOutlined />,

    }
  ]
  const onClick: MenuProps['onClick'] = (e) => {
    history(e.key)
  };
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
              items={items}
              onClick={onClick}
              style={{ height: '100%', borderRight: 0 }}
            >
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }} separator=">" items={breadcrumb}></Breadcrumb>
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
      </Layout >
    </>
  )
}

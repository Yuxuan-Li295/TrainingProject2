import { Breadcrumb, Layout, Menu, MenuProps } from "antd";
import { useEffect, useState } from "react";
import { matchRoutes, Outlet, useLocation, useNavigate } from "react-router-dom";
import { RootState, useAppSelector } from "../hooks/store";
import { routers } from "../router";
import { IdcardOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import Header from '../components/Header';
import Footer from '../components/Footer'; 

const { Content, Sider } = Layout;

interface IPathArrs {
  title: string;
}

const UserLayout = () => {
  const location = useLocation();
  const history = useNavigate();
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>([]);
  const [defaultOpenKeys, setDefaultOpenKeys] = useState<string[]>([]);
  const [isInit, setIsInit] = useState<boolean>(false);
  const [breadcrumb, setBreadcrumb] = useState<IPathArrs[]>([]);
  type MenuItem = Required<MenuProps>['items'][number];
  const { isLogin } = useAppSelector((state: RootState) => state.counter);

  useEffect(() => {
    if (!isLogin) {
      history('/login');
    }
  }, [history, isLogin]);

  useEffect(() => {
    const routes = matchRoutes(routers, location.pathname);
    const pathArrs: IPathArrs[] = [];
    const pathArr: string[] = [];
    if (routes != null) {
      routes.forEach((item) => {
        const path = item.route.path;
        if (path) {
          pathArr.push(path);
        }
        pathArrs.push({ title: item?.route?.meta?.title as string });
      });
    }
    setDefaultSelectedKeys(pathArr);
    setBreadcrumb(pathArrs);
    setDefaultOpenKeys(pathArr);
    setIsInit(true);
  }, [location.pathname]);

  const items: MenuItem[] = [
    {
      key: '/personal-info',
      label: 'Personal Info',
      icon: <UserOutlined />,
    },
    {
      key: '/visa-status',
      label: 'Visa Status',
      icon: <IdcardOutlined />,
    },
  ];
  const onClick: MenuProps['onClick'] = (e) => {
    history(e.key);
  }

  if (!isInit) {
    return null;
  }

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={defaultSelectedKeys}
              defaultOpenKeys={defaultOpenKeys}
              items={items}
              onClick={onClick}
              style={{ height: '100%', borderRight: 0, paddingTop: 64 }}
            />
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }} separator=">" items={breadcrumb} />
            <Content
              style={{
                background: '#fff',
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </Layout>
      <Footer />
    </>
  )
}

export default UserLayout;

import { lazy, ReactNode, Suspense } from 'react'

// 切换页面会出现闪屏现象
// 解决思路：公共页面不采用懒加载的方式 并在App.tsx去除Suspense的包裹
import AppLayout from '../layout'

const Home = lazy(() => import('../pages/index'))
const Login = lazy(() => import('../pages/login'))
const Regsiter = lazy(() => import('../pages/regsiter'))
const Forgot = lazy(() => import('../pages/forgot'))
const Send = lazy(() => import('../pages/send'))
const Update = lazy(() => import('../pages/update'))
const Sign = lazy(() => import('../pages/sign'))
const Apply = lazy(() => import('../pages/apply'))
const User = lazy(() => import('../pages/user'))
const UserInfo = lazy(() => import('../pages/userInfo'))

// 实现懒加载的用Suspense包裹 定义函数
const lazyLoad = (children) => {
  return <Suspense fallback={<h1>Loading...</h1>}>{children}</Suspense>
}

export const routers = [
  {
    path: '/',
    element: <AppLayout />,
    meta: {
      title: '首页'
    },
    //路由嵌套，子路由的元素需使用<Outlet />
    children: [
      {
        index: true,
        element: lazyLoad(<User />)
      },
      {
        path: '/user/list',
        meta: {
          title: '员工档案'
        },
        element: lazyLoad(<User />)
      },
      {
        path: '/user/info/:id',
        meta: {
          title: ''
        },
        element: lazyLoad(<UserInfo />)
      },
      {
        path: '/sign/list',
        meta: {
          title: '签证状态管理'
        },
        element: lazyLoad(<Sign />)
      },
      {
        path: '/apply/list',
        meta: {
          title: '招聘管理'
        },
        element: lazyLoad(<Apply />)
      }
    ]
  },
  {
    path: '/login',
    element: lazyLoad(<Login />)
  },
  {
    path: '/forgot',
    element: lazyLoad(<Forgot />)
  },
  {
    path: '/regsiter',
    element: lazyLoad(<Regsiter />)
  },
  {
    path: '/send',
    element: lazyLoad(<Send />)
  },
  {
    path: '/update',
    element: lazyLoad(<Update />)
  }
]

import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import AppLayout from '../layout';
import UserLayout from '../layout/UserLayout';

const Login = lazy(() => import('../pages/login'));
const Register = lazy(() => import('../pages/register'));
const Forgot = lazy(() => import('../pages/forgot'));
const Send = lazy(() => import('../pages/send'));
const Update = lazy(() => import('../pages/update'));
const Sign = lazy(() => import('../pages/sign'));
const Apply = lazy(() => import('../pages/apply'));
const User = lazy(() => import('../pages/user'));
const UserInfo = lazy(() => import('../pages/userInfo'));
const CreateUser = lazy(() => import('../pages/createUser'));
const PersonalInfo = lazy(() => import('../pages/PersonalInfo'));
const Onboard = lazy(() => import('../pages/onboard'));
const UserVisaStatus = lazy(() => import('../pages/UserVisaStatus'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const lazyLoad = (children) => {
  return <Suspense fallback={<h1>Loading...</h1>}>{children}</Suspense>;
}

export const routers = [
  {
    path: '/',
    element: <AppLayout />,
    meta: {
      title: 'Home Page'
    },
    children: [
      {
        index: true,
        element: <Navigate to="/user/list" replace />,
        meta: {
          title: 'Employee Document'
        }
      },
      {
        path: '/user/list',
        meta: {
          title: 'Employee Document'
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
          title: 'Visa Status Management'
        },
        element: lazyLoad(<Sign />)
      },
      {
        path: '/apply/list',
        meta: {
          title: 'Hiring Management'
        },
        element: lazyLoad(<Apply />)
      },
      {
        path: '/create/user',
        meta: {
          title: 'Generate Token'
        },
        element: lazyLoad(<CreateUser />)
      },
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
    path: '/register',
    element: lazyLoad(<Register />)
  },
  {
    path: '/send',
    element: lazyLoad(<Send />)
  },
  {
    path: '/update',
    element: lazyLoad(<Update />)
  },
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        path: 'personal-info',
        meta: {
          title: 'Personal Information'
        },
        element: lazyLoad(<PersonalInfo />)
      },
      {
        path: 'visa-status',
        meta: {
          title: 'Visa Status'
        },
        element: lazyLoad(<UserVisaStatus />)
      }
    ]
  },
  {
    path: '/onboard',
    meta: {
      title: 'onboard'
    },
    element: lazyLoad(<Onboard />)
  },
  {
    path: '*',
    element: lazyLoad(<NotFoundPage />)
  }
];

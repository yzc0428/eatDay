import { useState } from 'react'
import { Layout, Menu, Typography } from 'antd'
import {
  HomeOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  HistoryOutlined,
  HeartOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import AppRoutes from '@/routes'

const { Header, Sider, Content } = Layout
const { Title } = Typography

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/dishes',
      icon: <AppstoreOutlined />,
      label: '菜品管理',
    },
    {
      key: '/order',
      icon: <ShoppingCartOutlined />,
      label: '点餐',
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: '历史记录',
    },
    {
      key: '/favorites',
      icon: <HeartOutlined />,
      label: '我的收藏',
    },
    {
      key: '/statistics',
      icon: <BarChartOutlined />,
      label: '统计分析',
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          🍽️ 今天吃什么
        </Title>
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
          style={{
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
            position: 'sticky',
            top: 64,
            left: 0,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
              borderRadius: 8,
            }}
          >
            <AppRoutes />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default AppLayout

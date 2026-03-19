import { useState } from 'react'
import { Layout, Menu } from 'antd'
import {
  BankOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import AppRoutes from '@/routes'

const { Sider, Content } = Layout

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/planning',
      icon: <BankOutlined />,
      label: '计划控制台',
    },
    {
      key: '/bidding',
      icon: <BankOutlined />,
      label: '商家降价',
    },
    {
      key: '/decision',
      icon: <BankOutlined />,
      label: '决策单控制台',
    },
    {
      key: '/delivery',
      icon: <BankOutlined />,
      label: '即时配送工作台',
    },
    {
      key: '/warehouse',
      icon: <BankOutlined />,
      label: '仓库管理',
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'sticky',
            top: 0,
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

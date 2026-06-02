import { Layout } from 'antd'
import { Content, Footer, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import type React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layouts({ children }: LayoutProps) {
  return (
    <Layout>
      <Sider width="25%">Sider</Sider>
      <Layout>
        <Header>Header</Header>
        <Content>{children}</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  )
}

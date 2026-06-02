import React from 'react'
import { Card, Col, Row, Statistic, Typography } from 'antd'
import {
  TeamOutlined,
  IdcardOutlined,
  SolutionOutlined,
  ApartmentOutlined,
  BankOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { getDashboardStatsApi } from '@/apis/dashboard'
import { useAuthStore } from '@/store'
import { Role } from '@/apis/types'

const { Title } = Typography

export const Component: React.FC = () => {
  const { user } = useAuthStore()
  const userRole = user?.role

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => getDashboardStatsApi().then(res => (res as any).data),
  })

  const stats = data || {
    totalStudents: 0,
    totalTeachers: 0,
    totalResearchGroups: 0,
    totalUsers: 0,
    totalClasses: 0,
    pendingUsers: 0,
  }

  const cards = [
    { title: '用户总数', value: stats.totalUsers, icon: <TeamOutlined />, color: '#1677ff', roles: [Role.ADMIN] },
    { title: '待审核', value: stats.pendingUsers, icon: <ClockCircleOutlined />, color: '#faad14', roles: [Role.ADMIN] },
    { title: '教师总数', value: stats.totalTeachers, icon: <IdcardOutlined />, color: '#52c41a' },
    { title: '学生总数', value: stats.totalStudents, icon: <SolutionOutlined />, color: '#fa8c16' },
    { title: '班级总数', value: stats.totalClasses, icon: <BankOutlined />, color: '#eb2f96' },
    { title: '教研组数', value: stats.totalResearchGroups, icon: <ApartmentOutlined />, color: '#722ed1' },
  ]

  const visibleCards = cards.filter(card => !card.roles || card.roles.includes(userRole as string))

  return (
    <div className="p-6">
      <Title level={3} className="mb-6">仪表盘</Title>
      <Row gutter={[16, 16]}>
        {visibleCards.map(card => (
          <Col xs={24} sm={12} lg={6} key={card.title}>
            <Card loading={isLoading}>
              <Statistic
                title={card.title}
                value={card.value}
                prefix={<span style={{ color: card.color, fontSize: 24 }}>{card.icon}</span>}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Component

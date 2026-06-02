import React, { useEffect, useRef } from 'react'
import { Card, Col, Row, Select, Typography } from 'antd'
import {
  TeamOutlined,
  IdcardOutlined,
  SolutionOutlined,
  ApartmentOutlined,
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import * as echarts from 'echarts'
import { getDashboardStatsApi } from '@/apis/dashboard'
import { Grade, GradeLabel } from '@/apis/types'

const { Title, Text } = Typography

const gradeOptions = Object.values(Grade).map(g => ({
  value: g,
  label: GradeLabel[g],
}))

export const Component: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const [grade, setGrade] = React.useState<string | undefined>(undefined)

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats', grade],
    queryFn: () =>
      getDashboardStatsApi(grade).then(res => (res as unknown as Record<string, unknown>).data),
  })

  const stats = (data as Record<string, unknown> | null) || {
    totals: { teachers: 0, students: 0, classes: 0, research_groups: 0 },
    distribution: [],
    description: '',
  }

  const totals = stats.totals as Record<string, number>
  const distribution = (stats.distribution || []) as { label: string; count: number }[]
  const description = (stats.description as string) || ''

  // ECharts 初始化与更新
  useEffect(() => {
    if (!chartRef.current) return

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    const option: echarts.EChartsOption = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: 40, right: 20, top: 20, bottom: 30 },
      xAxis: {
        type: 'category',
        data: distribution.map(d => d.label),
        axisLabel: { rotate: distribution.length > 6 ? 30 : 0 },
      },
      yAxis: {
        type: 'value',
        name: '人数',
        minInterval: 1,
      },
      series: [
        {
          type: 'bar',
          data: distribution.map(d => d.count),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#1677ff' },
              { offset: 1, color: '#69b1ff' },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
          barWidth: distribution.length > 6 ? '50%' : 30,
        },
      ],
    }

    chartInstance.current.setOption(option)

    const handleResize = () => chartInstance.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [distribution])

  // 组件卸载时销毁图表
  useEffect(() => {
    return () => {
      chartInstance.current?.dispose()
      chartInstance.current = null
    }
  }, [])

  const statCards = [
    { title: '教师总数', value: totals.teachers, icon: <IdcardOutlined />, color: '#52c41a' },
    { title: '学生总数', value: totals.students, icon: <SolutionOutlined />, color: '#fa8c16' },
    { title: '班级总数', value: totals.classes, icon: <TeamOutlined />, color: '#eb2f96' },
    { title: '教研组数', value: totals.research_groups, icon: <ApartmentOutlined />, color: '#722ed1' },
  ]

  return (
    <div className="p-6">
      <Title level={3} className="mb-6">仪表盘</Title>

      <Row gutter={[16, 16]} className="mb-6">
        {statCards.map(card => (
          <Col xs={24} sm={12} lg={6} key={card.title}>
            <Card loading={isLoading} className="text-center">
              <div className="text-3xl font-bold" style={{ color: card.color }}>
                {card.value}
              </div>
              <div className="mt-2 text-gray-500">
                <span style={{ color: card.color, marginRight: 6 }}>{card.icon}</span>
                {card.title}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        loading={isLoading}
        title={
          <div className="flex items-center gap-4">
            <span>人数分布</span>
            <Select
              value={grade}
              onChange={setGrade}
              allowClear
              placeholder="全校"
              style={{ width: 140 }}
              options={gradeOptions}
              onClear={() => setGrade(undefined)}
            />
            {description && <Text type="secondary">{description}</Text>}
          </div>
        }
      >
        <div ref={chartRef} style={{ height: 360 }} />
      </Card>
    </div>
  )
}

export default Component

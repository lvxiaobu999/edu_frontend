import React, { useEffect, useMemo, useRef } from 'react'
import { Card, Col, Row, Select, Typography } from 'antd'
import {
  TeamOutlined,
  IdcardOutlined,
  SolutionOutlined,
  ApartmentOutlined,
} from '@ant-design/icons'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
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

  const { data: stats, isPending } = useQuery({
    queryKey: ['dashboard-stats', grade],
    queryFn: () => getDashboardStatsApi(grade),
    placeholderData: keepPreviousData,
  })

  const totals = stats?.totals || { teachers: 0, students: 0, classes: 0, research_groups: 0 }
  const distribution = useMemo(() => stats?.distribution || [], [stats?.distribution])
  const description = stats?.description || ''

  // ECharts 初始化与更新
  useEffect(() => {
    if (!chartRef.current) return

    // 检查实例容器是否仍是当前 DOM，不是则重建
    const instance = chartInstance.current
    if (instance && !instance.isDisposed() && instance.getDom() !== chartRef.current) {
      instance.dispose()
      chartInstance.current = null
    }
    if (!chartInstance.current || chartInstance.current.isDisposed()) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    const hasData = distribution.length > 0

    const option: echarts.EChartsOption = {
      title: hasData
        ? undefined
        : {
            text: '暂无分布数据',
            left: 'center',
            top: 'center',
            textStyle: { color: '#999', fontSize: 14 },
          },
      tooltip: hasData ? { trigger: 'axis', axisPointer: { type: 'shadow' } } : undefined,
      grid: { left: 40, right: 20, top: 20, bottom: 30 },
      xAxis: hasData
        ? {
            type: 'category',
            data: distribution.map(d => d.label),
            axisLabel: { rotate: distribution.length > 6 ? 30 : 0 },
          }
        : { show: false },
      yAxis: hasData ? { type: 'value', name: '人数', minInterval: 1 } : { show: false },
      series: hasData
        ? [
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
          ]
        : [],
    }

    chartInstance.current.setOption(option, { notMerge: true })

    const handleResize = () => chartInstance.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [distribution])

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
    {
      title: '教研组数',
      value: totals.research_groups,
      icon: <ApartmentOutlined />,
      color: '#722ed1',
    },
  ]

  return (
    <div className="p-6">
      <Title level={3} className="mb-6">
        仪表盘
      </Title>

      <Row gutter={[16, 16]} className="mb-6">
        {statCards.map(card => (
          <Col xs={24} sm={12} lg={6} key={card.title}>
            <Card loading={isPending} className="text-center">
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

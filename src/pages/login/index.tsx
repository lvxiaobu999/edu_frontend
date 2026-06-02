import React, { useState } from 'react'
import { Form, Input, Button, Card, App } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { loginApi } from '@/apis/auth'
import { useAuthStore } from '@/store'
import type { ApiResponse, LoginResponse } from '@/apis/types'

export const Component: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const { message } = App.useApp()

  const loginMutation = useMutation({
    mutationFn: async (values: { username: string; password: string }) => {
      const res = await loginApi(values)
      // interceptor unwraps AxiosResponse at runtime, but TS sees it as AxiosResponse<ApiResponse<LoginResponse>>
      return (res as unknown as ApiResponse<LoginResponse>).data
    },
  })

  const onFinish = (values: { username: string; password: string }) => {
    setLoading(true)
    loginMutation.mutate(values, {
      onSuccess: loginRes => {
        setAuth(loginRes)
        message.success('登录成功')
        navigate('/dashboard', { replace: true })
      },
      onError: () => {
        message.error('登录失败，请检查账号和密码')
      },
      onSettled: () => {
        setLoading(false)
      },
    })
  }

  const initialValues = {
    username: import.meta.env.VITE_ACCOUNT,
    password: import.meta.env.VITE_PASSWORD,
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card title="教育管理系统" style={{ width: 400 }}>
        <Form initialValues={initialValues} onFinish={onFinish} size="large" autoComplete="off">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center text-gray-400 text-sm">
          <p>测试账号: admin</p>
          <p>密码: admin123456</p>
        </div>
      </Card>
    </div>
  )
}

export default Component

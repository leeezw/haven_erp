'use client'

import { Card } from "@/components/ui/card"
import { 
  Users, 
  ScrollText, 
  Briefcase, 
  Building2, 
  TrendingUp, 
  Activity,
  Calendar,
  Star
} from "lucide-react"
import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const data = [
  { name: '一月', value: 3200 },
  { name: '二月', value: 3400 },
  { name: '三月', value: 3600 },
  { name: '四月', value: 3800 },
  { name: '五月', value: 3600 },
  { name: '六月', value: 3900 },
]

const recentTasks = [
  { id: 1, title: '天庭年度大会', date: '2024-03-20', status: 'upcoming' },
  { id: 2, title: '西游量劫筹备', date: '2024-03-18', status: 'in-progress' },
  { id: 3, title: '蟠桃园整修', date: '2024-03-15', status: 'completed' },
]

const topDeities = [
  { name: '孙悟空', department: '天兵部', rank: 'S', performance: 98 },
  { name: '二郎神', department: '天兵部', rank: 'S', performance: 96 },
  { name: '哪吒', department: '天兵部', rank: 'S', performance: 95 },
]

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('month')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">欢迎回来，天帝陛下</h2>
          <p className="text-gray-500 mt-2">今日天气晴朗，万里无云，适合处理政务</p>
        </div>
        <div className="flex gap-2">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm ${
                timeRange === range
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === 'week' ? '本周' : range === 'month' ? '本月' : '本年'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-500">在职神仙</h3>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold">36,000</p>
          <p className="text-sm text-green-600">↑ 较上月增长 2.5%</p>
        </Card>
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-500">待批奏折</h3>
            <ScrollText className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold">128</p>
          <p className="text-sm text-red-600">↑ 较昨日增加 12 件</p>
        </Card>
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-500">进行中任务</h3>
            <Briefcase className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold">25</p>
          <p className="text-sm text-gray-500">按时完成率 95%</p>
        </Card>
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-500">部门数量</h3>
            <Building2 className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-blue-600">运转效率 98%</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              神仙数量趋势
            </h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                近期重要任务
              </h3>
            </div>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.date}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'upcoming' 
                      ? 'bg-blue-100 text-blue-700'
                      : task.status === 'in-progress'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {task.status === 'upcoming' ? '即将开始' : task.status === 'in-progress' ? '进行中' : '已完成'}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                绩效排行榜
              </h3>
            </div>
            <div className="space-y-4">
              {topDeities.map((deity, index) => (
                <div 
                  key={deity.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{deity.name}</p>
                      <p className="text-sm text-gray-500">{deity.department} · {deity.rank}级</p>
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-primary">{deity.performance}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 
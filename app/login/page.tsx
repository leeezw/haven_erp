import { LoginForm } from '@/components/auth/LoginForm'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">天庭管理系统</h1>
          <p className="text-gray-500 mt-2">请登录以继续</p>
        </div>
        <LoginForm />
      </Card>
    </div>
  )
} 
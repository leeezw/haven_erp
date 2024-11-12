import LoginForm from '@/components/LoginForm'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-700">天庭管理系统</h1>
        <LoginForm />
      </div>
    </main>
  )
}

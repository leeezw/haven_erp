'use client'

import React from 'react'
import { useToast } from "@/components/ui/use-toast"

interface Props {
  children: React.ReactNode
}

export default function ErrorBoundary({ children }: Props) {
  const { toast } = useToast()

  // 全局错误处理
  const handleError = (error: Error) => {
    console.error('Global error:', error)
    
    // 显示友好的错误提示
    toast({
      title: "操作失败",
      description: error.message || "发生了一些错误，请稍后重试",
      variant: "destructive"
    })
  }

  // 捕获未处理的 Promise 异常
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault()
      handleError(event.reason)
    }

    // 捕获运行时错误
    const handleError = (event: ErrorEvent) => {
      event.preventDefault()
      handleError(event.error)
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      {children}
    </React.Suspense>
  )
} 
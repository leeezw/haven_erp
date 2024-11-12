type ToastProps = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  action?: React.ReactNode
}

type Toast = {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  action?: React.ReactNode
} 
import { NextResponse } from 'next/server'
import { DepartmentService } from '@/lib/services/department.service'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const updatedDepartment = await DepartmentService.updateStatus(params.id, status)
    return NextResponse.json(updatedDepartment)
  } catch (error) {
    console.error('Error updating department status:', error)
    return NextResponse.json(
      { error: 'Failed to update department status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 
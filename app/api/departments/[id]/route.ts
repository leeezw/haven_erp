import { NextResponse } from 'next/server'
import { DepartmentService } from '@/lib/services/department.service'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const department = await request.json()
    const updatedDepartment = await DepartmentService.update(params.id, department)
    return NextResponse.json(updatedDepartment)
  } catch (error) {
    console.error('Error updating department:', error)
    return NextResponse.json(
      { error: 'Failed to update department', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 
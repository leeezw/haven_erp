import { NextResponse } from 'next/server'
import { DepartmentService } from '@/lib/services/department.service'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { leaderId } = await request.json()
    const updatedDepartment = await DepartmentService.updateLeader(params.id, leaderId)
    return NextResponse.json(updatedDepartment)
  } catch (error) {
    console.error('Error updating department leader:', error)
    return NextResponse.json(
      { error: 'Failed to update department leader', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 
import { NextResponse } from 'next/server'
import { DepartmentService } from '@/lib/services/department.service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tree = searchParams.get('tree') === 'true'
    
    const departments = await DepartmentService.findAll()
    
    if (tree) {
      const departmentTree = await DepartmentService.buildDepartmentTree(departments)
      return NextResponse.json(departmentTree)
    }
    
    return NextResponse.json(departments)
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch departments', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const department = await request.json()
    const newDepartment = await DepartmentService.create(department)
    return NextResponse.json(newDepartment)
  } catch (error) {
    console.error('Error creating department:', error)
    return NextResponse.json(
      { error: 'Failed to create department', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
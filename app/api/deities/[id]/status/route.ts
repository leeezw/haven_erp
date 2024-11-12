import { NextResponse } from 'next/server'
import { DeityService } from '@/lib/services/deity.service'
import { DeityStatus } from '@/types'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json() as { status: DeityStatus }
    const updatedDeity = await DeityService.updateStatus(params.id, status)
    return NextResponse.json(updatedDeity)
  } catch (error) {
    console.error('Error updating deity status:', error)
    return NextResponse.json(
      { error: 'Failed to update deity status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 
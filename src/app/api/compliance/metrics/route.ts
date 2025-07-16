import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { Database } from '../../../../types/database'

type ComplianceMetric = Database['public']['Tables']['compliance_metrics']['Row']

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('compliance_metrics')
      .select('*')
      .eq('project_id', projectId)
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching compliance metrics:', error)
      return NextResponse.json({ error: 'Failed to fetch compliance metrics' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in compliance metrics API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { project_id, metric_type, value, target_value, unit, period, date } = body

    if (!project_id || !metric_type || value === undefined || !unit || !period || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('compliance_metrics')
      .insert({
        project_id,
        metric_type,
        value,
        target_value,
        unit,
        period,
        date
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating compliance metric:', error)
      return NextResponse.json({ error: 'Failed to create compliance metric' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in compliance metrics API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Metric ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('compliance_metrics')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating compliance metric:', error)
      return NextResponse.json({ error: 'Failed to update compliance metric' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in compliance metrics API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Metric ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('compliance_metrics')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting compliance metric:', error)
      return NextResponse.json({ error: 'Failed to delete compliance metric' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Compliance metric deleted successfully' })
  } catch (error) {
    console.error('Error in compliance metrics API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
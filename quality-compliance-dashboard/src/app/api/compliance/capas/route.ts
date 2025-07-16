import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { Database } from '../../../../types/database'

type CAPA = Database['public']['Tables']['capas']['Row']

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('capas')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching CAPAs:', error)
      return NextResponse.json({ error: 'Failed to fetch CAPAs' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in CAPAs API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      project_id, 
      capa_number, 
      title, 
      description, 
      type, 
      status = 'open', 
      priority = 'medium', 
      due_date, 
      assigned_to, 
      created_by 
    } = body

    if (!project_id || !capa_number || !title || !type || !created_by) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('capas')
      .insert({
        project_id,
        capa_number,
        title,
        description,
        type,
        status,
        priority,
        due_date,
        assigned_to,
        created_by
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating CAPA:', error)
      return NextResponse.json({ error: 'Failed to create CAPA' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in CAPAs API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'CAPA ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('capas')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating CAPA:', error)
      return NextResponse.json({ error: 'Failed to update CAPA' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in CAPAs API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'CAPA ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('capas')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting CAPA:', error)
      return NextResponse.json({ error: 'Failed to delete CAPA' }, { status: 500 })
    }

    return NextResponse.json({ message: 'CAPA deleted successfully' })
  } catch (error) {
    console.error('Error in CAPAs API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
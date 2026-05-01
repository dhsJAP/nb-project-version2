import { StaffMember } from '@/type'
import { getSupabase } from '@/lib/supabase'

export async function getStaffMembers(): Promise<StaffMember[]> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('staff')
    .select('id, name, role, image_url')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Failed to fetch staff:', error.message)
    return []
  }

  return data ?? []
}

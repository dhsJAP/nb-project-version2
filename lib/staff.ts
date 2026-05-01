import { StaffMember } from '@/type'
import { STAFF_MEMBERS } from '@/constants/staff'
import { getSupabase } from '@/lib/supabase'

function mapFallbackStaff(): StaffMember[] {
  return STAFF_MEMBERS.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    image_url: member.image_url,
  }))
}

export async function getStaffMembers(): Promise<StaffMember[]> {
  const supabase = getSupabase()

  const primary = await supabase
    .from('staff')
    .select('id, name, role, image_url')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (!primary.error && (primary.data?.length ?? 0) > 0) {
    return primary.data as StaffMember[]
  }

  if (primary.error && /is_active/.test(primary.error.message)) {
    const legacy = await supabase
      .from('staff')
      .select('id, name, role, image_url')
      .order('created_at', { ascending: true })

    if (!legacy.error && (legacy.data?.length ?? 0) > 0) {
      return legacy.data as StaffMember[]
    }

    if (legacy.error) {
      console.error('Failed to fetch staff (legacy query):', legacy.error.message)
    }
  } else if (primary.error) {
    console.error('Failed to fetch staff:', primary.error.message)
  }

  return mapFallbackStaff()
}

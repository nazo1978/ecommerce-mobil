'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
// Utility functions moved inline to avoid server-only imports
const getRoleDisplayName = (role: string) => {
  switch (role) {
    case 'admin': return 'Yönetici'
    case 'seller': return 'Satıcı'
    case 'user': return 'Kullanıcı'
    default: return 'Kullanıcı'
  }
}

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'admin': return 'destructive' as const
    case 'seller': return 'default' as const
    case 'user': return 'secondary' as const
    default: return 'secondary' as const
  }
}
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface UserRoleManagerProps {
  userId: string
  currentRole: 'user' | 'seller' | 'admin'
}

export function UserRoleManager({ userId, currentRole }: UserRoleManagerProps) {
  const [selectedRole, setSelectedRole] = useState<'user' | 'seller' | 'admin'>(currentRole)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleRoleUpdate = async () => {
    if (selectedRole === currentRole) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      })

      if (!response.ok) {
        throw new Error('Failed to update role')
      }

      toast.success(`Kullanıcı rolü ${getRoleDisplayName(selectedRole)} olarak güncellendi`)
      router.refresh()
    } catch (error) {
      console.error('Role update error:', error)
      toast.error('Rol güncellenirken bir hata oluştu')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Select value={selectedRole} onValueChange={(value: 'user' | 'seller' | 'admin') => setSelectedRole(value)}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">Kullanıcı</SelectItem>
          <SelectItem value="seller">Satıcı</SelectItem>
          <SelectItem value="admin">Yönetici</SelectItem>
        </SelectContent>
      </Select>
      
      {selectedRole !== currentRole && (
        <Button
          size="sm"
          onClick={handleRoleUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
        </Button>
      )}
    </div>
  )
}

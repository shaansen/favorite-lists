import { useMemo } from 'react'
import { createAvatar } from '@dicebear/core'
import { thumbs } from '@dicebear/collection'

interface AvatarProps {
  name: string
  size?: number
}

export function Avatar({ name, size = 32 }: AvatarProps) {
  const svg = useMemo(() => {
    const avatar = createAvatar(thumbs, { seed: name, size: 32 })
    return avatar.toDataUri()
  }, [name])

  return (
    <img
      src={svg}
      alt={name}
      width={size}
      height={size}
      className="rounded-full"
    />
  )
}

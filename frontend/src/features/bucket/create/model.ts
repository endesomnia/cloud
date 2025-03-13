import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface BucketForm {
  name: string
}

export function useBucketFormModel() {
  const { register, handleSubmit, reset } = useForm<BucketForm>()
  const [accessMode, setAccessMode] = useState<'public' | 'private'>('public')

  return {
    register,
    handleSubmit,
    reset,
    accessMode,
    setAccessMode,
  }
}

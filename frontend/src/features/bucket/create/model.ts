import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface BucketForm {
  name: string
}

export function useBucketFormModel() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BucketForm>({
    defaultValues: {
      name: ''
    },
    mode: 'onChange',
    reValidateMode: 'onChange'
  })
  const [accessMode, setAccessMode] = useState<'public' | 'private'>('public')

  return {
    register,
    handleSubmit,
    reset,
    accessMode,
    setAccessMode,
    errors,
    isSubmitting
  }
}

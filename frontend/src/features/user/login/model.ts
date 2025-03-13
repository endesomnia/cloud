'use client'

import { UserVerify } from '@src/shared/api'
import { useForm } from 'react-hook-form'

export function useUserLoginFormModel() {
  const { register, handleSubmit, reset, formState } = useForm<UserVerify>()

  return {
    register,
    handleSubmit,
    reset,
    formState,
  }
}

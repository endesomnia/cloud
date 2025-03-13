import { useForm } from 'react-hook-form'

interface fileMoveForm {
  targetBucket: string
}

export function useFileMoveFormModel() {
  const { register, handleSubmit, reset } = useForm<fileMoveForm>()

  return {
    register,
    handleSubmit,
    reset,
  }
}

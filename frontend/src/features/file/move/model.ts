import { useForm } from 'react-hook-form'

interface FileMoveForm {
  targetBucket: string
}

export function useFileMoveFormModel() {
  const { register, handleSubmit, reset, setValue, formState } = useForm<FileMoveForm>({
    defaultValues: {
      targetBucket: ''
    }
  })

  return {
    register,
    handleSubmit,
    reset,
    setValue,
    formState,
  }
}

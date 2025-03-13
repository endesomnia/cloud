import { useForm } from 'react-hook-form'

export interface fileRenameForm {
  newFilename: string
}

export function useFileRenameFormModel() {
  const { register, handleSubmit, reset } = useForm<fileRenameForm>()

  return {
    register,
    handleSubmit,
    reset,
  }
}

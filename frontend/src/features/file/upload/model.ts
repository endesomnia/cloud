import { useForm } from 'react-hook-form'

interface fileUploadForm {
  bucketname: string
}

export function useFileUploadFormModel() {
  const { register, handleSubmit, reset } = useForm<fileUploadForm>()

  return {
    register,
    handleSubmit,
    reset,
  }
}

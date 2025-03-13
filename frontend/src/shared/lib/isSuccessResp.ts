import { SuccessResponce } from '../api'

export const isSucessResponse = (response: any): response is SuccessResponce => {
  return 'token' in response
}

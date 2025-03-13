import { UserAuth } from '../api'

export const isUserAuth = (user: any): user is UserAuth => {
  return !('image' in user)
}

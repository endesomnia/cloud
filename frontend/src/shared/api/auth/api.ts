import { authUrlPrefix } from '@src/shared/constant'
import { api } from '../instance'

export interface UserCreate {
  name: string
  password: string
  email: string
}

export interface UserVerify {
  email: string
  password: string
}
export interface GetUserById {
  id: string
}

export interface UserAuth {
  id: string
  createdAt: Date
  name: string
  password: string
  email: string
}

export interface ErrorResponse {
  status: string
  message: string
}

export interface SuccessResponce {
  message: string
  user: UserAuth
  token: string
}

// Function to create a user
export const createUser = async ({ email, name, password }: UserCreate): Promise<SuccessResponce | ErrorResponse> => {
  const response = await api.post<SuccessResponce | ErrorResponse>(`/${authUrlPrefix}/register`, {
    name: name,
    email: email,
    password: password,
  })

  return response.data
}

// Function for verify a usr
export const verifyUser = async ({ email, password }: UserVerify): Promise<SuccessResponce | ErrorResponse> => {
  const response = await api.post<SuccessResponce | ErrorResponse>(`/${authUrlPrefix}/login`, {
    email: email,
    password: password,
  })

  return response.data
}

export const ById = async ({ id }: GetUserById): Promise<SuccessResponce | ErrorResponse> => {
  const response = await api.post<SuccessResponce | ErrorResponse>(`/${authUrlPrefix}`, {
    id: id,
  })

  return response.data
}

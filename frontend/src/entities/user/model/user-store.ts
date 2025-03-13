import { UserAuth } from '@src/shared/api'
import { User } from './user'
import { create } from 'zustand'

interface UserStoreState {
  user: User | UserAuth | null
}

interface UserStoreActions {
  addUser: (user: User | UserAuth) => Promise<void>
}

export const useUserStore = create<UserStoreState & UserStoreActions>((set) => ({
  user: null,
  addUser: async (user: User | UserAuth) => set({ user: user }),
}))

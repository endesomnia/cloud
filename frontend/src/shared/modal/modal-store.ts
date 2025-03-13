import { create } from 'zustand'

export type ModalType = 'bucketCreate' | 'deleteDialog' | 'fileMove' | 'fileUpload' | 'fileRename'

interface ModalStoreState {
  isOpen: boolean
  type: null | ModalType
}

interface ModalStoreActions {
  onOpen: (type: ModalType) => void
  onClose: () => void
}

const useModalStore = create<ModalStoreState & ModalStoreActions>((set) => ({
  isOpen: false,
  type: 'bucketCreate',
  onOpen: (type: ModalType) => set({ isOpen: true, type }),
  onClose: () => set({ isOpen: false, type: null }),
}))

export { useModalStore }

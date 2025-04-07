import { create } from 'zustand'

export type ModalType = 'bucketCreate' | 'fileMove' | 'fileUpload' | 'fileRename' | 'deleteDialog' | string

export interface ModalData {
  bucketName?: string
  currentFolder?: string
  fileId?: string
  fileName?: string
  onComplete?: () => void
  onUploadComplete?: () => void
}

interface ModalStoreState {
  isOpen: boolean
  type: null | ModalType
  data: ModalData | null
}

interface ModalStoreActions {
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
}

const useModalStore = create<ModalStoreState & ModalStoreActions>((set) => ({
  isOpen: false,
  type: null,
  data: null,
  onOpen: (type: ModalType, data?: ModalData) => {
    console.log('Modal opening:', { type, data })
    set({ isOpen: true, type, data: data || null })
  },
  onClose: () => {
    console.log('Modal closing')
    set({ isOpen: false, type: null, data: null })
  },
}))

export { useModalStore }

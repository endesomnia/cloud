import { Upload, Sparkles } from 'lucide-react'
import { cn } from '@src/shared/lib'
import { Button } from '@src/shared/ui'
import { useModalStore } from '@src/shared/modal'
import { useState } from 'react'
import { useTheme } from '@src/shared/context/themeContext'
import { useLanguage } from '@src/shared/context/languageContext'

interface Props {
  classes?: string
}

export const FileUploadButton = ({ classes }: Props) => {
  const { onOpen } = useModalStore()
  const [isHovered, setIsHovered] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { t } = useLanguage()

  return (
    <Button 
      onClick={() => onOpen('fileUpload')}
      className={cn(`
        relative z-10 group flex items-center justify-center gap-2 overflow-hidden
        bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] 
        hover:from-[#2563EB] hover:to-[#3B82F6] 
        shadow-md hover:shadow-xl ${isDark ? 'shadow-blue-500/20 hover:shadow-blue-500/30' : 'shadow-blue-400/30 hover:shadow-blue-400/40'}
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent 
        before:translate-x-[-120%] hover:before:animate-shimmer before:transition-all before:duration-1000
        after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/5 after:to-transparent 
        after:translate-x-[-120%] hover:after:translate-x-[120%] after:transition-all after:duration-1000 after:delay-300
        transition-all duration-300 transform hover:scale-[1.03] active:scale-95 theme-transition
      `, classes)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-[#3B82F6]/0 via-[#3B82F6]/30 to-[#3B82F6]/0 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 animate-gradient-x"></div>
      
      <div className="absolute -inset-px rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/80 to-[#60A5FA]/80 z-0"></div>
        <div className="absolute top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-white/40 to-transparent z-10"></div>
        <div className="absolute bottom-0 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"></div>
      </div>

      <span className="flex items-center justify-center relative z-10 text-white font-medium">
        <span className="relative mr-2">
          <Upload 
            className={`transition-all duration-500 ${isHovered ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`} 
            size={20} 
          />
          <Sparkles 
            className={`absolute top-0 left-0 text-white transition-all duration-500 ${isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} animate-pulse`} 
            size={20}
          />
        </span>
        <span className="transform group-hover:translate-x-0.5 transition-transform duration-300">
          {t('upload_file')}
        </span>
      </span>
    </Button>
  )
}

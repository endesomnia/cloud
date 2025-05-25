'use client'

import { Box, Button, Input, ThemeToggle } from '@src/shared/ui'
import { createUser, UserCreate } from '@src/shared/api'
import { SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { routes } from '@src/shared/constant'
import { useUserCreateFormModel } from './model'
import { isSucessResponse } from '@src/shared/lib'
import { toast } from 'sonner'
import Cookies from 'js-cookie'
import { useUserStore } from '@src/entities/user'
import { useTheme } from '@src/shared/context/themeContext'
import { useLanguage } from '@src/shared/context/languageContext'

export const RegisterForm = () => {
  const { handleSubmit, register, reset, formState } = useUserCreateFormModel()
  const { addUser } = useUserStore()
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { t } = useLanguage()

  const onSubmit: SubmitHandler<UserCreate> = async (data) => {
    const response = await createUser({ email: data.email, password: data.password, name: data.name })
    if (isSucessResponse(response)) {
      const user = response.user

      addUser(user)

      const userId = response.user.id
      const token = response.token

      Cookies.set('userId', userId, { expires: 365 })
      Cookies.set('token', token, { expires: 365 })

      Cookies.remove('authjs.callback-url')
      Cookies.remove('authjs.csrf-token')

      toast(t(response.message))

      reset()

      router.push(routes.buckets)
    } else {
      toast(t(response.message))
    }
  }

  return (
    <main className={`flex flex-col min-h-screen ${isDark ? 'bg-[#111827]' : 'bg-white'} relative overflow-hidden theme-transition`}>
      <div className="absolute inset-0 w-full h-full">
        <div 
          className={`absolute top-[-15%] left-[-10%] w-[800px] h-[800px] ${isDark 
            ? 'bg-gradient-to-br from-[#1E293B]/80 via-[#334155]/60 to-[#1E293B]/80' 
            : 'bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-blue-100/60'
          } rounded-full mix-blend-normal filter blur-[120px] animate-blob opacity-70 theme-transition`}
        />
        <div 
          className={`absolute top-[35%] right-[-15%] w-[800px] h-[800px] ${isDark 
            ? 'bg-gradient-to-bl from-[#0F172A]/90 via-[#1E293B]/70 to-[#0F172A]/90' 
            : 'bg-gradient-to-bl from-gray-100/80 via-gray-50/60 to-white/80'
          } rounded-full mix-blend-normal filter blur-[110px] animate-blob animation-delay-2000 theme-transition`}
        />
        <div 
          className={`absolute bottom-[-20%] left-[25%] w-[1000px] h-[1000px] ${isDark 
            ? 'bg-gradient-to-tr from-[#1E293B]/80 via-[#334155]/60 to-[#1E293B]/80' 
            : 'bg-gradient-to-tr from-gray-100/60 via-gray-50/40 to-gray-100/60'
          } rounded-full mix-blend-normal filter blur-[140px] animate-blob animation-delay-4000 theme-transition`}
        />
        <div 
          className={`absolute top-[20%] left-[50%] w-[500px] h-[500px] ${isDark 
            ? 'bg-gradient-to-bl from-[#3B82F6]/20 via-[#60A5FA]/10 to-transparent' 
            : 'bg-gradient-to-bl from-blue-200/30 via-blue-100/20 to-transparent'
          } rounded-full mix-blend-normal filter blur-[80px] animate-blob animation-delay-3000 theme-transition`}
        />
      </div>

      <div 
        className={`absolute inset-0 ${isDark
          ? "bg-[url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=)]"
          : "bg-[url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=)]"
        } opacity-30 theme-transition`}
      />
      
      <Box className="flex flex-col justify-center items-center flex-grow relative z-10">
        <div className={`w-[380px] ${isDark ? 'bg-[#111827]/80' : 'bg-white/80'} backdrop-blur-sm rounded-2xl ${isDark ? 'text-white' : 'text-gray-900'} ${isDark ? 'border border-white/5' : 'border border-gray-200'} theme-transition`}>
          <form onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col gap-8 p-8 text-center">
            <div className="space-y-3">
              <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} animate-fade-in theme-transition`}>
                {t('sign_up_title')}
              </h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} animate-fade-in animation-delay-200 theme-transition`}>
                {t('sign_up_subtitle')}
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <Input
                  placeholder={t('full_name')}
                  className={`w-full h-11 px-4 ${isDark 
                    ? 'bg-[#1F2937] border-0 text-white placeholder:text-gray-500' 
                    : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400'
                  } rounded-lg focus:ring-1 focus:ring-[#3B82F6] transition-all duration-300 animate-fade-in animation-delay-400 theme-transition`}
                  {...register('name', { required: t('this_field_required') })}
                />
                {formState.errors.name && 
                  <p className="absolute -bottom-5 left-0 text-xs text-[#EF4444]">{formState.errors.name.message}</p>
                }
              </div>

              <div className="relative">
                <Input
                  type="email"
                  placeholder={t('email')}
                  className={`w-full h-11 px-4 ${isDark 
                    ? 'bg-[#1F2937] border-0 text-white placeholder:text-gray-500' 
                    : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400'
                  } rounded-lg focus:ring-1 focus:ring-[#3B82F6] transition-all duration-300 animate-fade-in animation-delay-600 theme-transition`}
                  {...register('email', { required: t('this_field_required') })}
                />
                {formState.errors.email && 
                  <p className="absolute -bottom-5 left-0 text-xs text-[#EF4444]">{formState.errors.email.message}</p>
                }
              </div>

              <div className="relative">
                <Input
                  type="password"
                  placeholder={t('password')}
                  className={`w-full h-11 px-4 ${isDark 
                    ? 'bg-[#1F2937] border-0 text-white placeholder:text-gray-500' 
                    : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400'
                  } rounded-lg focus:ring-1 focus:ring-[#3B82F6] transition-all duration-300 animate-fade-in animation-delay-800 theme-transition`}
                  {...register('password', { required: t('this_field_required') })}
                />
                {formState.errors.password && 
                  <p className="absolute -bottom-5 left-0 text-xs text-[#EF4444]">{formState.errors.password.message}</p>
                }
              </div>
            </div>

            <Button 
              type="submit" 
              className="mt-2 w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg h-11 text-sm font-medium transition-all duration-300 animate-fade-in animation-delay-1000"
            >
              {t('create_account')}
            </Button>

            <div className="pt-4 text-sm text-center">
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} animate-fade-in animation-delay-1000 theme-transition`}>
                {t('already_account')}
                <Button 
                  variant="link" 
                  className={`ml-1 ${isDark 
                    ? 'text-[#3B82F6] hover:text-[#60A5FA]' 
                    : 'text-[#2563EB] hover:text-[#3B82F6]'
                  } transition-colors theme-transition`}
                  onClick={() => router.push(routes.login)}
                >
                  {t('sign_in')}
                </Button>
              </p>
            </div>
          </form>
        </div>
      </Box>
    </main>
  )
}

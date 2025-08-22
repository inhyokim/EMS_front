'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, BarChart3, Settings } from 'lucide-react'

/**
 * Header Component
 * Apple/Toss 스타일의 깔끔한 헤더
 */
export default function Header() {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: BarChart3,
      current: pathname === '/',
    },
    {
      name: 'Devices',
      href: '/devices',
      icon: Settings,
      current: pathname === '/devices',
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 safe-top">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-primary text-white group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
              EMS
            </span>
          </Link>

          {/* 네비게이션 */}
          <nav className="flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      item.current
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  
                  {/* 활성 상태 표시 */}
                  {item.current && (
                    <div className="absolute inset-x-0 -bottom-px h-0.5 bg-primary-600 rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* 우측 메뉴 (향후 확장용) */}
          <div className="flex items-center space-x-3">
            {/* 상태 표시 */}
            <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
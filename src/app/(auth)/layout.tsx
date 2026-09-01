import { Footer } from '@/components/layout/Footer'
import { HeaderDesktop } from '@/components/layout/HeaderDesktop'
import { HeaderMobile } from '@/components/layout/HeaderMobile'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col"><HeaderDesktop /><HeaderMobile /><main className="flex-grow">{children}</main><Footer /></div>
}

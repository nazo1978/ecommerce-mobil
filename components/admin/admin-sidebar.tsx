'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Users,
  Package,
  Gavel,
  Gift,
  FolderTree,
  Home
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Home,
    description: 'Genel bakış ve istatistikler'
  },
  {
    title: 'Kullanıcı Yönetimi',
    href: '/admin/users',
    icon: Users,
    description: 'Kullanıcıları yönet ve roller ata'
  },
  {
    title: 'Ürün Yönetimi',
    href: '/admin/products',
    icon: Package,
    description: 'Ürün ekle, düzenle ve sil'
  },
  {
    title: 'Açık Artırma',
    href: '/admin/auctions',
    icon: Gavel,
    description: 'Müzayedeleri yönet'
  },
  {
    title: 'Çekilişler',
    href: '/admin/giveaways',
    icon: Gift,
    description: 'Çekiliş kampanyalarını yönet'
  },
  {
    title: 'Kategoriler',
    href: '/admin/categories',
    icon: FolderTree,
    description: 'Kategori yapısını yönet'
  }
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("w-64 bg-white border-r border-gray-200 h-full flex flex-col", className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-sm text-gray-500 mt-1">Yönetim Paneli</p>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-3">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start h-auto p-3",
                      isActive && "bg-secondary"
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col items-start space-y-1">
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                    </div>
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t">
        <Link href="/">
          <Button variant="outline" className="w-full justify-start">
            <Home className="h-4 w-4 mr-2" />
            Ana Sayfaya Dön
          </Button>
        </Link>
      </div>
    </div>
  );
}
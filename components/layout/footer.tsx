import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Kurumsal',
      links: [
        { href: '/about', label: 'Hakkımızda' },
        { href: '/careers', label: 'Kariyer' },
        { href: '/press', label: 'Basın' },
        { href: '/investors', label: 'Yatırımcılar' },
      ],
    },
    {
      title: 'Müşteri Hizmetleri',
      links: [
        { href: '/help', label: 'Yardım Merkezi' },
        { href: '/contact', label: 'İletişim' },
        { href: '/shipping', label: 'Kargo Bilgileri' },
        { href: '/returns', label: 'İade & Değişim' },
      ],
    },
    {
      title: 'Alışveriş',
      links: [
        { href: '/products', label: 'Tüm Ürünler' },
        { href: '/categories', label: 'Kategoriler' },
        { href: '/brands', label: 'Markalar' },
        { href: '/deals', label: 'Fırsatlar' },
      ],
    },
    {
      title: 'Satıcı',
      links: [
        { href: '/seller/register', label: 'Satıcı Ol' },
        { href: '/seller/help', label: 'Satıcı Yardım' },
        { href: '/seller/fees', label: 'Komisyon Oranları' },
        { href: '/seller/tools', label: 'Satıcı Araçları' },
      ],
    },
  ];

  const socialLinks = [
    { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
    { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
    { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
    { href: 'https://youtube.com', icon: Youtube, label: 'YouTube' },
  ];

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-xl">E-Commerce</span>
            </Link>
            
            <p className="text-muted-foreground mb-4 max-w-md">
              Türkiye'nin en güvenilir e-ticaret platformu. Milyonlarca ürün, 
              güvenli alışveriş ve hızlı teslimat imkanı.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>0850 123 45 67</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@ecommerce.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>İstanbul, Türkiye</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="font-semibold mb-2">Bültenimize Abone Olun</h3>
              <p className="text-sm text-muted-foreground">
                Özel fırsatlar ve yeni ürünlerden ilk siz haberdar olun.
              </p>
            </div>
            
            <form className="flex space-x-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="E-posta adresiniz"
                className="md:w-64"
              />
              <Button type="submit">
                Abone Ol
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © {currentYear} E-Commerce Platform. Tüm hakları saklıdır.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{social.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-4 text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Gizlilik Politikası
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Kullanım Şartları
              </Link>
              <Link
                href="/cookies"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Çerez Politikası
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

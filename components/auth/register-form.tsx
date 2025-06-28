'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/forms/form-field';
import { isValidEmail, isValidPhone } from '@/lib/utils';

export function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    referralCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad gereklidir';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad gereklidir';
    }

    if (!formData.email) {
      newErrors.email = 'E-posta adresi gereklidir';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (!formData.phone) {
      newErrors.phone = 'Telefon numarası gereklidir';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası girin (05xxxxxxxxx)';
    }

    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Şifre en az 8 karakter olmalıdır';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gereklidir';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Kullanım şartlarını kabul etmelisiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Register user via API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.toLowerCase(),
          phone: formData.phone,
          password: formData.password,
          referralCode: formData.referralCode || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'USER_EXISTS') {
          setErrors({ email: 'Bu e-posta adresi zaten kullanımda' });
        } else {
          setErrors({ general: data.message || 'Kayıt olurken bir hata oluştu' });
        }
        return;
      }

      // Auto sign in after successful registration
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Registration successful but auto sign-in failed
        router.push('/auth/login?message=registration-success');
      } else {
        // Both registration and sign-in successful
        router.push('/profile/welcome');
      }
    } catch (error) {
      setErrors({ general: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/profile/welcome' });
    } catch (error) {
      setErrors({ general: 'Google ile kayıt olunamadı' });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Kayıt Ol</CardTitle>
        <CardDescription className="text-center">
          Yeni hesap oluşturun
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {errors.general && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Ad"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              placeholder="Adınız"
              required
            />

            <FormField
              label="Soyad"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              placeholder="Soyadınız"
              required
            />
          </div>

          <FormField
            label="E-posta"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="ornek@email.com"
            required
          />

          <FormField
            label="Telefon"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="05xxxxxxxxx"
            required
          />

          <FormField
            label="Şifre"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            description="En az 8 karakter, büyük/küçük harf ve rakam içermeli"
            required
          />

          <FormField
            label="Şifre Tekrarı"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="••••••••"
            required
          />

          <FormField
            label="Referans Kodu (Opsiyonel)"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleChange}
            placeholder="Referans kodunuz varsa girin"
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="rounded border-gray-300"
            />
            <label htmlFor="acceptTerms" className="text-sm">
              <Link href="/terms" className="text-primary hover:underline">
                Kullanım Şartları
              </Link>
              {' '}ve{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Gizlilik Politikası
              </Link>
              'nı kabul ediyorum
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-destructive">{errors.acceptTerms}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Kayıt Ol
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Veya
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google ile Kayıt Ol
        </Button>
      </CardContent>

      <CardFooter>
        <div className="text-sm text-center w-full">
          Zaten hesabınız var mı?{' '}
          <Link href="/auth/login" className="text-primary hover:underline">
            Giriş yapın
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

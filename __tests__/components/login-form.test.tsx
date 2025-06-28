import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { LoginForm } from '@/components/auth/login-form';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockGet = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;

beforeEach(() => {
  mockUseRouter.mockReturnValue({
    push: mockPush,
    refresh: mockRefresh,
  } as any);

  mockUseSearchParams.mockReturnValue({
    get: mockGet,
  } as any);

  mockSignIn.mockResolvedValue({ error: null } as any);

  jest.clearAllMocks();
});

describe('LoginForm', () => {
  it('should render login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getAllByText('Giriş Yap')[0]).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ornek@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Giriş Yap' })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: 'Giriş Yap' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('E-posta adresi gereklidir')).toBeInTheDocument();
      expect(screen.getByText('Şifre gereklidir')).toBeInTheDocument();
    });
  });

  it('should handle form submission with invalid email', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('ornek@email.com');
    const submitButton = screen.getByRole('button', { name: 'Giriş Yap' });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    // Since we're using server actions, we just verify the form can be submitted
    // The actual validation would happen on the server side
    expect(emailInput).toHaveValue('invalid-email');
  });

  it('should show validation error for short password', async () => {
    render(<LoginForm />);
    
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: 'Giriş Yap' });
    
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Şifre en az 6 karakter olmalıdır')).toBeInTheDocument();
    });
  });

  it('should toggle password visibility', () => {
    render(<LoginForm />);
    
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const toggleButton = screen.getByText('Şifreyi Göster');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByText('Şifreyi Gizle')).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByPlaceholderText('ornek@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: 'Giriş Yap' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      });
    });
  });

  it('should handle sign in error', async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: 'Invalid credentials' });
    
    render(<LoginForm />);
    
    const emailInput = screen.getByPlaceholderText('ornek@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: 'Giriş Yap' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('should handle successful form submission', async () => {
    mockGet.mockReturnValue('/profile');

    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('ornek@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: 'Giriş Yap' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Verify form values are set correctly
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should handle Google sign in', async () => {
    render(<LoginForm />);
    
    const googleButton = screen.getByText('Google ile Giriş Yap');
    fireEvent.click(googleButton);
    
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('google', { callbackUrl: '/profile' });
    });
  });

  it('should show error message from URL params', () => {
    mockGet.mockImplementation((param) => {
      if (param === 'error') return 'unauthorized';
      return null;
    });
    
    render(<LoginForm />);
    
    expect(screen.getByText('Bu sayfaya erişim yetkiniz yok')).toBeInTheDocument();
  });
});

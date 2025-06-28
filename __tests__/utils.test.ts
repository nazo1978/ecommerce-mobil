import { 
  formatPrice, 
  formatDate, 
  truncate, 
  slugify, 
  isValidEmail, 
  isValidPhone,
  cn 
} from '@/lib/utils';

describe('Utils', () => {
  describe('formatPrice', () => {
    it('should format price in Turkish Lira by default', () => {
      expect(formatPrice(1234.56)).toBe('₺1.234,56');
    });

    it('should format price with different currency', () => {
      expect(formatPrice(1234.56, { currency: 'USD' })).toBe('$1,234.56');
    });

    it('should handle string input', () => {
      expect(formatPrice('1234.56')).toBe('₺1.234,56');
    });

    it('should handle zero', () => {
      expect(formatPrice(0)).toBe('₺0,00');
    });
  });

  describe('formatDate', () => {
    const testDate = new Date('2023-12-25T10:30:00Z');

    it('should format date in Turkish locale by default', () => {
      const result = formatDate(testDate);
      expect(result).toContain('25');
      expect(result).toContain('2023');
    });

    it('should format date with custom options', () => {
      const result = formatDate(testDate, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      expect(result).toContain('25');
      expect(result).toContain('2023');
    });

    it('should handle string input', () => {
      const result = formatDate('2023-12-25');
      expect(result).toContain('25');
      expect(result).toContain('2023');
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(truncate(longText, 20)).toBe('This is a very long...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      expect(truncate(shortText, 20)).toBe('Short text');
    });

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('');
    });
  });

  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should handle Turkish characters', () => {
      expect(slugify('Çok Güzel Ürün')).toBe('cok-guzel-urun');
    });

    it('should handle special characters', () => {
      expect(slugify('Test & Product #1')).toBe('test-product-1');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Multiple   Spaces')).toBe('multiple-spaces');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });

    it('should handle empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate Turkish phone number', () => {
      expect(isValidPhone('05551234567')).toBe(true);
      expect(isValidPhone('+905551234567')).toBe(true);
    });

    it('should reject invalid phone number', () => {
      expect(isValidPhone('1234567890')).toBe(false);
      expect(isValidPhone('05551234')).toBe(false);
      expect(isValidPhone('phone')).toBe(false);
    });

    it('should handle empty string', () => {
      expect(isValidPhone('')).toBe(false);
    });
  });

  describe('cn (className utility)', () => {
    it('should merge class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional');
    });

    it('should handle undefined and null', () => {
      expect(cn('base', undefined, null, 'end')).toBe('base end');
    });
  });
});

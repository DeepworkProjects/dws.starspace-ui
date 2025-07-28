export const theme = {
  colors: {
    primary: '#0ea5e9',
    secondary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    
    // Grayscale
    text: '#37352f',
    textSecondary: '#787774',
    background: '#ffffff',
    backgroundSecondary: '#fafafa',
    surface: '#f7f7f5',
    border: '#e9e9e7',
    
    // Compatibility colors
    loveColor: '#ec4899',
    intimacyColor: '#f472b6',
    workColor: '#3b82f6',
    marriageColor: '#a78bfa',
    friendshipColor: '#10b981',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999,
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
  },
};
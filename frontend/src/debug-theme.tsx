import { useEffect } from 'react';

export function ThemeDebug() {
  useEffect(() => {
    const checkTheme = () => {
      const htmlClasses = document.documentElement.classList.toString();
      const hasDark = document.documentElement.classList.contains('dark');
      const storedTheme = localStorage.getItem('equipment-logbook-theme');
      
      console.log('=== THEME DEBUG ===');
      console.log('HTML classes:', htmlClasses);
      console.log('Has dark class:', hasDark);
      console.log('Stored theme:', storedTheme);
      console.log('System prefers dark:', window.matchMedia('(prefers-color-scheme: dark)').matches);
    };
    
    checkTheme();
    
    // Also check whenever classes change
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);
  
  return null;
}

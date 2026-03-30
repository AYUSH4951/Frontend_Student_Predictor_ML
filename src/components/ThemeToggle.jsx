import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center overflow-hidden"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      style={{
        boxShadow: isDark
          ? '0 0 20px rgba(102, 252, 241, 0.25)'
          : '0 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Glow effect (dark mode) */}
      {isDark && (
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-md" />
      )}

      {/* Icon rotation */}
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-primary" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-400" />
        )}
      </motion.div>
    </motion.button>
  );
}
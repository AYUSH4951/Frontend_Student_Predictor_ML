import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Zap, Brain, Target, ArrowRight, Sparkles } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import '../styles/LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Fast Predictions',
      description: 'Get instant predictions in seconds',
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'ML Powered',
      description: 'Machine learning algorithms used for better accuracy',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Easy to Use',
      description: 'Simple interface, powerful insights',
    },
  ];

  return (
    <div className="landing-page-container">

      {/* Animated Background Pattern */}
      <div className="landing-page-bg">
        {/* Blurred colour blobs — keep inline style here only because colours
            are theme-conditional and would need extra CSS classes otherwise */}
        <div
          className="landing-page-bg-circle-1"
          style={{
            backgroundColor: isDark
              ? 'rgba(102, 252, 241, 0.05)'
              : 'rgba(69, 162, 158, 0.10)',
          }}
        />
        <div
          className="landing-page-bg-circle-2"
          style={{
            backgroundColor: isDark
              ? 'rgba(69, 162, 158, 0.05)'
              : 'rgba(102, 252, 241, 0.10)',
          }}
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: isDark ? [0.3, 0.5, 0.3] : [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="landing-page-ring-1"
          style={{
            borderColor: isDark
              ? 'rgba(102, 252, 241, 0.12)'
              : 'rgba(69, 162, 158, 0.18)',
          }}
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: isDark ? [0.2, 0.4, 0.2] : [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="landing-page-ring-2"
          style={{
            borderColor: isDark
              ? 'rgba(69, 162, 158, 0.10)'
              : 'rgba(102, 252, 241, 0.18)',
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <nav className="landing-page-navbar">
        <div className="landing-page-navbar-content">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="landing-page-logo"
          >
            
            <h1 className="landing-page-title">
              Student Performance <span className="text-primary">Predictor</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="landing-page-navbar-actions"
          >
            <ThemeToggle />
          </motion.div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-page-hero">
        <div className="landing-page-hero-content">
          <div className="landing-page-hero-text">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="landing-page-badge"
            >
              <div className="landing-page-badge-content">
                <div className="landing-page-badge-dot" />
                <span className="landing-page-badge-text">ML-Driven Predictions</span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="landing-page-hero-title"
              /* ✅ Removed conflicting inline colour — CSS var handles it */
            >
              Predict Student
              <br />
              <span className="landing-page-hero-gradient">Performance</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="landing-page-hero-subtitle"
            >
              AI-powered insights for smarter academic decisions
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={() => navigate('/predict')}
                className="landing-page-cta-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: isDark
                    ? '0 0 40px rgba(102, 252, 241, 0.25)'
                    : '0 8px 24px rgba(69, 162, 158, 0.30)',
                }}
              >
                <div className="landing-page-button-glow" />
                <span className="landing-page-button-text">
                  Start Prediction
                  <ArrowRight className="w-5 h-5" />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-page-features">
        <div className="landing-page-features-content">
          <div className="landing-page-features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="landing-page-feature-card"
              >
                <div className="landing-page-feature-glow" />
                <div className="landing-page-feature-content">
                  <div className="landing-page-feature-icon">
                    <div className="landing-page-feature-icon-bg">{feature.icon}</div>
                  </div>
                  <h3 className="landing-page-feature-title">{feature.title}</h3>
                  <p className="landing-page-feature-desc">{feature.description}</p>
                </div>
                <div className="landing-page-feature-accent" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="landing-page-cta-section">
        <div className="landing-page-cta-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="landing-page-cta-card"
          >
            <div className="landing-page-cta-glow" />
            <div className="landing-page-cta-text">
              <h3 className="landing-page-cta-title">Ready to Get Started?</h3>
              <p className="landing-page-cta-subtitle">
                Start predicting student performance with AI
              </p>
              <motion.button
                onClick={() => navigate('/predict')}
                className="landing-page-cta-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: isDark
                    ? '0 0 40px rgba(102, 252, 241, 0.35)'
                    : '0 8px 24px rgba(69, 162, 158, 0.30)',
                }}
              >
                Launch Predictor
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
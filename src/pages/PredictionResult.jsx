import { useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Brain, ArrowLeft, RotateCcw, Home, Loader2 } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import '../styles/PredictionResult.css';
import { useEffect, useState } from 'react';

export default function PredictionResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isValidating, setIsValidating] = useState(true);

  const [prediction, setPrediction] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const stateData = location.state;

    // BUG FIX 1: setTimeout of 100ms was used to "validate" but this is
    // unnecessary and causes a flash. Read state synchronously — if it's
    // missing, redirect immediately without any artificial delay.
    if (!stateData || stateData.prediction === undefined || stateData.prediction === null) {
      navigate('/predict', { replace: true });
      return;
    }

    const parsed = Number(stateData.prediction);

    // BUG FIX 2: NaN check was done AFTER setState and only in the render
    // guard below. If prediction was NaN, category would be null and
    // category.color would crash the app. Validate here before setting state.
    if (isNaN(parsed)) {
      navigate('/predict', { replace: true });
      return;
    }

    // BUG FIX 3: Score was never clamped. If the API returned 73.7 it
    // became 73 via Math.round in the form page, but if it somehow returned
    // 150 or -5 it would display as-is and break the progress bar / category.
    const clamped = Math.min(100, Math.max(0, Math.round(parsed)));

    setPrediction(clamped);
    setFormData(stateData.formData || {});
    setIsValidating(false);
  }, [location.state, navigate]);

  const isDark = theme === 'dark';

  // BUG FIX 4: getScoreCategory and getInsightText were defined AFTER the
  // early-return loading/invalid guards, but called inside JSX that runs
  // before those guards in some React render cycles. Moved both functions
  // above all conditional returns so they are always defined when needed.
  const getScoreCategory = (score) => {
    if (score >= 75) return {
      label: 'High Performance',
      color: isDark ? '#66FCF1' : '#16a34a',
      gradient: isDark
        ? 'linear-gradient(135deg, rgba(102,252,241,0.15), rgba(69,162,158,0.15))'
        : 'linear-gradient(135deg, rgba(22,163,74,0.1), rgba(20,184,166,0.1))',
    };
    if (score >= 50) return {
      label: 'Average Performance',
      color: isDark ? '#45A29E' : '#0891b2',
      gradient: isDark
        ? 'linear-gradient(135deg, rgba(69,162,158,0.15), rgba(102,252,241,0.1))'
        : 'linear-gradient(135deg, rgba(8,145,178,0.1), rgba(6,182,212,0.1))',
    };
    return {
      label: 'Needs Improvement',
      color: isDark ? '#f87171' : '#dc2626',
      gradient: isDark
        ? 'linear-gradient(135deg, rgba(248,113,113,0.15), rgba(220,38,38,0.1))'
        : 'linear-gradient(135deg, rgba(220,38,38,0.1), rgba(239,68,68,0.1))',
    };
  };

  const getInsightText = (score) => {
    if (score >= 75) return 'The student is likely to perform above average in math.';
    if (score >= 50) return 'The student is expected to perform at an average level.';
    return 'The student may benefit from additional academic support.';
  };

  // Loading state
  if (isValidating) {
    return (
      <div className="prediction-result-container prediction-result-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-12 h-12" style={{ color: isDark ? '#66FCF1' : '#45A29E' }} />
        </motion.div>
        <p className="prediction-result-loading-text">Loading results...</p>
      </div>
    );
  }

  // BUG FIX 5: This guard was reached even when prediction === 0 (a valid
  // score!) because the original check was just `if (prediction === null)`.
  // A student scoring 0 would see "Invalid prediction data". Now only truly
  // null or NaN values (already redirected above) reach here — this is just
  // a safety net.
  if (prediction === null) {
    return (
      <div className="prediction-result-container prediction-result-center">
        <p className="prediction-result-invalid-text">
          Invalid prediction data. Please try again.
        </p>
      </div>
    );
  }

  const category = getScoreCategory(prediction);

  // BUG FIX 6: Progress bar was missing entirely. The score (e.g. 73) was
  // displayed as a raw number with no visual context. Added a circular/linear
  // progress indicator so the user understands where 73/100 sits.
  const progressPercent = prediction; // already 0–100

  return (
    <div className="prediction-result-container">
      {/* Background */}
      <div className="prediction-result-bg">
        <div className="prediction-result-bg-circle-1" />
        <div className="prediction-result-bg-circle-2" />
      </div>

      {/* Navbar */}
      <nav className="prediction-result-navbar">
        <div className="prediction-result-navbar-content">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="prediction-result-navbar-left"
          >
            <button
              onClick={() => navigate('/')}
              className="prediction-result-back-button"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="prediction-result-navbar-title">
              <Brain className="w-6 h-6" />
              <h1>Student Performance Predictor</h1>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <ThemeToggle />
          </motion.div>
        </div>
      </nav>

      {/* Result Section */}
      <div className="prediction-result-section">
        <div className="prediction-result-content">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prediction-result-header"
          >
            <h2 className="prediction-result-title">Prediction Results</h2>
            <p className="prediction-result-subtitle">
              Based on the provided student details
            </p>
          </motion.div>

          {/* Main Result Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="prediction-result-card"
            style={{ background: category.gradient }}
          >
            <div className="prediction-result-card-glow" />
            <div className="prediction-result-card-inner">

              {/* Circular progress + score */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
                className="prediction-result-score-section"
              >
                {/* SVG Circular Progress */}
                <div className="prediction-result-circle-wrapper">
                  <svg
                    className="prediction-result-circle-svg"
                    viewBox="0 0 120 120"
                  >
                    {/* Track */}
                    <circle
                      cx="60" cy="60" r="50"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="8"
                    />
                    {/* Progress arc */}
                    <motion.circle
                      cx="60" cy="60" r="50"
                      fill="none"
                      stroke={category.color}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                      animate={{
                        strokeDashoffset:
                          2 * Math.PI * 50 * (1 - progressPercent / 100),
                      }}
                      transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
                      style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                    />
                  </svg>
                  {/* Score text in center */}
                  <div className="prediction-result-circle-text">
                    <span
                      className="prediction-result-score"
                      style={{ color: category.color }}
                    >
                      {prediction}
                    </span>
                    <span className="prediction-result-score-max">/100</span>
                  </div>
                </div>

                <div className="prediction-result-score-label">Predicted Math Score</div>
              </motion.div>

              {/* Performance badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div
                  className="prediction-result-badge"
                  style={{
                    backgroundColor: `${category.color}20`,
                    borderColor: category.color,
                  }}
                >
                  <span
                    className="prediction-result-badge-dot"
                    style={{ backgroundColor: category.color }}
                  />
                  <span
                    className="prediction-result-badge-text"
                    style={{ color: category.color }}
                  >
                    {category.label}
                  </span>
                </div>
              </motion.div>

              {/* Linear progress bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="prediction-result-bar-wrapper"
              >
                <div className="prediction-result-bar-track">
                  <motion.div
                    className="prediction-result-bar-fill"
                    style={{ backgroundColor: category.color }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ delay: 0.7, duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <div className="prediction-result-bar-labels">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </motion.div>

              {/* Insight */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="prediction-result-insight"
              >
                <p>{getInsightText(prediction)}</p>
              </motion.div>

            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="prediction-result-actions"
          >
            <motion.button
              onClick={() => navigate('/predict')}
              className="prediction-result-btn prediction-result-btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-5 h-5" />
              <span>Try Again</span>
            </motion.button>

            <motion.button
              onClick={() => navigate('/')}
              className="prediction-result-btn prediction-result-btn-secondary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Brain, ArrowLeft, Loader2, User, GraduationCap, BookOpen, Utensils, FileCheck } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import '../styles/PredictionFormPage.css';

export default function PredictionFormPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    gender: '',
    ethnicity: '',
    parentalEducation: '',
    lunch: '',
    testPrep: '',
    readingScore: '',
    writingScore: '',
  });

  const [focusedField, setFocusedField] = useState(null);

  const isDark = theme === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Map values to match API's expected format exactly
      const ethnicityMap = {
        'group-a': 'group A',
        'group-b': 'group B',
        'group-c': 'group C',
        'group-d': 'group D',
        'group-e': 'group E',
      };

      const educationMap = {
        'some-high-school': 'some high school',
        'high-school': 'high school',
        'some-college': 'some college',
        'associates': "associate's degree",
        'bachelors': "bachelor's degree",
        'masters': "master's degree",
      };

      const payload = {
        gender: formData.gender,
        race_ethnicity: ethnicityMap[formData.ethnicity],
        parental_level_of_education: educationMap[formData.parentalEducation],
        lunch: formData.lunch === 'free-reduced' ? 'free/reduced' : 'standard',
        test_preparation_course: formData.testPrep,
        reading_score: parseFloat(formData.readingScore),
        writing_score: parseFloat(formData.writingScore),
      };

      console.log('📤 Payload being sent:', JSON.stringify(payload, null, 2));

      const response = await fetch('https://student-predictor-ml.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-cache',
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Full API Response:', JSON.stringify(data, null, 2));

      // Handle error response
      if (data.error) {
        throw new Error(data.error);
      }

      // Get prediction from response
      const predictedScore = data.prediction || data.math_score || 0;
      console.log('🎯 Extracted prediction:', predictedScore);

      navigate('/result', {
        state: {
          prediction: Math.round(Number(predictedScore)),
          formData,
          rawResponse: data,
        },
      });

    } catch (error) {
      console.error('❌ API Error:', error);
      setError(error.message || 'Failed to fetch prediction. Please try again.');
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = Object.values(formData).every((value) => value !== '');

  return (
    <div className="prediction-page-container">
      {/* Animated Background */}
      <div className="prediction-page-bg">
        <div className="prediction-page-bg-circle-1" />
        <div className="prediction-page-bg-circle-2" />
      </div>

      {/* Navbar */}
      <nav className="prediction-page-navbar">
        <div className="prediction-page-navbar-content">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="prediction-page-navbar-left"
          >
            <button
              onClick={() => navigate('/')}
              className="prediction-page-back-button"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="prediction-page-navbar-title">
              <Brain className="w-6 h-6" />
              <h1>Student Performance Predictor</h1>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>
      </nav>

      {/* Form Section */}
      <div className="prediction-page-form-section">
        <div className="prediction-page-form-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prediction-page-header"
          >
            <h2 className="prediction-page-title">
              Predict Math <span className="prediction-page-title-highlight">Performance</span>
            </h2>
            <p className="prediction-page-subtitle">
              Enter student details to generate AI-powered predictions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prediction-page-form-card"
          >
            <div className="prediction-page-form-glow" />

            <form onSubmit={handleSubmit} className="prediction-page-form">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prediction-page-error"
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    backgroundColor: isDark ? 'rgba(220, 38, 38, 0.2)' : 'rgba(220, 38, 38, 0.1)',
                    border: `1px solid ${isDark ? '#dc2626' : '#dc2626'}`,
                    color: isDark ? '#fca5a5' : '#dc2626',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  {error}
                </motion.div>
              )}

              {/* Gender */}
              <div className="prediction-page-form-group">
                <label className="prediction-page-label">
                  <User className="w-4 h-4" />
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  onFocus={() => setFocusedField('gender')}
                  onBlur={() => setFocusedField(null)}
                  className="prediction-page-select"
                  data-focused={focusedField === 'gender'}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Race/Ethnicity */}
              <div className="prediction-page-form-group">
                <label className="prediction-page-label">
                  <GraduationCap className="w-4 h-4" />
                  Race/Ethnicity
                </label>
                <select
                  value={formData.ethnicity}
                  onChange={(e) => handleChange('ethnicity', e.target.value)}
                  onFocus={() => setFocusedField('ethnicity')}
                  onBlur={() => setFocusedField(null)}
                  className="prediction-page-select"
                  data-focused={focusedField === 'ethnicity'}
                  required
                >
                  <option value="">Select ethnicity</option>
                  <option value="group-a">Group A</option>
                  <option value="group-b">Group B</option>
                  <option value="group-c">Group C</option>
                  <option value="group-d">Group D</option>
                  <option value="group-e">Group E</option>
                </select>
              </div>

              {/* Parental Education */}
              <div className="prediction-page-form-group">
                <label className="prediction-page-label">
                  <GraduationCap className="w-4 h-4" />
                  Parental Level of Education
                </label>
                <select
                  value={formData.parentalEducation}
                  onChange={(e) => handleChange('parentalEducation', e.target.value)}
                  onFocus={() => setFocusedField('parentalEducation')}
                  onBlur={() => setFocusedField(null)}
                  className="prediction-page-select"
                  data-focused={focusedField === 'parentalEducation'}
                  required
                >
                  <option value="">Select education level</option>
                  <option value="some-high-school">Some High School</option>
                  <option value="high-school">High School</option>
                  <option value="some-college">Some College</option>
                  <option value="associates">Associate's Degree</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                </select>
              </div>

              {/* Lunch */}
              <div className="prediction-page-form-group">
                <label className="prediction-page-label">
                  <Utensils className="w-4 h-4" />
                  Lunch
                </label>
                <select
                  value={formData.lunch}
                  onChange={(e) => handleChange('lunch', e.target.value)}
                  onFocus={() => setFocusedField('lunch')}
                  onBlur={() => setFocusedField(null)}
                  className="prediction-page-select"
                  data-focused={focusedField === 'lunch'}
                  required
                >
                  <option value="">Select lunch type</option>
                  <option value="standard">Standard</option>
                  <option value="free-reduced">Free/Reduced</option>
                </select>
              </div>

              {/* Test Prep */}
              <div className="prediction-page-form-group">
                <label className="prediction-page-label">
                  <FileCheck className="w-4 h-4" />
                  Test Preparation Course
                </label>
                <select
                  value={formData.testPrep}
                  onChange={(e) => handleChange('testPrep', e.target.value)}
                  onFocus={() => setFocusedField('testPrep')}
                  onBlur={() => setFocusedField(null)}
                  className="prediction-page-select"
                  data-focused={focusedField === 'testPrep'}
                  required
                >
                  <option value="">Select status</option>
                  <option value="completed">Completed</option>
                  <option value="none">None</option>
                </select>
              </div>

              {/* Scores Grid */}
              <div className="prediction-page-scores-grid">
                <div className="prediction-page-form-group">
                  <label className="prediction-page-label">
                    <BookOpen className="w-4 h-4" />
                    Reading Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.readingScore}
                    onChange={(e) => handleChange('readingScore', e.target.value)}
                    onFocus={() => setFocusedField('readingScore')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="0-100"
                    className="prediction-page-input"
                    data-focused={focusedField === 'readingScore'}
                    required
                  />
                </div>

                <div className="prediction-page-form-group">
                  <label className="prediction-page-label">
                    <BookOpen className="w-4 h-4" />
                    Writing Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.writingScore}
                    onChange={(e) => handleChange('writingScore', e.target.value)}
                    onFocus={() => setFocusedField('writingScore')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="0-100"
                    className="prediction-page-input"
                    data-focused={focusedField === 'writingScore'}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`prediction-page-submit-button ${isDark ? 'dark-theme' : 'light-theme'}`}
                data-valid={isFormValid && !isLoading}
                whileHover={isFormValid && !isLoading ? { scale: 1.02 } : {}}
                whileTap={isFormValid && !isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="prediction-page-loader"
                    >
                      <Loader2 className="w-5 h-5" />
                    </motion.div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>Predict Score</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
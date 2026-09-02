import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Ship, Mail, Lock, ArrowRight } from 'lucide-react';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock login - simulate delay
    setTimeout(() => {
      localStorage.setItem('marineverse_auth', 'true');
      navigate('/');
    }, 800);
  };
  
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <Ship size={32} className={styles.logo} />
          <h1 className={styles.title}>MARINEVERSE</h1>
          <span className={styles.subtitle}>AI Maritime Platform</span>
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <Mail size={16} className={styles.fieldIcon} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              aria-label="Email address"
            />
          </div>
          <div className={styles.field}>
            <Lock size={16} className={styles.fieldIcon} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              aria-label="Password"
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Connecting...' : 'Sign In'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
        
        <div className={styles.footer}>
          <span>Don't have an account?</span>
          <Link to="/register">Register</Link>
        </div>
      </div>
      
      <div className={styles.tagline}>
        Know your surroundings. Understand the sea. Navigate smarter.
      </div>
    </div>
  );
}

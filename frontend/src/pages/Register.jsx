import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Ship, Mail, Lock, User, Anchor, ArrowRight } from 'lucide-react';
import styles from './Login.module.css'; // reuse login styles

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', vessel: '' });
  const [loading, setLoading] = useState(false);
  
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/login');
    }, 800);
  };
  
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <Ship size={32} className={styles.logo} />
          <h1 className={styles.title}>MARINEVERSE</h1>
          <span className={styles.subtitle}>Create Account</span>
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <User size={16} className={styles.fieldIcon} />
            <input type="text" placeholder="Full name" value={form.name} onChange={update('name')} className={styles.input} required aria-label="Full name" />
          </div>
          <div className={styles.field}>
            <Mail size={16} className={styles.fieldIcon} />
            <input type="email" placeholder="Email address" value={form.email} onChange={update('email')} className={styles.input} required aria-label="Email address" />
          </div>
          <div className={styles.field}>
            <Lock size={16} className={styles.fieldIcon} />
            <input type="password" placeholder="Password" value={form.password} onChange={update('password')} className={styles.input} required aria-label="Password" />
          </div>
          <div className={styles.field}>
            <Anchor size={16} className={styles.fieldIcon} />
            <input type="text" placeholder="Vessel name (optional)" value={form.vessel} onChange={update('vessel')} className={styles.input} aria-label="Vessel name" />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
        
        <div className={styles.footer}>
          <span>Already have an account?</span>
          <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

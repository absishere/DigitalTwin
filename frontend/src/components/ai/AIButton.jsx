import { Sparkles } from 'lucide-react';
import useUIStore from '../../state/uiStore';
import styles from './AIButton.module.css';

export default function AIButton() {
  const { toggleAIChat } = useUIStore();
  
  return (
    <button className={styles.btn} onClick={toggleAIChat} aria-label="Open AI assistant" title="Ask MarineVerse AI">
      <Sparkles size={20} />
    </button>
  );
}

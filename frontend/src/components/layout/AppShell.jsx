import TopBar from './TopBar';
import BottomStatusBar from './BottomStatusBar';
import SidePanel from './SidePanel';
import AIChatPanel from '../ai/AIChatPanel';
import AlertsPanel from './AlertsPanel';
import SimulationPanel from './SimulationPanel';
import styles from './AppShell.module.css';

export default function AppShell({ children }) {
  return (
    <div className={styles.shell}>
      <TopBar />
      <main className={styles.main}>
        {children}
      </main>
      <SidePanel />
      <BottomStatusBar />
    </div>
  );
}

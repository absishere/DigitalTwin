import { useState, useRef, useEffect } from 'react';
import { Search, Settings, User, X, Ship, Anchor } from 'lucide-react';
import { searchVessels } from '../../services/vesselService';
import useVesselStore from '../../state/vesselStore';
import useUIStore from '../../state/uiStore';
import useMapStore from '../../state/mapStore';
import styles from './TopBar.module.css';

export default function TopBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ vessels: [], ports: [] });
  const [showResults, setShowResults] = useState(false);
  const { selectVessel } = useVesselStore();
  const { openDetailsPanel } = useUIStore();
  const { setCenter } = useMapStore();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    if (query.length >= 2) {
      searchVessels(query).then((r) => {
        setResults(r);
        setShowResults(true);
      });
    } else {
      setResults({ vessels: [], ports: [] });
      setShowResults(false);
    }
  }, [query]);
  
  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  
  const handleSelectVessel = (vessel) => {
    selectVessel(vessel);
    openDetailsPanel();
    setCenter([vessel.lat, vessel.lng]);
    setQuery('');
    setShowResults(false);
  };
  
  const handleSelectPort = (port) => {
    setCenter([port.lat, port.lng]);
    setQuery('');
    setShowResults(false);
  };
  
  const clearSearch = () => {
    setQuery('');
    setShowResults(false);
    inputRef.current?.focus();
  };
  
  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>
        <Ship size={22} className={styles.logo} />
        <span className={styles.brandName}>MARINEVERSE</span>
        <span className={styles.brandAi}>AI</span>
      </div>
      
      <div className={styles.searchWrapper}>
        <Search size={16} className={styles.searchIcon} />
        <input
          ref={inputRef}
          type="text"
          className={styles.searchInput}
          placeholder="Search vessel, IMO, MMSI, port..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          aria-label="Search vessels and ports"
        />
        {query && (
          <button className={styles.clearBtn} onClick={clearSearch} aria-label="Clear search">
            <X size={14} />
          </button>
        )}
        
        {showResults && (results.vessels.length > 0 || results.ports.length > 0) && (
          <div className={styles.dropdown} ref={dropdownRef}>
            {results.vessels.length > 0 && (
              <>
                <div className={styles.dropdownSection}>Vessels</div>
                {results.vessels.map((v) => (
                  <button key={v.id} className={styles.dropdownItem} onClick={() => handleSelectVessel(v)}>
                    <Ship size={14} />
                    <div className={styles.resultInfo}>
                      <span className={styles.resultName}>{v.name}</span>
                      <span className={styles.resultMeta}>IMO {v.imo} · {v.type}</span>
                    </div>
                  </button>
                ))}
              </>
            )}
            {results.ports.length > 0 && (
              <>
                <div className={styles.dropdownSection}>Ports</div>
                {results.ports.map((p) => (
                  <button key={p.id} className={styles.dropdownItem} onClick={() => handleSelectPort(p)}>
                    <Anchor size={14} />
                    <div className={styles.resultInfo}>
                      <span className={styles.resultName}>{p.name}</span>
                      <span className={styles.resultMeta}>{p.code} · {p.country}</span>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
      
      <div className={styles.actions}>
        <button className={styles.iconBtn} title="Settings" aria-label="Settings">
          <Settings size={18} />
        </button>
        <button className={styles.iconBtn} title="Profile" aria-label="User profile">
          <User size={18} />
        </button>
      </div>
    </header>
  );
}

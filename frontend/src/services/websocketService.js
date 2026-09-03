class MockWebSocketService {
  constructor() {
    this.listeners = new Map();
    this.connected = false;
    this.simulationInterval = null;
  }
  
  connect() { 
    this.connected = true; 
    this.emit('connection', { status: 'connected' }); 
  }
  
  disconnect() { 
    this.connected = false; 
    this.stopSimulation();
    this.emit('connection', { status: 'disconnected' }); 
  }
  
  isConnected() { 
    return this.connected; 
  }
  
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
  
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      this.listeners.set(event, callbacks.filter(cb => cb !== callback));
    }
  }
  
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }
  
  startSimulation() {
    if (this.simulationInterval) return;
    
    this.simulationInterval = setInterval(() => {
      if (this.connected) {
        this.emit('vessel_update', {
          timestamp: new Date().toISOString(),
          type: 'simulation_tick'
        });
      }
    }, 2000);
  }
  
  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }
}

export const websocketService = new MockWebSocketService();

import { mockAlerts } from '../mock/alerts';

const delay = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAlerts() {
  await delay();
  return mockAlerts;
}

export async function getActiveAlerts() {
  await delay();
  return mockAlerts.filter(alert => alert.status === 'active');
}

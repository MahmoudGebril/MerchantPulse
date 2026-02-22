import { addIcons } from 'ionicons';
import {
  barChartOutline,
  barChart,
  cubeOutline,
  cube,
  receiptOutline,
  receipt,
  settingsOutline,
  settings,
  chevronForward,
} from 'ionicons/icons';

/**
 * Register all Ionic icons used across the app.
 * Call this at bootstrap so icons are available before any component renders.
 */
export function registerIcons(): void {
  addIcons({
    'bar-chart-outline': barChartOutline,
    'bar-chart': barChart,
    'cube-outline': cubeOutline,
    cube,
    'receipt-outline': receiptOutline,
    receipt,
    'settings-outline': settingsOutline,
    settings,
    'chevron-forward': chevronForward,
  });
}

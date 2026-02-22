import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  logoUrl: string | null;
  storeName: string;
  darkMode: boolean;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);

  private readonly _config = signal<ThemeConfig>({
    primaryColor: '#4F46E5',
    accentColor: '#7C3AED',
    logoUrl: null,
    storeName: 'MerchantPulse',
    darkMode: false,
  });

  readonly config = this._config.asReadonly();
  readonly primaryColor = computed(() => this._config().primaryColor);
  readonly accentColor = computed(() => this._config().accentColor);
  readonly logoUrl = computed(() => this._config().logoUrl);
  readonly storeName = computed(() => this._config().storeName);
  readonly darkMode = computed(() => this._config().darkMode);

  constructor() {
    effect(() => {
      const cfg = this._config();
      const root = this.doc.documentElement;
      root.style.setProperty('--brand-primary', cfg.primaryColor);
      root.style.setProperty('--brand-accent', cfg.accentColor);
      root.style.setProperty('--brand-logo-url', cfg.logoUrl ? `url(${cfg.logoUrl})` : 'none');
      root.style.setProperty('--store-name', cfg.storeName);
      root.setAttribute('data-theme', cfg.darkMode ? 'dark' : 'light');
    });
  }

  setTheme(config: Partial<ThemeConfig>): void {
    this._config.update((c) => ({ ...c, ...config }));
  }

  applyStoreBrand(store: {
    name: string;
    brandPrimaryColor?: string;
    brandLogoUrl?: string | null;
  }): void {
    this._config.update((c) => ({
      ...c,
      storeName: store.name,
      primaryColor: store.brandPrimaryColor ?? c.primaryColor,
      accentColor: store.brandPrimaryColor ?? c.accentColor,
      logoUrl: store.brandLogoUrl ?? null,
    }));
  }

  toggleDarkMode(): void {
    this._config.update((c) => ({ ...c, darkMode: !c.darkMode }));
  }
}

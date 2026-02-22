import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
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
} from 'ionicons/icons';

addIcons({
  'bar-chart-outline': barChartOutline,
  'bar-chart': barChart,
  'cube-outline': cubeOutline,
  cube,
  'receipt-outline': receiptOutline,
  receipt,
  'settings-outline': settingsOutline,
  settings,
});

@Component({
  selector: 'app-tabs-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
        IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
  ],
  templateUrl: './tabs-layout.page.html',
  styleUrl: './tabs-layout.page.scss',
})
export class TabsLayoutPage {}

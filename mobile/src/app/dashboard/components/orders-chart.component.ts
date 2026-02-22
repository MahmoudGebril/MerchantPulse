import {
  Component,
  input,
  effect,
  OnDestroy,
  ViewChild,
  ElementRef,
  afterNextRender,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-orders-chart',
  standalone: true,
  template: `<div class="chart-container"><canvas #canvas></canvas></div>`,
  styles: [`.chart-container { height: 200px; position: relative; }`],
})
export class OrdersChartComponent implements OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  data = input<{ date: string; count: number }[]>([]);

  private chart: Chart | null = null;

  constructor() {
    afterNextRender(() => this.initChart());
    effect(() => {
      this.data();
      setTimeout(() => this.initChart(), 0);
    });
  }

  private initChart(): void {
    const data = this.data();
    if (!data.length || !this.canvasRef?.nativeElement) return;

    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map((d) => d.date.slice(5)),
        datasets: [
          {
            label: 'Orders',
            data: data.map((d) => d.count),
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--brand-primary') || '#4F46E5',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}

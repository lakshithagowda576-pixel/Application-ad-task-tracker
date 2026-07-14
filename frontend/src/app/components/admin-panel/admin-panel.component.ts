import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

interface AdminSession {
  username: string;
  loginTime: string;
  lastActivity: string;
}

interface AdminStats {
  totalActiveUsers: number;
  activeSessions: AdminSession[];
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <header class="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20 mb-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">Admin Panel</p>
              <h1 class="mt-2 text-3xl font-semibold text-white">System Dashboard</h1>
              <p class="mt-2 text-sm text-slate-400">Monitor active users and system statistics</p>
            </div>
            <button (click)="goBack()" class="rounded-2xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400">← Back to Dashboard</button>
          </div>
        </header>

        <div class="grid gap-4 md:grid-cols-3 mb-6">
          <div class="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-lg shadow-cyan-950/10">
            <p class="text-sm text-slate-400">Active Users Right Now</p>
            <p class="mt-4 text-4xl font-semibold text-cyan-400">{{ stats?.totalActiveUsers || 0 }}</p>
            <p class="mt-2 text-xs text-slate-500">Real-time user count</p>
          </div>
          <div class="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-lg shadow-cyan-950/10">
            <p class="text-sm text-slate-400">Last Updated</p>
            <p class="mt-4 text-lg font-semibold text-emerald-400">{{ lastUpdated | date:'HH:mm:ss' }}</p>
            <p class="mt-2 text-xs text-slate-500">Updates every 5 seconds</p>
          </div>
          <div class="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-lg shadow-cyan-950/10">
            <p class="text-sm text-slate-400">Status</p>
            <p class="mt-4 text-lg font-semibold text-emerald-400">🟢 Online</p>
            <p class="mt-2 text-xs text-slate-500">System healthy</p>
          </div>
        </div>

        <section class="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-cyan-950/15">
          <h2 class="text-xl font-semibold text-white mb-4">Active User Sessions</h2>
          
          <div *ngIf="!stats || stats.activeSessions.length === 0" class="text-center py-8">
            <p class="text-slate-400">No active users at the moment</p>
          </div>

          <div *ngIf="stats && stats.activeSessions.length > 0" class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="border-b border-slate-700 bg-slate-800/50">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold text-slate-300">Username</th>
                  <th class="px-4 py-3 text-left font-semibold text-slate-300">Login Time</th>
                  <th class="px-4 py-3 text-left font-semibold text-slate-300">Last Activity</th>
                  <th class="px-4 py-3 text-left font-semibold text-slate-300">Duration</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700">
                <tr *ngFor="let session of stats.activeSessions" class="hover:bg-slate-800/50 transition">
                  <td class="px-4 py-3 text-cyan-400 font-medium">{{ session.username }}</td>
                  <td class="px-4 py-3 text-slate-300">{{ session.loginTime | date:'HH:mm:ss' }}</td>
                  <td class="px-4 py-3 text-emerald-400">{{ session.lastActivity | date:'HH:mm:ss' }}</td>
                  <td class="px-4 py-3 text-slate-400">{{ getDuration(session.loginTime) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  `
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  stats: AdminStats | null = null;
  lastUpdated: Date = new Date();
  private refreshSubscription: Subscription | null = null;

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
    // Refresh stats every 5 seconds
    this.refreshSubscription = interval(5000).subscribe(() => {
      this.loadStats();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadStats(): void {
    this.http.get<AdminStats>('http://localhost:5000/api/admin/stats').subscribe({
      next: (data) => {
        this.stats = data;
        this.lastUpdated = new Date();
      },
      error: (error) => {
        console.error('Failed to load admin stats:', error);
      }
    });
  }

  getDuration(loginTime: string): string {
    const login = new Date(loginTime);
    const now = new Date();
    const diff = now.getTime() - login.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  goBack(): void {
    window.history.back();
  }
}

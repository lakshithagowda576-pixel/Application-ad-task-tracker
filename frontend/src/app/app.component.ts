import { CommonModule } from '@angular/common';
import { Injectable, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface TaskItem {
  id: string;
  title: string;
  type: 'Task' | 'Habit';
  completed: boolean;
  author: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
class MockApiService {
  private readonly storageKey = 'smart-task-tracker-items';

  login(username: string, password: string): Observable<{ success: boolean; user: { username: string } }> {
    return of({ success: password === 'password', user: { username } }).pipe(delay(500));
  }

  getTasks(author: string): Observable<TaskItem[]> {
    const tasks = this.readTasks().filter((task) => task.author === author);
    return of(tasks).pipe(delay(400));
  }

  createTask(task: Omit<TaskItem, 'id' | 'createdAt'>): Observable<TaskItem> {
    const nextTask: TaskItem = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...task
    };

    const tasks = this.readTasks();
    tasks.unshift(nextTask);
    this.writeTasks(tasks);

    return of(nextTask).pipe(delay(400));
  }

  updateTask(id: string, updates: Partial<TaskItem>): Observable<TaskItem | null> {
    const tasks = this.readTasks();
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      return of(null).pipe(delay(300));
    }

    tasks[index] = { ...tasks[index], ...updates };
    this.writeTasks(tasks);

    return of(tasks[index]).pipe(delay(300));
  }

  deleteTask(id: string): Observable<boolean> {
    const tasks = this.readTasks().filter((task) => task.id !== id);
    this.writeTasks(tasks);
    return of(true).pipe(delay(300));
  }

  private readTasks(): TaskItem[] {
    const savedTasks = localStorage.getItem(this.storageKey);
    return savedTasks ? JSON.parse(savedTasks) : [];
  }

  private writeTasks(tasks: TaskItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <div *ngIf="!isLoggedIn" class="mx-auto flex min-h-[70vh] max-w-md items-center">
          <div class="w-full rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/30">
            <div class="mb-6 text-center">
              <p class="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">Smart Task & Habit Tracker</p>
              <h1 class="mt-3 text-3xl font-semibold text-white">Your daily momentum starts here</h1>
              <p class="mt-3 text-sm text-slate-400">Sign in with any username and the password <span class="font-semibold text-cyan-300">password</span> to open your dashboard.</p>
            </div>

            <form (ngSubmit)="login()" class="space-y-4">
              <div>
                <label class="mb-1 block text-sm text-slate-300" for="username">Username</label>
                <input id="username" name="username" [(ngModel)]="username" required class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-0 focus:border-cyan-500" placeholder="Enter any username" />
              </div>

              <div>
                <label class="mb-1 block text-sm text-slate-300" for="password">Password</label>
                <input id="password" name="password" [(ngModel)]="password" type="password" required class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500" placeholder="password" />
              </div>

              <button type="submit" class="flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400" [disabled]="loading">
                <span *ngIf="loading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"></span>
                {{ loading ? 'Signing in...' : 'Enter Dashboard' }}
              </button>
            </form>

            <p *ngIf="loginError" class="mt-4 text-sm text-rose-400">{{ loginError }}</p>
          </div>
        </div>

        <div *ngIf="isLoggedIn" class="space-y-6">
          <header class="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Smart Task & Habit Tracker</p>
                <h2 class="mt-2 text-3xl font-semibold text-white">Welcome back, {{ currentUser }}</h2>
                <p class="mt-2 text-sm text-slate-400">Track tasks, build habits, and keep your momentum visible.</p>
              </div>

              <button (click)="logout()" class="rounded-2xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-rose-500 hover:text-rose-400">
                Logout
              </button>
            </div>

            <div class="mt-6 grid gap-4 md:grid-cols-4">
              <div class="rounded-2xl bg-slate-800/90 p-4">
                <p class="text-sm text-slate-400">Total Items</p>
                <p class="mt-2 text-2xl font-semibold text-white">{{ metrics.total }}</p>
              </div>
              <div class="rounded-2xl bg-slate-800/90 p-4">
                <p class="text-sm text-slate-400">Completed</p>
                <p class="mt-2 text-2xl font-semibold text-emerald-400">{{ metrics.completed }}</p>
              </div>
              <div class="rounded-2xl bg-slate-800/90 p-4">
                <p class="text-sm text-slate-400">Pending</p>
                <p class="mt-2 text-2xl font-semibold text-amber-400">{{ metrics.pending }}</p>
              </div>
              <div class="rounded-2xl bg-slate-800/90 p-4">
                <p class="text-sm text-slate-400">Habits</p>
                <p class="mt-2 text-2xl font-semibold text-cyan-400">{{ metrics.habits }}</p>
              </div>
            </div>
          </header>

          <section class="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-cyan-950/15">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 class="text-xl font-semibold text-white">{{ editingId ? 'Update your item' : 'Capture a new win' }}</h3>
                <p class="text-sm text-slate-400">Add a task or a repeating habit and keep your plan moving.</p>
              </div>
              <button type="button" (click)="toggleForm()" class="rounded-2xl border border-cyan-500 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500 hover:text-slate-950">
                {{ showForm ? 'Close' : '+ Add Item' }}
              </button>
            </div>

            <form *ngIf="showForm" (ngSubmit)="saveTask()" class="mt-6 grid gap-4 md:grid-cols-2">
              <div class="md:col-span-2">
                <label class="mb-1 block text-sm text-slate-300" for="title">Title</label>
                <input id="title" name="title" [(ngModel)]="form.title" required class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500" placeholder="What needs attention?" />
              </div>

              <div>
                <label class="mb-1 block text-sm text-slate-300" for="type">Type</label>
                <select id="type" name="type" [(ngModel)]="form.type" class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500">
                  <option value="Task">Task</option>
                  <option value="Habit">Habit</option>
                </select>
              </div>

              <div class="flex items-end">
                <label class="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300">
                  <input type="checkbox" name="completed" [(ngModel)]="form.completed" class="h-4 w-4 rounded border-slate-600 bg-slate-900" />
                  Mark as completed
                </label>
              </div>

              <div class="md:col-span-2 flex flex-wrap gap-3">
                <button type="submit" class="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400" [disabled]="saving">
                  <span *ngIf="saving" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"></span>
                  {{ saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Item' }}
                </button>
                <button type="button" (click)="cancelEdit()" class="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-500">
                  Cancel
                </button>
              </div>
            </form>
          </section>

          <div *ngIf="loading" class="flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/70 py-6 text-sm text-slate-400">
            <span class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></span>
            Syncing your plan...
          </div>

          <section class="grid gap-4 lg:grid-cols-2">
            <article *ngFor="let task of tasks; trackBy: trackById" class="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-cyan-950/10">
              <div class="flex items-start justify-between gap-3">
                <label class="flex flex-1 cursor-pointer items-start gap-3">
                  <input type="checkbox" [checked]="task.completed" (change)="toggleTask(task)" class="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-900" />
                  <div class="min-w-0">
                    <p class="text-base font-semibold text-white" [class.line-through]="task.completed" [class.text-slate-500]="task.completed">{{ task.title }}</p>
                    <p class="mt-1 text-sm text-slate-400">{{ task.type }} • {{ task.completed ? 'Completed' : 'In progress' }}</p>
                  </div>
                </label>
                <span class="rounded-full border border-slate-700 px-2.5 py-1 text-xs font-medium text-cyan-300">{{ task.type }}</span>
              </div>

              <div class="mt-5 flex items-center justify-between text-sm text-slate-400">
                <span>Created {{ task.createdAt | date:'short' }}</span>
                <div class="flex gap-2">
                  <button type="button" (click)="editTask(task)" class="font-medium text-amber-400 transition hover:text-amber-300">Edit</button>
                  <button type="button" (click)="deleteTask(task.id)" class="font-medium text-rose-400 transition hover:text-rose-300">Delete</button>
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  username = '';
  password = '';
  currentUser = '';
  isLoggedIn = false;
  loading = false;
  saving = false;
  loginError = '';
  tasks: TaskItem[] = [];
  showForm = false;
  editingId: string | null = null;
  form = { title: '', type: 'Task' as 'Task' | 'Habit', completed: false };

  constructor(private readonly mockApi: MockApiService) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('smart-task-tracker-user');
    if (storedUser) {
      this.currentUser = storedUser;
      this.isLoggedIn = true;
      this.loadTasks();
    }
  }

  login(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.loginError = 'Please provide both your username and the password.';
      return;
    }

    this.loading = true;
    this.loginError = '';

    this.mockApi.login(this.username.trim(), this.password).subscribe({
      next: (response) => {
        if (response.success) {
          this.currentUser = response.user.username;
          this.isLoggedIn = true;
          localStorage.setItem('smart-task-tracker-user', this.currentUser);
          this.loadTasks();
        } else {
          this.loginError = 'The password is incorrect. Use password to continue.';
        }
        this.loading = false;
      },
      error: () => {
        this.loginError = 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.isLoggedIn = false;
    this.currentUser = '';
    this.username = '';
    this.password = '';
    this.tasks = [];
    localStorage.removeItem('smart-task-tracker-user');
  }

  loadTasks(): void {
    if (!this.currentUser) {
      return;
    }

    this.loading = true;
    this.mockApi.getTasks(this.currentUser).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.cancelEdit();
    }
  }

  saveTask(): void {
    if (!this.form.title.trim()) {
      return;
    }

    this.saving = true;
    const payload = {
      title: this.form.title.trim(),
      type: this.form.type,
      completed: this.form.completed,
      author: this.currentUser
    };

    const request$ = this.editingId
      ? this.mockApi.updateTask(this.editingId, payload)
      : this.mockApi.createTask(payload);

    request$.subscribe({
      next: () => {
        this.cancelEdit();
        this.loadTasks();
        this.saving = false;
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  editTask(task: TaskItem): void {
    this.editingId = task.id;
    this.form = { title: task.title, type: task.type, completed: task.completed };
    this.showForm = true;
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form = { title: '', type: 'Task', completed: false };
    this.showForm = false;
  }

  toggleTask(task: TaskItem): void {
    this.mockApi.updateTask(task.id, { completed: !task.completed }).subscribe(() => this.loadTasks());
  }

  deleteTask(id: string): void {
    this.mockApi.deleteTask(id).subscribe(() => this.loadTasks());
  }

  trackById(_index: number, item: TaskItem): string {
    return item.id;
  }

  get metrics() {
    const completed = this.tasks.filter((task) => task.completed).length;
    const pending = this.tasks.length - completed;

    return {
      total: this.tasks.length,
      completed,
      pending,
      habits: this.tasks.filter((task) => task.type === 'Habit').length
    };
  }
}

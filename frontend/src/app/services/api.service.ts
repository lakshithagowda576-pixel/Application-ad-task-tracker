import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TaskItem {
  id: string;
  title: string;
  type: 'Task' | 'Habit';
  completed: boolean;
  author: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:5000/api';

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<{ success: boolean; user: { username: string } }> {
    return this.http.post<{ success: boolean; user: { username: string } }>(`${this.apiUrl}/auth/login`, { username, password });
  }

  getTasks(author: string): Observable<TaskItem[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tasks?author=${encodeURIComponent(author)}`).pipe(map((tasks) => tasks.map(this.mapTask)));
  }

  createTask(task: Omit<TaskItem, 'id' | 'createdAt'>): Observable<TaskItem> {
    return this.http.post<any>(`${this.apiUrl}/tasks`, task).pipe(map(this.mapTask));
  }

  updateTask(id: string, task: Partial<TaskItem>): Observable<TaskItem> {
    return this.http.put<any>(`${this.apiUrl}/tasks/${id}`, task).pipe(map(this.mapTask));
  }

  deleteTask(id: string): Observable<{ id: string }> {
    return this.http.delete<{ id: string }>(`${this.apiUrl}/tasks/${id}`);
  }

  private mapTask(task: any): TaskItem {
    return {
      id: task.id || task._id,
      title: task.title,
      type: task.type,
      completed: Boolean(task.completed),
      author: task.author || 'demo-user',
      createdAt: task.createdAt || new Date().toISOString()
    };
  }
}
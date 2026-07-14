import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, TaskItem } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.htm'
})
export class DashboardComponent implements OnInit {
  items: TaskItem[] = [];
  newItem = { title: '', type: 'Task' as 'Task' | 'Habit', completed: false, author: 'demo-user' };
  editingId: string | null = null;

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.apiService.getTasks('demo-user').subscribe((data: TaskItem[]) => this.items = data);
  }

  saveItem() {
    if (this.editingId) {
      this.apiService.updateTask(this.editingId, this.newItem).subscribe(() => {
        this.resetForm();
        this.loadItems();
      });
    } else {
      this.apiService.createTask(this.newItem).subscribe(() => {
        this.resetForm();
        this.loadItems();
      });
    }
  }

  editItem(item: TaskItem) {
    this.editingId = item.id;
    this.newItem = { title: item.title, type: item.type, completed: item.completed, author: item.author };
  }

  deleteItem(id: string) {
    this.apiService.deleteTask(id).subscribe(() => this.loadItems());
  }

  resetForm() {
    this.editingId = null;
    this.newItem = { title: '', type: 'Task', completed: false, author: 'demo-user' };
  }
}
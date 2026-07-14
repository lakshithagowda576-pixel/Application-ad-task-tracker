import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.htm'
})
export class DashboardComponent implements OnInit {
  items: any[] = [];
  newItem = { title: '', company: '', status: 'Pending', notes: '' };
  editingId: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.apiService.getItems().subscribe((data: any[]) => this.items = data);
  }

  saveItem() {
    if (this.editingId) {
      this.apiService.updateItem(this.editingId, this.newItem).subscribe(() => {
        this.resetForm();
        this.loadItems();
      });
    } else {
      this.apiService.createItem(this.newItem).subscribe(() => {
        this.resetForm();
        this.loadItems();
      });
    }
  }

  editItem(item: any) {
    this.editingId = item._id;
    this.newItem = { ...item };
  }

  deleteItem(id: string) {
    this.apiService.deleteItem(id).subscribe(() => this.loadItems());
  }

  resetForm() {
    this.editingId = null;
    this.newItem = { title: '', company: '', status: 'Pending', notes: '' };
  }
}
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-paginator',
  standalone: true,
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
  imports: [
    NgIf
  ]
})
export class PaginatorComponent {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.itemsPerPage));
  }

  get startIndex(): number {
    if (this.totalItems === 0) return 0;
    return this.currentPage * this.itemsPerPage + 1;
  }

  get endIndex(): number {
    return Math.min(
      (this.currentPage + 1) * this.itemsPerPage,
      this.totalItems
    );
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages - 1 && this.totalItems > 0;
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && this.totalItems > 0) {
      this.pageChange.emit(page);
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }

  next(): void {
    if (this.hasNextPage) {
      this.goToPage(this.currentPage + 1);
    }
  }

  prev(): void {
    if (this.hasPreviousPage) {
      this.goToPage(this.currentPage - 1);
    }
  }
}

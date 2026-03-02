import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PageEvent } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { IconsComponent } from '../icons/icons.component';

@Component({
  selector: 'app-custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule,
    IconsComponent
  ]
})
export class CustomPaginatorComponent implements OnInit, OnChanges {
  @Input() length = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() pageIndex = 0;
  @Input() disabled = false;
  @Input() showFirstLastButtons = true;
  @Input() hidePageSize = false;
  @Input() maxVisiblePages = 5;

  @Input() borderRadius: boolean=false; 

  @Output() page = new EventEmitter<PageEvent>();

  currentRangeStart = 0;
  currentRangeEnd = 0;
  pageNumbers: number[] = [];
  jumpToPageInput = 1;

  constructor() { }

  ngOnInit(): void {
    this.updateCurrentRange();
    this.updatePageNumbers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageIndex'] || changes['pageSize'] || changes['length']) {
      this.updateCurrentRange();
      this.updatePageNumbers();
      this.jumpToPageInput = this.pageIndex + 1;
    }
  }

  updateCurrentRange(): void {
    this.currentRangeStart = this.pageIndex * this.pageSize + 1;
    this.currentRangeEnd = Math.min((this.pageIndex + 1) * this.pageSize, this.length);
    
    // Handle edge case when there are no items
    if (this.length === 0) {
      this.currentRangeStart = 0;
      this.currentRangeEnd = 0;
    }
  }

  updatePageNumbers(): void {
    const totalPages = Math.ceil(this.length / this.pageSize);
    const maxPages = this.maxVisiblePages;
    
    let startPage = Math.max(0, this.pageIndex - Math.floor(maxPages / 2));
    let endPage = startPage + maxPages - 1;
    
    if (endPage >= totalPages) {
      endPage = totalPages - 1;
      startPage = Math.max(0, endPage - maxPages + 1);
    }
    
    this.pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  onPageSizeChange(newPageSize: number): void {
    const startIndex = this.pageIndex * this.pageSize;
    const newPageIndex = Math.floor(startIndex / newPageSize);
    
    this.pageSize = newPageSize;
    this.pageIndex = newPageIndex;
    
    this.emitPageEvent();
    this.updateCurrentRange();
    this.updatePageNumbers();
  }

  setPage(newPageIndex: number): void {
    if (newPageIndex === this.pageIndex || newPageIndex < 0 || 
        newPageIndex >= Math.ceil(this.length / this.pageSize)) {
      return;
    }
    
    this.pageIndex = newPageIndex;
    this.emitPageEvent();
    this.updateCurrentRange();
    this.updatePageNumbers();
  }

  firstPage(): void {
    this.setPage(0);
  }

  previousPage(): void {
    this.setPage(this.pageIndex - 1);
  }

  nextPage(): void {
    this.setPage(this.pageIndex + 1);
  }

  lastPage(): void {
    this.setPage(Math.ceil(this.length / this.pageSize) - 1);
  }

  jumpToPage(): void {
    // Convert from 1-based (user-friendly) to 0-based (internal)
    const pageIndex = this.jumpToPageInput - 1;
    this.setPage(pageIndex);
  }

  emitPageEvent(): void {
    this.page.emit({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length
    });
  }

  get totalPages(): number {
    return Math.ceil(this.length / this.pageSize);
  }
}

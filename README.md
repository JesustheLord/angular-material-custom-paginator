# Custom Paginator Component

A replacement for the default Angular Material paginator with a more user-friendly interface.

## Features

- Left side: Items per page selector and current item range display
- Right side: Page navigation with page numbers, previous/next buttons, and a jump-to-page input
- Fully compatible with Angular Material tables
- Customizable appearance
- Responsive design

## Usage

### Basic Usage

```html
<app-custom-paginator
  [length]="100"
  [pageSize]="10"
  [pageSizeOptions]="[5, 10, 25, 50]"
  [pageIndex]="0"
  (page)="onPageChange($event)">
</app-custom-paginator>
```

### With MatTable

```html
<table mat-table [dataSource]="dataSource">
  <!-- Table columns -->
</table>

<app-custom-paginator
  [length]="totalItems"
  [pageSize]="pageSize"
  [pageIndex]="pageIndex"
  [pageSizeOptions]="[5, 10, 25, 50]"
  (page)="pageChanged($event)">
</app-custom-paginator>
```

### Component Implementation

```typescript
// In your component
pageSize = 10;
pageIndex = 0;
totalItems = 100;

pageChanged(event: PageEvent): void {
  this.pageSize = event.pageSize;
  this.pageIndex = event.pageIndex;
  // Update your data based on the new page
  this.loadData();
}

loadData(): void {
  // Calculate start and end indices
  const startIndex = this.pageIndex * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  
  // Load data for the current page
  this.dataService.getData(startIndex, this.pageSize).subscribe(
    data => this.dataSource.data = data
  );
}
```

## Available Inputs

| Input              | Type       | Default | Description                                                |
|--------------------|------------|---------|------------------------------------------------------------|
| length             | number     | 0       | Total number of items                                      |
| pageSize           | number     | 10      | Number of items per page                                   |
| pageSizeOptions    | number[]   | [5,10,25,50] | Available options for items per page                 |
| pageIndex          | number     | 0       | Current page index (zero-based)                            |
| disabled           | boolean    | false   | Whether the paginator is disabled                          |
| showFirstLastButtons | boolean  | true    | Whether to show first/last page buttons                    |
| hidePageSize       | boolean    | false   | Whether to hide the items per page selector                |
| maxVisiblePages    | number     | 5       | Maximum number of page buttons to show                     |

## Available Outputs

| Output | Type          | Description                             |
|--------|---------------|-----------------------------------------|
| page   | EventEmitter<PageEvent> | Emitted when page changes     |

The PageEvent interface has the following properties:
```typescript
{
  pageIndex: number;  // New page index
  pageSize: number;   // New page size
  length: number;     // Total number of items
}
```

## Styling

The component uses SCSS for styling and provides several CSS classes that can be overridden to customize the appearance:

```scss
// Override styles in your component
::ng-deep app-custom-paginator {
  .custom-paginator {
    background-color: #f5f5f5;
    border-top: 2px solid #e0e0e0;
  }
  
  .page-number.active {
    background-color: #your-primary-color;
    color: white;
  }
}
```

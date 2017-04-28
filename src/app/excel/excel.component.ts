import { Component } from '@angular/core';

@Component({
  selector: 'excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css']
})
export class ExcelComponent {
  public columns = ['A', 'B', 'C'];
  public rows = [1, 2, 3, 4];
}

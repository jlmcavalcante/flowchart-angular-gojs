import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GojsFlowchartComponent } from './mermaid-diagram/components/gojs-flowchart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GojsFlowchartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'flowchart';
}

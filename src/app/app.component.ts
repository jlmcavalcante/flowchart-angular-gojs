import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MermaidDiagramComponent } from './mermaid-diagram/components/mermaid-diagram.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MermaidDiagramComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'flowchart';
}

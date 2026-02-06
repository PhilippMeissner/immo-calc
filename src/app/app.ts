import { Component } from '@angular/core';
import { Calculator } from './components/calculator/calculator';

@Component({
  selector: 'app-root',
  imports: [Calculator],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}

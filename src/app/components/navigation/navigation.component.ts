import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  @Input() pageTitle: string = '';
  @Output() footerText = new EventEmitter<string>();

  ngOnInit() {
    // שליחת טקסט לדף הבית
    this.footerText.emit('© 2024 מערכת ניהול בית הספר - כל הזכויות שמורות');
  }
} 
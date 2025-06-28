import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  schoolInfo = {
    name: 'בית הספר התיכון "הדמוקרטי"',
    address: 'רחוב השלום 123, תל אביב',
    phone: '03-1234567',
    email: 'info@school.co.il',
    principal: 'ד"ר שרה כהן',
    founded: '1995',
    students: '850',
    teachers: '75',
    description: 'בית הספר התיכון הדמוקרטי הוא מוסד חינוכי מוביל המקדם מצוינות אקדמית לצד ערכים דמוקרטיים וחברתיים. אנו מאמינים בחינוך מותאם אישית ובפיתוח כישורים חברתיים ורגשיים.'
  };
} 
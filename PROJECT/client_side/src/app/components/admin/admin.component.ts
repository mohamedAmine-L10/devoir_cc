import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';

interface Order {
  _id: string;
  client: {
    nom: string;
    prenom: string;
    email: string;
  } | null;
  products: {
    product: Product | null;
    quantity: number;
  }[];
  date_cmd: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule], // Ensure CommonModule is imported for date pipe
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  orders: Order[] = [];
  message: string = '';
  tvaRate: number = 0.2; // Define tvaRate

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getOrders().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
      },
      error: (error) => {
        this.message = 'Failed to load orders: ' + (error.message || error);
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
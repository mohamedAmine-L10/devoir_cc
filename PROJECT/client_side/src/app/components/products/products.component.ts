import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Place ngOnInit here
  ngOnInit() {
    this.authService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products.map((product: Product) => ({ ...product, quantity: 0 }));
      },
      error: () => {
        this.message = 'Failed to load products';
      }
    });
  }

  updateQuantities() {
    this.products.forEach((product: Product) => {
      if (product.quantity < 0) {
        product.quantity = 0;
      }
    });
  }

  hasSelectedProducts(): boolean {
    return this.products.some((product: Product) => product.quantity > 0);
  }

  // Place placeOrder here
  placeOrder() {
    const orderProducts = this.products
      .filter((product: Product) => product.quantity > 0)
      .map((product: Product) => ({
        productId: product._id,
        quantity: product.quantity // quantity is required in Product interface
      }));
    this.authService.placeOrder(orderProducts).subscribe({
      next: () => {
        this.message = 'Order placed successfully!';
        this.products.forEach((product: Product) => product.quantity = 0);
      },
      error: (error) => {
        this.message = 'Failed to place order: ' + (error.error?.error || error.message);
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
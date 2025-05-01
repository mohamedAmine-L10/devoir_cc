import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  nom: string = '';
  prenom: string = '';
  email: string = '';
  age: number | null = null;
  password: string = '';
  isLogin: boolean = true; // Default to login form
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      const role = localStorage.getItem('role');
      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/products']);
      }
    }
  }

  onLogin() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        if (response.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/products']);
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Login failed';
      }
    });
  }

  onRegister() {
    const user = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      age: this.age,
      password: this.password
    };
    this.authService.register(user).subscribe({
      next: () => {
        this.errorMessage = 'Registration successful! Please login.';
        this.toggleForm(); // Switch to login form
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Registration failed';
      }
    });
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.errorMessage = ''; // Clear error message on form toggle
  }
}
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import swal from 'sweetalert';

import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  hasError = signal(false);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],

  })

  onSubmit() {
    if (this.registerForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    const { fullName = '', email = '', password = '' } = this.registerForm.value;

    this.authService.register(email!, password!, fullName!).subscribe({
      next: () => {
        swal({
          title: "¡Registrado!",
          text: "Te has registrado correctamente",
          icon: "success",
        }).then(() => {
          this.router.navigateByUrl("/");
        });
      },
      error: (message) => {
        swal({
          title: "Ha ocurrido un error",
          text: `Ha ocurrido un error al registrarse: ${message}`,
          icon: "error"
        })
      }
    });
  }
}

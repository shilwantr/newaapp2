import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from "@angular/common";
import {HttpClientModule,HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    HttpClientModule
  ],
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  form: FormGroup ;

  // constructor() {}

  constructor(private fb: FormBuilder,private http: HttpClient) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      username:[''],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
console.log(this.form.value)
  }
  login(credentials: { username: string; password: string }) {
    return this.http.post(`${this.apiUrl}/authenticate`, credentials);
  }

  private apiUrl = 'http://localhost:8080/api';
  save(event: Event) {
    // event.preventDefault();
    if (this.form.valid) {
      console.log(this.form.value);
      let username='user';
      let password='pass';

      this.http.post(`${this.apiUrl}/enduser`, this.form.value).subscribe(/*...*/);


      // const headers = { 'Authorization': `Bearer ${yourToken}` };
      // this.http.post(`${this.apiUrl}/enduser`, this.form.value, { headers }).subscribe(/*...*/);
// Your save logic here
    } else {
      console.log('Form is invalid');
    }
  }
}

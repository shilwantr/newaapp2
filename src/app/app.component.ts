import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PostsComponent} from "./postsdirty/posts.component";
import {PostsComponentclean} from "./postsclean/posts.componentclean";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, NgbModule, PostsComponentclean, PostsComponentclean, PostsComponent],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'NewsApp';
}

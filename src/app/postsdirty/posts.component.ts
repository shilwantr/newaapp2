import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { NgForOf, NgIf } from "@angular/common";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {log} from "node:util";
import {environment} from "../../envi";

interface Post {
  title: string;
  content: string;
  url: string;
  commentCount: number;
}

@Component({
  selector: 'app-postsdirty',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, FormsModule, NgIf, NgForOf],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  apiUrl: string = 'https://www.reddit.com/r/all/top.json?limit=100&t=day';
  currentPage: number = 1;
  postsPerPage: number = 10;
  searchQuery: string = '';
  topicForm: FormGroup;
  genAI = new GoogleGenerativeAI(environment.apiKey);
  model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  prompt = "summarize in less than 150 words dont say anything about the post being reddits just the summary";
  // result:any;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.topicForm = this.fb.group({
      topic: ['tech'], // Default topic
      timeFrame: ['day'], // Default time frame
      count: [10] // Default count
    });

    this.getTopPosts().subscribe((data: any) => {
      this.initializePosts(data);
    });
  }

  getTopPosts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  initializePosts(data: any) {
    this.posts = data.data.children.map((child: any) => ({
      title: child.data.title,
      content: child.data.is_self ? child.data.selftext : 'This is a link post.', // Change this line
      url: `https://www.reddit.com${child.data.permalink}`,
      commentCount: child.data.num_comments || 0,
    }));
    this.filteredPosts = this.posts; // Initialize filtered postsdirty
  }

  onSubmit() {
    const { topic, timeFrame, count } = this.topicForm.value;
    this.apiUrl = `https://www.reddit.com/r/${topic}/top.json?limit=${count}&t=${timeFrame}`;

    // Fetch the new postsdirty
    this.getTopPosts().subscribe((data: any) => {
      this.initializePosts(data);
      this.currentPage = 1; // Reset to the first page after fetching new postsdirty
      this.searchPosts(); // Filter postsdirty if there’s an existing search query
    });
  }

  searchPosts() {
    this.filteredPosts = this.posts.filter(post =>
      post.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.currentPage = 1; // Reset to first page on search
  }

  paginate(posts: Post[]) {
    const start = (this.currentPage - 1) * this.postsPerPage;
    return posts.slice(start, start + this.postsPerPage);
  }

  nextPage() {
    if (this.currentPage * this.postsPerPage < this.filteredPosts.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  protected readonly Math = Math;
  // Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";



}

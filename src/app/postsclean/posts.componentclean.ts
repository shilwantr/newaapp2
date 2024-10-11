import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai";
import { catchError } from 'rxjs/operators';
import {NgForOf, NgIf} from "@angular/common";
import {environment} from "../../envi";

interface Post {
  title: string;
  content: string;
  url: string;
  commentCount: number;
}

interface RedditChild {
  data: {
    title: string;
    selftext: string;
    is_self: boolean;
    permalink: string;
    num_comments: number;
  };
}

@Component({
  selector: 'app-postsclean',
  standalone: true,
  imports: [HttpClientModule, NgForOf, NgIf],
  templateUrl: './posts.componentclean.html',
  styleUrls: ['./posts.componentclean.css']
})
export class PostsComponentclean {

  posts: Post[] = []; // Array to hold posts
  apiUrl: string = 'https://www.reddit.com/r/all/top.json?limit=10&t=day'; // API URL
  genAI = new GoogleGenerativeAI(environment.apiKey); // Google Generative AI instance
  model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Specify the generative model
  prompt = "Summarize in less than 150 words. dont mention it about being the link or reddit post tell like a news or a fact "; // Summarization prompt

  constructor(private http: HttpClient) {
    // Fetch top posts on component initialization
    this.getTopPosts().subscribe(data => {
      this.initializePosts(data);
    });
  }

  getTopPosts(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Error fetching top posts:', err);
        return []; // Return an empty array in case of error
      })
    );
  }

  async initializePosts(data: any) {
    const postRequests: Promise<Post>[] = data.data.children.map((child: RedditChild) => this.createPost(child));

    // Wait for all post requests to resolve
    this.posts = await Promise.all(postRequests);
  }

  async createPost(child: RedditChild): Promise<Post> {
    const title = child.data.title;
    const permalink = `https://www.reddit.com${child.data.permalink}`;

    // Check if the post is self-text or a link
    if (child.data.is_self) {
      const content = child.data.selftext;
      const summary = await this.summarizeContent(title, content);
      return {
        title,
        content: summary,
        url: permalink,
        commentCount: child.data.num_comments || 0,
      };
    } else {
      const summary = await this.summarizeContent(title, 'This is a link post.'); // Placeholder for link posts
      return {
        title,
        content: summary,
        url: permalink,
        commentCount: child.data.num_comments || 0,
      };
    }
  }

  async summarizeContent(title: string, content: string): Promise<string> {
    const fullPrompt = `${this.prompt} \n\nTitle: ${title}\nContent: ${content}`;

    try {
      await this.delay(1000);
      await this.delay(1000);
      await this.delay(1000);
      await this.delay(1000);
      await this.delay(1000);
      await this.delay(1000);
      const result: GenerateContentResult = await this.model.generateContent(fullPrompt);
      await this.delay(1000);
      await this.delay(1000);
      await this.delay(1000);
      await this.delay(1000);
      await this.delay(1000);
      await this.delay(1000);
      // console.log(result.response.text);// Access the summary text
      return result.response.text();

    } catch (error) {
      console.error('Error summarizing content:', error);
      return 'Failed to summarize content.'; // Return a default message in case of error
    }
  }
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

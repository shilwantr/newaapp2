import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsComponentclean } from './posts.componentclean';

describe('PostsComponent', () => {
  let component: PostsComponentclean;
  let fixture: ComponentFixture<PostsComponentclean>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsComponentclean]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsComponentclean);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Router, RouterLink } from '@angular/router';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
  });

  afterEach(async () => {
    await document.querySelector('ion-menu')?.componentOnReady();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have the 3 MoviRD menu links', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const links = fixture.debugElement
      .queryAll(By.directive(RouterLink))
      .map((el) => el.injector.get(RouterLink));
    expect(links.length).toEqual(3);
    expect(router.serializeUrl(links[0].urlTree!)).toEqual('/inicio');
    expect(router.serializeUrl(links[2].urlTree!)).toEqual('/favoritos');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavetabComponent } from './savetab.component';

describe('SavetabComponent', () => {
  let component: SavetabComponent;
  let fixture: ComponentFixture<SavetabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavetabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavetabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

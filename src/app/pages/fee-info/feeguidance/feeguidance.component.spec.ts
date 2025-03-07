import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeguidanceComponent } from './feeguidance.component';

describe('FeeguidanceComponent', () => {
  let component: FeeguidanceComponent;
  let fixture: ComponentFixture<FeeguidanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeguidanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeguidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

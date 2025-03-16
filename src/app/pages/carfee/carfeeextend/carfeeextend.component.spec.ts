import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarfeeextendComponent } from './carfeeextend.component';

describe('CarfeeextendComponent', () => {
  let component: CarfeeextendComponent;
  let fixture: ComponentFixture<CarfeeextendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarfeeextendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarfeeextendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

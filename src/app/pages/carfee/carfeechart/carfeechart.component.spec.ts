import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarfeechartComponent } from './carfeechart.component';

describe('CarfeechartComponent', () => {
  let component: CarfeechartComponent;
  let fixture: ComponentFixture<CarfeechartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarfeechartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarfeechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

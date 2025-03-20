import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalByWhoComponent } from './rental-by-who.component';

describe('RentalByWhoComponent', () => {
  let component: RentalByWhoComponent;
  let fixture: ComponentFixture<RentalByWhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalByWhoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalByWhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

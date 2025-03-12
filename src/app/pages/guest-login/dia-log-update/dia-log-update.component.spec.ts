import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaLogUpdateComponent } from './dia-log-update.component';

describe('DiaLogUpdateComponent', () => {
  let component: DiaLogUpdateComponent;
  let fixture: ComponentFixture<DiaLogUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiaLogUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiaLogUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

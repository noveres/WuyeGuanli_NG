import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaLogDeleteComponent } from './dia-log-delete.component';

describe('DiaLogDeleteComponent', () => {
  let component: DiaLogDeleteComponent;
  let fixture: ComponentFixture<DiaLogDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiaLogDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiaLogDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

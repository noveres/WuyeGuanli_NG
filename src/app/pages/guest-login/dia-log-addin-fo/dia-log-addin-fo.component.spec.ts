import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaLogAddinFoComponent } from './dia-log-addin-fo.component';

describe('DiaLogAddinFoComponent', () => {
  let component: DiaLogAddinFoComponent;
  let fixture: ComponentFixture<DiaLogAddinFoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiaLogAddinFoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiaLogAddinFoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairRequestFormComponent } from './repair-request-form.component';

describe('RepairRequestFormComponent', () => {
  let component: RepairRequestFormComponent;
  let fixture: ComponentFixture<RepairRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairRequestFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepairRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

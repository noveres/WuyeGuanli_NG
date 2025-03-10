import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentInformationComponent } from './resident-information.component';

describe('ResidentInformationComponent', () => {
  let component: ResidentInformationComponent;
  let fixture: ComponentFixture<ResidentInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

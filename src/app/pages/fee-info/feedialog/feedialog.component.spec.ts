import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedialogComponent } from './feedialog.component';

describe('FeedialogComponent', () => {
  let component: FeedialogComponent;
  let fixture: ComponentFixture<FeedialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

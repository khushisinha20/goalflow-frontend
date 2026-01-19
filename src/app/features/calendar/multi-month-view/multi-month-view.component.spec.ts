import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiMonthViewComponent } from './multi-month-view.component';

describe('MultiMonthViewComponent', () => {
  let component: MultiMonthViewComponent;
  let fixture: ComponentFixture<MultiMonthViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiMonthViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiMonthViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

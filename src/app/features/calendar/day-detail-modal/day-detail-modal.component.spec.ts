import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayDetailModalComponent } from './day-detail-modal.component';

describe('DayDetailModalComponent', () => {
  let component: DayDetailModalComponent;
  let fixture: ComponentFixture<DayDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

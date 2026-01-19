import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyViewComponent } from './yearly-view.component';

describe('YearlyViewComponent', () => {
  let component: YearlyViewComponent;
  let fixture: ComponentFixture<YearlyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearlyViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearlyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

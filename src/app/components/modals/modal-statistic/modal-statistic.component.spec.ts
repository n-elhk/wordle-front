import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStatisticComponent } from './modal-statistic.component';

describe('ModalStatisticComponent', () => {
  let component: ModalStatisticComponent,
    fixture: ComponentFixture<ModalStatisticComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalStatisticComponent],
    });
    fixture = TestBed.createComponent(ModalStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

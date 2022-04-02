import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStatisticComponent } from './modal-statistic.component';

describe('ModalStatisticComponent', () => {
  let component: ModalStatisticComponent;
  let fixture: ComponentFixture<ModalStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalStatisticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

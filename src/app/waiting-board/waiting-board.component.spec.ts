import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingBoardComponent } from './waiting-board.component';

describe('WaitingBoardComponent', () => {
  let component: WaitingBoardComponent;
  let fixture: ComponentFixture<WaitingBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitingBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

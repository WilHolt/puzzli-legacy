import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomviewComponent } from './roomview.component';

describe('RoomviewComponent', () => {
  let component: RoomviewComponent;
  let fixture: ComponentFixture<RoomviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

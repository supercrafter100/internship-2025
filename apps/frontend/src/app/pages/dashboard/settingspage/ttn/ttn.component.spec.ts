import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TtnComponent } from './ttn.component';

describe('TtnComponent', () => {
  let component: TtnComponent;
  let fixture: ComponentFixture<TtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

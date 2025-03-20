import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LorawanComponent } from './lorawan.component';

describe('LorawanComponent', () => {
  let component: LorawanComponent;
  let fixture: ComponentFixture<LorawanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LorawanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LorawanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

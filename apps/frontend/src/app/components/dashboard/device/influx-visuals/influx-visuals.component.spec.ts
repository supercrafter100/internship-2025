import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluxVisualsComponent } from './influx-visuals.component';

describe('InfluxVisualsComponent', () => {
  let component: InfluxVisualsComponent;
  let fixture: ComponentFixture<InfluxVisualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfluxVisualsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfluxVisualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

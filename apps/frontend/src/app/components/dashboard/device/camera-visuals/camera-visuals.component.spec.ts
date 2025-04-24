import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraVisualsComponent } from './camera-visuals.component';

describe('CameraVisualsComponent', () => {
  let component: CameraVisualsComponent;
  let fixture: ComponentFixture<CameraVisualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CameraVisualsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraVisualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

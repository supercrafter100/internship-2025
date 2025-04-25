import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguredeviceComponent } from './configuredevice.component';

describe('ConfiguredeviceComponent', () => {
  let component: ConfiguredeviceComponent;
  let fixture: ComponentFixture<ConfiguredeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfiguredeviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguredeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

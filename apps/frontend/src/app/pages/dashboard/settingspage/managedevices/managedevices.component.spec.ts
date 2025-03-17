import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagedevicesComponent } from './managedevices.component';

describe('ManagedevicesComponent', () => {
  let component: ManagedevicesComponent;
  let fixture: ComponentFixture<ManagedevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagedevicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagedevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

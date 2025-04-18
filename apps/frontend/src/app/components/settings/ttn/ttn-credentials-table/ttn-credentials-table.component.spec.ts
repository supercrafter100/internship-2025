import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TtnCredentialsTableComponent } from './ttn-credentials-table.component';

describe('TtnCredentialsTableComponent', () => {
  let component: TtnCredentialsTableComponent;
  let fixture: ComponentFixture<TtnCredentialsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TtnCredentialsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TtnCredentialsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

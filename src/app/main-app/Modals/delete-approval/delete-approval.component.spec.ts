import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteApprovalComponent } from './delete-approval.component';

describe('DeleteApprovalComponent', () => {
  let component: DeleteApprovalComponent;
  let fixture: ComponentFixture<DeleteApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

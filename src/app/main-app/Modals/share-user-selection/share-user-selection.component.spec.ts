import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareUserSelectionComponent } from './share-user-selection.component';

describe('ShareUserSelectionComponent', () => {
  let component: ShareUserSelectionComponent;
  let fixture: ComponentFixture<ShareUserSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareUserSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareUserSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

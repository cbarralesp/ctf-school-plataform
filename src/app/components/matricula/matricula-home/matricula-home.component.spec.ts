import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculaHomeComponent } from './matricula-home.component';

describe('MatriculaHomeComponent', () => {
  let component: MatriculaHomeComponent;
  let fixture: ComponentFixture<MatriculaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatriculaHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatriculaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

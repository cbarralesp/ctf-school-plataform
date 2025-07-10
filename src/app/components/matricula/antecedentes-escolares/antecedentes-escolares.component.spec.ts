import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntecedentesEscolaresComponent } from './antecedentes-escolares.component';

describe('AntecedentesEscolaresComponent', () => {
  let component: AntecedentesEscolaresComponent;
  let fixture: ComponentFixture<AntecedentesEscolaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntecedentesEscolaresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AntecedentesEscolaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

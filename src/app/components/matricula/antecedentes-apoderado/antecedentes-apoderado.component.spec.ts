import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntecedentesApoderadoComponent } from './antecedentes-apoderado.component';

describe('AntecedentesApoderadoComponent', () => {
  let component: AntecedentesApoderadoComponent;
  let fixture: ComponentFixture<AntecedentesApoderadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntecedentesApoderadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AntecedentesApoderadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

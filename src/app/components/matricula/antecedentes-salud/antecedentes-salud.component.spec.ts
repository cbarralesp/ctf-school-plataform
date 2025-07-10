import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntecedentesSaludComponent } from './antecedentes-salud.component';

describe('AntecedentesSaludComponent', () => {
  let component: AntecedentesSaludComponent;
  let fixture: ComponentFixture<AntecedentesSaludComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntecedentesSaludComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AntecedentesSaludComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

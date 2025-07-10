import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntecedentesFamiliaresComponent } from './antecedentes-familiares.component';

describe('AntecedentesFamiliaresComponent', () => {
  let component: AntecedentesFamiliaresComponent;
  let fixture: ComponentFixture<AntecedentesFamiliaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntecedentesFamiliaresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AntecedentesFamiliaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

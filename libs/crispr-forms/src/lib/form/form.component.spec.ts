import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlType, FormConfig } from '../utils';
import { CrisprFormComponent } from './form.component';

describe('CrisprFormComponent', () => {
  let component: CrisprFormComponent;
  let fixture: ComponentFixture<CrisprFormComponent>;

  const config: FormConfig = {
    fields: [
      {
        controlName: 'name',
        controlType: ControlType.INPUT,
        label: 'Name',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrisprFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrisprFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build a control on the form for each control in the config', () => {
    expect(component.form().get('name')).toBeTruthy();
  });

  it('should render a field for each field in the config', () => {
    expect(
      fixture.nativeElement.querySelectorAll('crispr-input-field').length
    ).toBe(1);
  });

  it('should emit the form and mark it touched when submitted', () => {
    const submitted = jest.fn();
    component.submitted.subscribe(submitted);

    component.handleSubmit();

    expect(submitted).toHaveBeenCalledWith(component.form());
    expect(component.form().touched).toBe(true);
  });
});

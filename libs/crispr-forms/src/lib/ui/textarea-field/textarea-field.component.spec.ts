import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TextareaFieldConfig, ControlType } from '../../utils';
import { TextareaFieldComponent } from './textarea-field.component';

describe('TextareaFieldComponent', () => {
  let component: TextareaFieldComponent;
  let fixture: ComponentFixture<TextareaFieldComponent>;
  let group: FormGroup;

  const config: TextareaFieldConfig = {
    controlName: 'field',
    controlType: ControlType.TEXTAREA,
    label: 'Notes',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaFieldComponent],
    }).compileComponents();

    group = new FormGroup({ field: new FormControl('') });
    fixture = TestBed.createComponent(TextareaFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label', () => {
    expect(fixture.nativeElement.textContent).toContain('Notes');
  });

  it('should write the control value to the textarea', async () => {
    group.get('field').setValue('Some notes');
    await fixture.whenStable();

    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');
    expect(textarea.value).toBe('Some notes');
  });
});

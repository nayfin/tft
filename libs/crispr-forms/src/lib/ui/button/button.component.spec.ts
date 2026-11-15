import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { ButtonConfig, ControlType } from '../../utils';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let group: FormGroup;

  const config: ButtonConfig = {
    controlType: ControlType.BUTTON,
    label: 'Save',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    group = new FormGroup({});
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a submit button with the label by default', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Save');
    expect(button.type).toBe('submit');
  });

  it('should call the configured callback with the group when clicked', () => {
    const callback = jest.fn();
    fixture.componentRef.setInput('config', { ...config, callback });

    fixture.nativeElement.querySelector('button').click();

    expect(callback).toHaveBeenCalledWith(group, expect.any(MouseEvent));
  });
});

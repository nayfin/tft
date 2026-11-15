import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ControlType, MapFieldConfig } from '../../utils';
import { MapFieldComponent } from './map-field.component';

describe('MapFieldComponent', () => {
  let component: MapFieldComponent;
  let fixture: ComponentFixture<MapFieldComponent>;

  const config: MapFieldConfig = {
    controlName: 'location',
    controlType: ControlType.MAP,
    label: 'Location',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput(
      'group',
      new FormGroup({ location: new FormControl(null) })
    );
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

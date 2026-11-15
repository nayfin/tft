import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavListComponent } from './sidenav-list.component';
import { SidenavLink, SidenavSection } from './sidenav-list.model';

describe('SidenavListComponent', () => {
  let component: SidenavListComponent;
  let fixture: ComponentFixture<SidenavListComponent>;

  const link: SidenavLink = { title: 'First link', path: '/first' };
  const sections: SidenavSection[] = [
    { title: 'Section one', subtitle: 'About one', links: [link] },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render no panels without sections', () => {
    expect(
      fixture.nativeElement.querySelectorAll('mat-expansion-panel').length
    ).toBe(0);
  });

  it('should render a panel with its links for each section', async () => {
    fixture.componentRef.setInput('sections', sections);
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('mat-expansion-panel').length).toBe(1);
    expect(element.querySelector('mat-panel-title')?.textContent).toContain(
      'Section one'
    );
    expect(element.querySelector('mat-list-item')?.textContent).toContain(
      'First link'
    );
  });

  it('should emit itemClicked with the clicked link', async () => {
    fixture.componentRef.setInput('sections', sections);
    await fixture.whenStable();
    const emitted = jest.fn();
    component.itemClicked.subscribe(emitted);

    const item: HTMLElement =
      fixture.nativeElement.querySelector('mat-list-item');
    item.click();

    expect(emitted).toHaveBeenCalledWith(link);
  });
});

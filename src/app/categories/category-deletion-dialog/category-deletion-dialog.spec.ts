import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryDeletionDialog } from './category-deletion-dialog';

describe('CategoryDeletionDialog', () => {
  let component: CategoryDeletionDialog;
  let fixture: ComponentFixture<CategoryDeletionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryDeletionDialog],
      providers: [
        provideHttpClientTesting(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: 1,
            name: 'Test Category',
          },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryDeletionDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

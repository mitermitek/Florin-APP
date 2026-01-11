import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryFormDialog } from './category-form-dialog';

describe('CategoryFormDialog', () => {
  let component: CategoryFormDialog;
  let fixture: ComponentFixture<CategoryFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryFormDialog],
      providers: [
        provideHttpClientTesting(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: undefined,
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFormDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

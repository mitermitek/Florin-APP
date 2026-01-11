import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountFormDialog } from './account-form-dialog';

describe('AccountFormDialog', () => {
  let component: AccountFormDialog;
  let fixture: ComponentFixture<AccountFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountFormDialog],
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

    fixture = TestBed.createComponent(AccountFormDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountTransactionFormDialog } from './account-transaction-form-dialog';

describe('AccountTransactionFormDialog', () => {
  let component: AccountTransactionFormDialog;
  let fixture: ComponentFixture<AccountTransactionFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountTransactionFormDialog],
      providers: [
        provideHttpClientTesting(),
        provideNativeDateAdapter(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            accountId: 1,
            transaction: undefined,
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

    fixture = TestBed.createComponent(AccountTransactionFormDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

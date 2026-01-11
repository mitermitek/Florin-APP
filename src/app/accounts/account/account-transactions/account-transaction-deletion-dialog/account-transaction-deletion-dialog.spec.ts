import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountTransactionDeletionDialog } from './account-transaction-deletion-dialog';

describe('AccountTransactionDeletionDialog', () => {
  let component: AccountTransactionDeletionDialog;
  let fixture: ComponentFixture<AccountTransactionDeletionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountTransactionDeletionDialog],
      providers: [
        provideHttpClientTesting(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            accountId: 1,
            transaction: {
              id: 1,
              category: {
                id: 1,
                name: 'Test Category',
              },
              type: 'income',
              amount: 100,
              date: '2026-01-01',
              title: 'Test Transaction',
            },
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

    fixture = TestBed.createComponent(AccountTransactionDeletionDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

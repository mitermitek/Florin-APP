import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountDeletionDialog } from './account-deletion-dialog';

describe('AccountDeletionDialog', () => {
  let component: AccountDeletionDialog;
  let fixture: ComponentFixture<AccountDeletionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDeletionDialog],
      providers: [
        provideHttpClientTesting(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: 1,
            name: 'Test Account',
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

    fixture = TestBed.createComponent(AccountDeletionDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

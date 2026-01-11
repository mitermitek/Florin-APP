import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountTransactions } from './account-transactions';

describe('AccountTransactions', () => {
  let component: AccountTransactions;
  let fixture: ComponentFixture<AccountTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountTransactions],
      providers: [provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountTransactions);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('accountId', 1);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TransactionForm } from './transaction-form';

describe('TransactionForm', () => {
  let component: TransactionForm;
  let fixture: ComponentFixture<TransactionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionForm],
      providers: [provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionForm);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('accountId', 1);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

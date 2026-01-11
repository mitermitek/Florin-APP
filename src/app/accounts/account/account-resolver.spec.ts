import { TestBed } from '@angular/core/testing';
import { RedirectCommand, ResolveFn } from '@angular/router';
import { Account } from '../accounts.data';
import { accountResolver } from './account-resolver';

describe('accountResolver', () => {
  const executeResolver: ResolveFn<Account | RedirectCommand> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => accountResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});

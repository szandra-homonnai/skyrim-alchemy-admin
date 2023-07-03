import { TestBed } from '@angular/core/testing';
import { IngredientService } from '@app/services/ingredient.service';

// TODO: more research on testing @angular/fire as it has no officially supported method
xdescribe('IngredientService', () => {
  let service: IngredientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

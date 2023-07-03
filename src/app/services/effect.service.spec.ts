import { TestBed } from '@angular/core/testing';
import { EffectService } from '@app/services/effect.service';

// TODO: more research on testing @angular/fire as it has no officially supported method
xdescribe('EffectService', () => {
  let service: EffectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EffectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

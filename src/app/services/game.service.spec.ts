import { TestBed } from '@angular/core/testing';
import { GameService } from '@app/services/game.service';

// TODO: more research on testing @angular/fire as it has no officially supported method
xdescribe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

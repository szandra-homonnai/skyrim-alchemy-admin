import { DocumentReference } from '@angular/fire/firestore';
import { EffectSchoolEnum } from '@app/enums/effect-school.enum';
import { EffectTypeEnum } from '@app/enums/effect-type.enum';
import { Effect } from '@app/interfaces/effect.interface';
import { Game } from '@app/interfaces/game.interface';
import { IngredientDocument } from '@app/interfaces/ingredient.interface';

export const mockGame: Game = {
  id: 'asdf456',
  name: 'Game'
};

export const mockEffect: Effect = {
  id: 'xyz987',
  name: 'Effect',
  school: EffectSchoolEnum.Alteration,
  type: EffectTypeEnum.Defensive
};

export const mockIngredientDocument: IngredientDocument = {
  id: 'abc123',
  name: 'Ingredient',
  effect1: { id: mockEffect.id } as DocumentReference,
  effect2: { id: 'abcd' } as DocumentReference,
  effect3: { id: 'efgh' } as DocumentReference,
  effect4: { id: 'ijkl' } as DocumentReference,
  game: { id: mockGame.id } as DocumentReference
};

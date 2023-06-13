import { DocumentReference } from '@angular/fire/firestore';

export interface Ingredient {
  id?: string;
  name: string;
  game: string;
  effect1: string;
  effect2: string;
  effect3: string;
  effect4: string;
}

export interface IngredientDocument {
  id?: string;
  name: string;
  game: DocumentReference;
  effect1: DocumentReference;
  effect2: DocumentReference;
  effect3: DocumentReference;
  effect4: DocumentReference;
}

import { Injectable } from '@angular/core';
import { CollectionReference, DocumentReference, Firestore, addDoc, collection, collectionData, doc, orderBy, query, updateDoc } from '@angular/fire/firestore';
import { Ingredient, IngredientDocument } from '@app/interfaces/ingredient.interface';
import { EffectService } from '@app/services/effect.service';
import { GameService } from '@app/services/game.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private readonly collectionName: string = 'ingredients';
  private collection: CollectionReference<IngredientDocument>;

  constructor(
    private firestore: Firestore,
    private effectService: EffectService,
    private gameService: GameService
  ) {
    this.collection = collection(this.firestore, this.collectionName) as CollectionReference<IngredientDocument>;
    query(this.collection, orderBy('name', 'desc'));
  }

  public getDocumentById(id: string): DocumentReference<IngredientDocument> {
    return doc(this.firestore, `/${this.collectionName}/${id}`) as DocumentReference<IngredientDocument>;
  }

  public list(): Observable<IngredientDocument[]> {
    return collectionData<IngredientDocument>(this.collection, { idField: 'id' });
  }

  public create(ingredient: Ingredient): Promise<DocumentReference> {
    return addDoc(this.collection, {
      name: ingredient.name,
      effect1: this.effectService.getDocumentById(ingredient.effect1),
      effect2: this.effectService.getDocumentById(ingredient.effect2),
      effect3: this.effectService.getDocumentById(ingredient.effect3),
      effect4: this.effectService.getDocumentById(ingredient.effect4),
      game: this.gameService.getDocumentById(ingredient.game)
    });
  }

  public update(id: string, ingredient: Ingredient): Promise<void> {
    const reference: DocumentReference<IngredientDocument> = this.getDocumentById(id);
    return updateDoc(reference, {
      name: ingredient.name,
      effect1: this.effectService.getDocumentById(ingredient.effect1),
      effect2: this.effectService.getDocumentById(ingredient.effect2),
      effect3: this.effectService.getDocumentById(ingredient.effect3),
      effect4: this.effectService.getDocumentById(ingredient.effect4),
      game: this.gameService.getDocumentById(ingredient.game)
    });
  }
}

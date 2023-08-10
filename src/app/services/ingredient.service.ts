import { Injectable } from '@angular/core';
import { CollectionReference, DocumentReference, Firestore, addDoc, collection, collectionData, deleteDoc, doc, orderBy, query, updateDoc } from '@angular/fire/firestore';
import { Ingredient, IngredientDocument } from '@app/interfaces/ingredient.interface';
import { EffectService } from '@app/services/effect.service';
import { GameService } from '@app/services/game.service';
import { Observable, map, of, switchMap } from 'rxjs';

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
    return collectionData<IngredientDocument>(this.collection, { idField: 'id' })
      .pipe(
        map((items: IngredientDocument[]) => (items.sort((a: IngredientDocument, b: IngredientDocument) => {
          if (a.name > b.name) {
            return 1;
          }

          if (b.name > a.name) {
            return -1;
          }

          return 0;
        })))
      );
  }

  public getNameMapByEffectIds(): Observable<Map<string, string[]>> {
    return this.list()
      .pipe(
        switchMap((ingredients: IngredientDocument[]) => {
          const map: Map<string, string[]> = new Map();

          for (const ingredient of ingredients) {
            map.set(ingredient.effect1.id,
              map.has(ingredient.effect1.id) ? [...map.get(ingredient.effect1.id), ingredient.name] : [ingredient.name]
            );

            map.set(ingredient.effect2.id,
              map.has(ingredient.effect2.id) ? [...map.get(ingredient.effect2.id), ingredient.name] : [ingredient.name]
            );

            map.set(ingredient.effect3.id,
              map.has(ingredient.effect3.id) ? [...map.get(ingredient.effect3.id), ingredient.name] : [ingredient.name]
            );

            map.set(ingredient.effect4.id,
              map.has(ingredient.effect4.id) ? [...map.get(ingredient.effect4.id), ingredient.name] : [ingredient.name]
            );
          }

          return of(map);
        })
      );
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

  public delete(id: string): Promise<void> {
    const reference: DocumentReference<IngredientDocument> = this.getDocumentById(id);
    return deleteDoc(reference);
  }
}

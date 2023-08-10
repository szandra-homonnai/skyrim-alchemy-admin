import { Injectable } from '@angular/core';
import { CollectionReference, DocumentReference, Firestore, addDoc, collection, collectionData, deleteDoc, doc, orderBy, query, updateDoc } from '@angular/fire/firestore';
import { Effect } from '@app/interfaces/effect.interface';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EffectService {
  private readonly collectionName: string = 'effects';
  private collection: CollectionReference<Effect>;

  constructor(private firestore: Firestore) {
    this.collection = collection(this.firestore, this.collectionName) as CollectionReference<Effect>;
    query(this.collection, orderBy('name', 'desc'));
  }

  public getDocumentById(id: string): DocumentReference<Effect> {
    return doc(this.firestore, `/${this.collectionName}/${id}`) as DocumentReference<Effect>;
  }

  public list(): Observable<Effect[]> {
    return collectionData<Effect>(this.collection, { idField: 'id' })
      .pipe(
        map((items: Effect[]) => (items.sort((a: Effect, b: Effect) => {
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

  public create(effect: Effect): Promise<DocumentReference> {
    return addDoc(this.collection, effect);
  }

  public update(id: string, effect: Effect): Promise<void> {
    const reference: DocumentReference<Effect> = this.getDocumentById(id);
    return updateDoc(reference, effect);
  }

  public delete(id: string): Promise<void> {
    const reference: DocumentReference<Effect> = this.getDocumentById(id);
    return deleteDoc(reference);
  }
}

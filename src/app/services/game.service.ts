import { Injectable } from '@angular/core';
import { CollectionReference, DocumentReference, Firestore, collection, collectionData, doc, orderBy, query } from '@angular/fire/firestore';
import { Game } from '@app/interfaces/game.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly collectionName: string = 'games';
  private collection: CollectionReference<Game>;

  constructor(private firestore: Firestore) {
    this.collection = collection(this.firestore, this.collectionName) as CollectionReference<Game>;
    query(this.collection, orderBy('name', 'desc'));
  }

  public getDocumentById(id: string): DocumentReference<Game> {
    return doc(this.firestore, `/${this.collectionName}/${id}`) as DocumentReference<Game>;
  }

  public list(): Observable<Game[]> {
    return collectionData<Game>(this.collection, { idField: 'id' });
  }
}

import { Injectable } from '@angular/core';
import { Auth, User, UserCredential, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private firebaseAuth: Auth) { }

  public checkLoggedIn(): Promise<boolean> {
    return new Promise((resolve: (value: boolean) => void) => {
      onAuthStateChanged(this.firebaseAuth, (user: User) => {
        this.isLoggedIn.next(user ? true : false);
        resolve(this.isLoggedIn.value);
      });
    });
  }

  public signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.firebaseAuth, email, password);
  }

  public signOut(): Promise<void> {
    return signOut(this.firebaseAuth);
  }
}

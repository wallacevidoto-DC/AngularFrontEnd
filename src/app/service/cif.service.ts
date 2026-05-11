import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CifSession {
  cifCod: string;
  cifId: number;
}

@Injectable({
  providedIn: 'root'
})
export class CifService {
  private _currentCif = new BehaviorSubject<CifSession | null>(this.loadCif());

  get currentCif$(): Observable<CifSession | null> {
    return this._currentCif.asObservable();
  }

  get currentCif(): CifSession | null {
    return this._currentCif.value;
  }

  setCif(cif: CifSession) {
    this._currentCif.next(cif);
    localStorage.setItem('active_cif', JSON.stringify(cif));
  }

  clearCif() {
    this._currentCif.next(null);
    localStorage.removeItem('active_cif');
  }

  private loadCif(): CifSession | null {
    const saved = localStorage.getItem('active_cif');
    return saved ? JSON.parse(saved) : null;
  }
}

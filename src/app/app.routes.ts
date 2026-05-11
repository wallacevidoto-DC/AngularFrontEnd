import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { EntradaMercadoria } from './pages/entrada-mercadoria/entrada-mercadoria';
import { MapaEstoque } from './pages/mapa-estoque/mapa-estoque';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { 
    path: 'entrada-mercadoria', 
    component: EntradaMercadoria,
    children: [
      { path: 'livre', loadComponent: () => import('./components/entrada-livre/entrada-livre').then(m => m.EntradaLivre) },
      { path: 'cif', loadComponent: () => import('./components/entrada-cif/entrada-cif').then(m => m.EntradaCif) }
    ]
  },
  { path: 'mapa-estoque', component: MapaEstoque },
];

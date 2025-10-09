import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { EntradaMercadoria } from './pages/entrada-mercadoria/entrada-mercadoria';
import { MapaEstoque } from './pages/mapa-estoque/mapa-estoque';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'entrada-mercadoria', component: EntradaMercadoria },
  { path: 'mapa-estoque', component: MapaEstoque },
];

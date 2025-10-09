import { Component } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar";

@Component({
  selector: 'app-home',
  imports: [Sidebar],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}

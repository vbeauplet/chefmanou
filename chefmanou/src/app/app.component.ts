import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chefmanou';
  
  constructor(){
    // Configure firebase accesses
    const firebaseConfig = {
      apiKey: "AIzaSyCEAczqtWjHZjJZ3hyW550T53ks3tEWCZY",
      authDomain: "chefmanou-1705a.firebaseapp.com",
      databaseURL: "https://chefmanou-1705a.firebaseio.com",
      projectId: "chefmanou-1705a",
      storageBucket: "chefmanou-1705a.appspot.com",
      messagingSenderId: "692441962158",
      appId: "1:692441962158:web:68da540f423c2a8b287f3f",
      measurementId: "G-B9LVQ89TLF"
    }
    firebase.initializeApp(firebaseConfig);
    
    
  }
}

import { Component } from '@angular/core';
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonList
} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonList
],
})
export class HomePage {
	// Store the user's bedtimem and wake-up time
	sleepStart: string = '';
	sleepEnd: string = '';
	constructor(public sleepService:SleepService) {

	}

	ngOnInit() {
		console.log(this.allSleepData);
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}

	// Validate the entered times and save a new overnight sleep entry
	logOvernightSleep() {
    // Make sure the user entered both required times
    if (!this.sleepStart || !this.sleepEnd) {
        alert('Please enter both bedtime and wake-up time.');
        return;
    }

	// convert the input strings into Date objects
	const start = new Date(this.sleepStart);
	const end = new Date(this.sleepEnd);

	// prevent invalid sleep entries where wake-up is before bedtime
	if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
		alert('Please enter valid times with wake-up after bedtime.');
		return;
	}

	// Create a sleep record and add it to the SleepService
	const sleepData = new OvernightSleepData(start, end);
 	this.sleepService.logOvernightData(sleepData);
	
	// Clear the input fields after successfully saving the entry
    this.sleepStart = '';
    this.sleepEnd = '';
	}

	// Retrieve all logged overnight sleep entries for display
	get overnightSleepData() {
		return SleepService.AllOvernightData;
	}
}

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
    IonList,
	IonSelect,
	IonSelectOption
} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    FormsModule,
	DatePipe,
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
    IonList,
	IonSelect,
	IonSelectOption
],
})
export class HomePage {
	// Store the user's bedtimem and wake-up time
	sleepStart: string = '';
	sleepEnd: string = '';
	// Store the user's selected Stanford Sleepiness Scale rating
	sleepinessRating: number = 1;

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
		// Prevent logging before saved records finish loading
		if (!this.sleepService.isStorageReady) {
			return;
		}

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

    // Validate and save a daytime sleepiness entry
    logSleepiness() {
        // Prevent logging before saved records finish loading
		if (!this.sleepService.isStorageReady) {
			return;
		}
		
		// Make sure the selected rating is within the Stanford Scale
        if (!Number.isInteger(this.sleepinessRating) ||
            this.sleepinessRating < 1 ||
            this.sleepinessRating > 7) {
            alert('Please select a sleepiness rating between 1 and 7.');
            return;
        }

        // Create a sleepiness record using the current date and time
        const sleepData = new StanfordSleepinessData(
            this.sleepinessRating,
            new Date()
        );

        // Save the new entry using the existing SleepService
        this.sleepService.logSleepinessData(sleepData);

        // Reset the selected rating after saving
        this.sleepinessRating = 1;
    }

	// Retrieve the most recently recorded overnight sleep entry
	get latestOvernightSleep(): OvernightSleepData | null {
		const entries = SleepService.AllOvernightData;

		if (entries.length === 0) {
			return null;
		}

		// Find the entry with the most recent bedtime
		return entries.reduce((latest, entry) =>
			entry.getSleepStart().getTime() > latest.getSleepStart().getTime()
				? entry
				: latest
		);
	}

	// Retrieve the most recently recorded daytime sleepiness entry
	get latestSleepiness(): StanfordSleepinessData | null {
		const entries = SleepService.AllSleepinessData;

		if (entries.length === 0) {
			return null;
		}

		// Find the entry with the most recent timestamp
		return entries.reduce((latest, entry) =>
			entry.getLoggedAt().getTime() > latest.getLoggedAt().getTime()
				? entry
				: latest
		);
	}

    // Confirm before deleting an overnight sleep entry
	deleteOvernightSleep(entry: OvernightSleepData) {
		// Prevent accidental deletions by asking for confirmatino
		const confirmed = window.confirm(
			'Are you sure you want to delete this overnight sleep entry?'
		);

		if (confirmed) {
			this.sleepService.deleteOvernightData(entry);
		}
	}

	// Confirm before deleting a daytime sleepiness entry
	deleteSleepiness(entry: StanfordSleepinessData) {
		// Prevent accidental deletions by asking for confirmation
		const confirmed = window.confirm(
			'Are you sure you want to delete this sleepiness entry?'
		);

		if (confirmed) {
			this.sleepService.deleteSleepinessData(entry);
		}
	}
	
	// Retrieve all logged daytime sleepiness entries for display
    get sleepinessData() {
        return SleepService.AllSleepinessData;
    }

}

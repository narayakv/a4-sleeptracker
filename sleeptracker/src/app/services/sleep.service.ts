import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	private static LoadDefaultData:boolean = true;
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];
	// Store the initialized Ionic Storage instance
	private _storage: Storage | null = null;
	// Indicates whether saved sleep records have finished loading
	public isStorageReady: boolean = false;

	constructor(private storage: Storage) {
		// Initialize storage and load previously saved sleep records
		this.initStorage();
	}

	
	// Initialize Ionic Storage and restore previously saved records
	private async initStorage() {
		// Create the storage database before reading or writing data
		this._storage = await this.storage.create();

		// Retrieve saved overnight sleep and daytime sleepiness records
		const savedOvernight = await this._storage.get('overnightSleep');
		const savedSleepiness = await this._storage.get('daytimeSleepiness');

		// Clear the arrays before restoring data to prevent duplicates
		SleepService.AllSleepData.length = 0;
		SleepService.AllOvernightData.length = 0;
		SleepService.AllSleepinessData.length = 0;

		// Restore previously saved overnight sleep records
		if (savedOvernight !== null) {
			for (const entry of savedOvernight) {
				// Reconstruct Date objects and the OvernightSleepData class
				const sleepData = new OvernightSleepData(
					new Date(entry.start),
					new Date(entry.end)
				);

				SleepService.AllOvernightData.push(sleepData);
				SleepService.AllSleepData.push(sleepData);
			}
		}

		// Restore previously saved daytime sleepiness records
		if (savedSleepiness !== null) {
			for (const entry of savedSleepiness) {
				// Reconstruct the StanfordSleepinessData class
				const sleepData = new StanfordSleepinessData(
					entry.rating,
					new Date(entry.date)
				);

				SleepService.AllSleepinessData.push(sleepData);
				SleepService.AllSleepData.push(sleepData);
			}
		}

		// Add starter records only when no saved data exists
		if (savedOvernight === null && savedSleepiness === null) {
			this.addDefaultData();

			// Ensure the starter records are saved before allowing new entries
			await this.saveOvernightData();
			await this.saveSleepinessData();
		}

		// Allow new entries once stored records have been restored
		this.isStorageReady = true;
	}

	// Save all overnight sleep records to Ionic Storage
	private async saveOvernightData() {
		// Make sure storage has been initialized
		if (!this._storage) {
			return;
		}

		// Use the public getters to retrieve each record's sleep times
		const data = SleepService.AllOvernightData.map(entry => ({
			start: entry.getSleepStart(),
			end: entry.getSleepEnd()
		}));

		// Store the overnight sleep records
		await this._storage.set('overnightSleep', data);
	}

	// Save all daytime sleepiness records to Ionic Storage
	private async saveSleepinessData() {
		// Make sure storage has been initialized
		if (!this._storage) {
			return;
		}

		// Use the public getters to retrieve each rating and timestamp
		const data = SleepService.AllSleepinessData.map(entry => ({
			rating: entry.getLoggedValue(),
			date: entry.getLoggedAt()
		}));

		// Store the daytime sleepiness records
		await this._storage.set('daytimeSleepiness', data);
	}

	private addDefaultData() {
		var goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(1, 3, 0); //1:03am
		var wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000); //Sleep for exactly eight hours, waking up at 9:03am
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp)); // add that person was asleep 1am-9am yesterday
		var sleepinessDate = new Date();
		sleepinessDate.setDate(sleepinessDate.getDate() - 1); //set to yesterday
		sleepinessDate.setHours(14, 38, 0); //2:38pm
		this.logSleepinessData(new StanfordSleepinessData(4, sleepinessDate)); // add sleepiness at 2pm
		goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(23, 11, 0); //11:11pm
		wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000); //Sleep for exactly nine hours
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));
	}

	public logOvernightData(sleepData:OvernightSleepData) {
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllOvernightData.push(sleepData);

		// Save new entries only after storage initialization is complete
		if (this.isStorageReady) {
			void this.saveOvernightData();
		}
	}

	public logSleepinessData(sleepData:StanfordSleepinessData) {
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllSleepinessData.push(sleepData);

		// Save new entries only after storage initialization is complete
		if (this.isStorageReady) {
			void this.saveSleepinessData();
		}
	}

	// Remove an overnight sleep entry and update persistent storage
	public deleteOvernightData(sleepData: OvernightSleepData) {
		// Do not modify records until storage has finished loading
		if (!this.isStorageReady) {
			return;
		}

		// Find and remove the entry from the overnight sleep history
		const index = SleepService.AllOvernightData.indexOf(sleepData);
		if (index === -1) {
			return;
		}

		SleepService.AllOvernightData.splice(index, 1);

		// Remove the same entry from the combined sleep history
		const allIndex = SleepService.AllSleepData.indexOf(sleepData);
		if (allIndex !== -1) {
			SleepService.AllSleepData.splice(allIndex, 1);
		}

		// Save the updated overnight sleep history
		void this.saveOvernightData();
	}

	// Remove a daytime sleepiness entry and update persistent storage
	public deleteSleepinessData(sleepData: StanfordSleepinessData) {
		// Do not modify records until storage has finished loading
		if (!this.isStorageReady) {
			return;
		}

		// Find and remove the entry from the daytime sleepiness history
		const index = SleepService.AllSleepinessData.indexOf(sleepData);
		if (index === -1) {
			return;
		}

		SleepService.AllSleepinessData.splice(index, 1);

		// Remove the same entry from the combined sleep history
		const allIndex = SleepService.AllSleepData.indexOf(sleepData);
		if (allIndex !== -1) {
			SleepService.AllSleepData.splice(allIndex, 1);
		}

		// Save the updated daytime sleepiness history
		void this.saveSleepinessData();
	}
}

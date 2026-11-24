--Readme document for Narayan Venkataramana, narayakv@uci.edu, 46681580 --

A4 Group 3

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?

Around 15 hours

3. What online resources did you consult when completing this assignment? (list specific URLs)

Ionic Storage: https://github.com/ionic-team/ionic-storage

Angular Documentation: https://angular.dev

ChatGPT (OpenAI): https://chatgpt.com

4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?

I completed this assignment individually.

5. Is there anything special we need to know in order to run your code?

Navigate to the sleeptracker directory, run npm install to install the dependencies, and
then run ionic serve to launch the application in a browser. The app uses Ionic Storage to 
persist logged sleep data across refreshes and does not require a physical device.

--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?

I designed my app primarly for people like me: college students who want things to be simple and fast.
The interface allows traking your sleep and daytime alertness, prioritizing quick logging and easy
access to recent sleep information.

7. Did you design your app specifically for iOS or Android, or both?

I designed it to work on both iOS and Android using Ionic's cross-platform components. However, I would
say primarily for iOS since I tested the interface using Chrome's iPhone 16 viewport.

8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?

Users can enter their bedtime and wake-up time using date/time input fields and save the record with the save button. I chose
this approach because it is a convenient way for users to log their sleep after waking up, without having to interact with the
app before going to bed.

9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?

Users can select a rating from 1 to 7 using the Stanford Sleepiness Scale and save it with the save button, which also
automatically records the current date and time. The dropdown includes descriptions of each rating to make the rating
scale easier to understand, and to make it more convenient for the user to pick their level of sleepiness.

10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?

Users can view their most recent sleep duration and sleepiness rating in the dashboard at the top of the screen, while
separate history sections display all previously logged records toward the bottom of the page. I chose a single scrollable
page to minimize navigation and allow users to quickly see both their most recent information and their full history.

11. Which feature choose--using a native device resource, backing up logged data, or both?

I chose to implement persistent storage for both overnight sleep records and daytime sleepiness ratings using Ionic Storage.

12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?

Not applicable, I implemented the data backup option instead of using a native device resource.

13. If you backed up logged data, where does it back up to?

The app saves overnight sleep and daytime sleepiness records locally using Ionic Storage, which uses browser storage
mechanisms like IndexedDB when running in a browser. Saved records are then restored when the application reloads,
so users do not lose their logged data after refreshing the page.

14. How does your app implement or follow principles of good mobile design?

The app provides a useful initial dashboard, familiar Ionic components, and input validation
to prevent invalid sleep records. It also includes Delete buttons with confirmation prompts as an
uh-oh feature, along with a consistent sleep-themed dark design, readable text,
and touch-friendly controls.

Additional Features:

- A summary dashboard dsiplaying the most recent overnight sleep duration and daytime sleepiness rating.
- The ability to delete individual records with confirmation prompts.
- Persistent deletion, so removed entries do not reappear after refreshing.
- Input validation to prevent missing or invalid bedtime and wake-up values.
- Automatic timestamps for daytime sleepiness records.
- Responsive navy and lavendar styling that is optimized for mobile screens.

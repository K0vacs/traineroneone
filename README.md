# Trainer 11

![Hero Image](static/images/hero.png)

This web application serves as an easy to use workout builder with a single page exercise view, optimised for mobile devices. The application comprises of 4 pages for programs, workouts, exercises and form view. Each page provides a unique view to the user. The desired effect of the application is to enable users to post new workout programs and enable users to view and/or use the workout programs that have been listed on the application. The application was built using four major languages namely HTML5, CSS, JavaScript and Python. Together with these languages various libraries and frameworks were used to build the application, all of which are detailed in the deployment section.

## UX

### Function
This project is for personal trainers and people looking for new workout programs that would like to try new workouts or add workouts to the application. The exercise view is optimised to use on mobile while at the gym. This is a free application where the users add content much like social media applications. Currently, there are existing applications with similar functionality which the application owners add and manage the content (often subscription-based). The Trainer11 application is easy to use and easy to set up as defined in the deployment section.

### Styling
This application was built using the front-end framework called [Materialize](https://materializecss.com/) with minor adjustments to the default Materialize theme to improve responsiveness, custom look and feel. This theme was designed with a dark primary base with sharp bright orange accents to create a clean and focused look to the application. The orange accents used, draw the attention of the users thereby allowing the application owner to control what the users pay attention to on the application.

The font used is from the standard Materialize theme, called Roboto. The headings are a combination of bold 700 and regular 400 font-weight depending on their location and importance. All other text is regular 400 font-weight. Some additional styling used includes turquoise blue, red and orange links. The colours are based on the functionality of the links and lastly, the icons used are from [Google's Material Icons](https://material.io/) which compliments Materialize.

### User Stories
- As a developer, I want to expand on the project, so that I can customise the project to my needs without starting from the beginning.
- As an employer/client, I want to hire a capable developer, so I can complete my project successfully.
- As a personal trainer, I want to create online workout programs, so I can further my thought leadership when it comes to personal training.
- As a personal trainer, I want to provide online workout programs, so I can give workouts to my clients while they are on holiday.
- As a personal trainer, I want to find new workout programs for my clients, so I can challenge my clients with new exercises.
- As an active person, I want to find new workout programs, so I can challenge myself with new workouts.
- As an active person, I want to create online workout programs, so I can provide value to other users
- As a Code Institue Marker, I want to determine the student has achieved the learning outcomes so that I can score the level of achievement (out of 5).
- As a recruiter, I want to determine the prospects capabilities, so that I can place successful candidates.
- As a gym owner, I want to create online workout programs, so I can encourage users to join our gym.
- As a gym owner, I want to provide online workout programs to my clients, so my clients can get the maximum benefit from the gym.
- As a virtual trainer, I want to create online workout programs, so I can provide my clients with workouts.
- As a virtual trainer, I want to find online workout programs, so I can provide my clients with new workouts.

### Page Sections

#### Navbar Light
> This section consists of a small full-width bar with a transparent background that overlaps the header slider. The bar consists of the name and logo section on the left and an add program button on the right.

#### Navbar Dark
> This section consists of a small full-width bar with a dar background. This navbar is used when there is no header slider on the page to avoid clashing with the body background. The layout is the same as the Navbar Light.

#### Header
> This section consists of a 550px height full-width slick slider with three slides. Each slide has an h1 heading and a p element containing an inspirational quote relating to exercise. This section is used in the programs.html and workouts.html pages.

#### Programs Grid
> This section consists of a grid of cards with a width of one third each. Each card displays an image for the program with a description below followed by edit and delete link at the bottom of the card. Additionally, there is a floating button in between the image and description with a right arrow that takes the user to the workouts associated with the program. This grid section is prepended with a navigation breadcrumb. 

#### Workouts Grid
> This section consists of a grid of cards with a width of one third each. Each card displays an image for the workout with a workout title below followed by edit and delete link at the bottom of the card. Additionally, on clicking the card the workout description will slide up to display. The description has an exercises link below that navigates to the associated exercises. This grid section is prepended with a navigation breadcrumb.

#### Exercises View
> This section consists of a single row of two 50% width panels. The left panel displays the workout name and exercises metadata in pills. The right panel displays a slick slider for each exercise in the workout. Each exercise displays in a card with an image with a description below followed by edit and delete link in the footer. This section is prepended with a navigation breadcrumb.

#### Sidenav
> The left panel from the Exercises View becomes the Sidenav content displayed on mobile view. This Sidenav has a small handle fixed to the left of the screen to pop-out the side nav.

#### Programs Form
> This section consists of a collapsible with three sections. Each section has a form which allows the user to CRUD on the related item (Programs, Workouts and Exercises). Depending on the users' actions the relevant buttons will be made available to add, view, update and delete the relent item using AJAX and JavaScript. 

#### Modal
> This section is displayed when the delete link is clicked on the program, workout or exercise card. the modal acts as a deletion confirmation (Yes / No) for the selected item.

#### Footer
> This section consists of two rows. The first row consists of three major elements of one third each. T1 displays an inspirational quote with social media buttons below. T2 and T3 display links to programs and workouts respectively. The second row displays a left-aligned copyright text and right-aligned add program link.

### Mockups
The project mockups are available below and in the [mockups directory](https://github.com/K0vacs/traineroneone/tree/master/static/images) in mobile, tablet and desktop views:

#### Mobile
- [Program Mockup](https://raw.githubusercontent.com/K0vacs/traineroneone/master/static/images/Mobile-programs.png)
- [Workout Mockup](https://raw.githubusercontent.com/K0vacs/traineroneone/master/static/images/Mobile-workouts.png)
- [Exercise Mockup](https://raw.githubusercontent.com/K0vacs/traineroneone/master/static/images/Mobile-exercises.png)
- [Form Mockup](https://raw.githubusercontent.com/K0vacs/traineroneone/master/static/images/Mobile-form.png)

#### Tablet

- [Program Mockup](https://raw.githubusercontent.com/K0vacs/traineroneone/master/static/images/Tablet-programs.png)
- [Workout Mockup](https://raw.githubusercontent.com/K0vacs/traineroneone/master/static/images/Tablets-workouts.png)
- [Exercise Mockup](https://raw.githubusercontent.com/K0vacs/traineroneone/master/static/images/Tablet-exercises.png)
- [Form Mockup](https://raw.githubusercontent.com/K0vacs/traineroneone/master/static/images/Tablet-form.png)

#### Desktop

- [Program Mockup](https://raw.githubusercontent.com/K0vacs/traineroneone/master/static/images/Desktop-programs.png)
- [Workout Mockup](https://raw.githubusercontent.com/K0vacs/traineroneone/master/static/images/Desktop-workouts.png)
- [Exercise Mockup](https://raw.githubusercontent.com/K0vacs/traineroneone/master/static/images/Mobile-exercises.png)
- [Form Mockup](https://raw.githubusercontent.com/K0vacs/traineroneone/master/static/images/Mobile-form.png)

## Features
 
### Existing Features
- Responsiveness - allows the website to render in a user-friendly format on any device (mobile, tablet and desktop).
- Bar Chart - the dc.js bar chart displays customers created by year which is interactive, click a bar to filter the data by year.
- Pie Chart - the dc.js pie chart displays customers by their activity status, click the piece of the pie chart to filter by active or inactive.
- Table - the dc.js table displays customers in a table, on load by all and then filtered by each bar, pie charts or select menu if filtered. The # table column indicates the customer row number in the table which corresponds to the number used in the Google Map marker.
- Website select - the dc.js select menu allows the user to filter customer data based on whether they have a website or not.
- Google map - the google map geocodes customer address into longitude and latitude using the Google Geocoder API and places the markers on the map. Additionally, the marker colours have been customised to include white marker labels. Note, the geocode service passes an error when too many requests are made in quick succession. Therefore when working with large data sets make sure to batch requests in smaller groups.
- Popover - the popover is used after the map heading, surrounding a Font Awesome information icon that pops up a dialogue box to provide more information about the map when clicked.
- Wave API Query - this feature is executed on page load (body tag) to load the customer data from a GraphQl API using an XMLHTTP Request. This data is then used in all of the page sections through a cross-filter and Google map / Google Geocoder. Note, the authorisation token used for the Wave API is from a testing account, it is not a good idea to use this token in a JavaScript file as it is visible to all visitors, I would recommend using the token within the server-side code. Although the server-side code did not fall within the scope of this project hence my chosen application. 
- Wave API Mutation - this feature creates a new customer in Wave Accounting using an XMLHTTP Request to the Wave API which is managed through GraphQl. The customer information is entered through a modal form which is triggered by the add new button.
- Modal Pop-up - this feature is a standard structural element of Bootstrap. The form within the modal captures the data. Once save is clicked the form data is sent to Wave Accounting through an XMLHTTP Request but first, the query variables are prepared by saving the form data into a JavaScript object in a format that the API can successfully process.
- Loading screen - The loading screen executes on page load and once a successful response is received from the API call the loading screen fades out to hidden thereby displaying the index.html page in full. The loading screen displays at 100% of the page size height and width. With a loading gif to show the user, the application is processing. If the query fails an alert box pops-up which prompts the user to try again.

### Features Left to Implement
- Google map clustering - when map pins are closely grouped the map will group them together to show the total pins in the group. This improves the user-friendliness of the map when working with large sets of pins.
- Table pagination - this will only show a predefined number of customer records per page to streamline the page load time.
- Filtering options on table headers - the table headers can be filterable to order the records according to what the user desires.
- Google map user office location(s) can also be added to display the users' office location in relation to the customers' addresses.
- Google map routes can be used to calculate optimal delivery routes from the users' office location to the customers' address or multiple addresses.
- Additional graphs can be added using dc.js to filter on other customer information captured in Wave.
- As Wave develops further enhancements additional features can be added to the CRM like Invoice and product information.
- Additional optimisation can be made on making the application more streamline while working with large data sets as the current configuration is not likely to fair well with large volumes of data.
- A customer update function can be added to the table of customers loaded on the page so the user can update the customer details from the application.
- Additional customer fields can be made available in the table and modal to view and manage customers on additional information (e.g. shipping addresses).

## Technologies Used

### Languages
-    HTML / HTML5 - To display content on each HTML page and enable the use of more semantic elements used in HTML5.
-    CSS / CSS3 - To style content in each HTML page and enable additional styling features by using CSS3.
-    JavaScript - To make HTML content more dynamic and to enable features that are supported by Bootstrap, jQuery, popper, D3, DC, Crossfilter and Google Maps API.

### Libraries
-    Bootstrap - To speed up the building of the project using the front end framework that has been tied and tested.
-    Font Awesome - To make the project more visually appealing to users through the use of icons.
-    Google Fonts - To make enable custom fonts to be used in the project. Hind Vadodara and Mitr were selected.
-    jQuery - To simplify Dom manipulation and to enable Bootstrap features.
-    D3.js - to add requested data to the Dom to be manipulated by other JS libraries.
-    Dc.js - to render data in various formats such as graphs, tables and other useful formats.
-    Crossfilter - to use within the dc.js dimensions and groups, this makes specific data points easy to manipulate.
-    Google Maps API - to display the Google map and markers on the page.
-    Google Geocoder - to transform customer addresses to longitude and latitude to be used in the Google map.

## Testing
This project was tested using the Google Chrome Inspect tool. Using the aforementioned tool the website was tested using multiple screen sizes. These screen sizes include various mobile, tablet, and desktop sizes using both portrait and landscape views. The Jasmine automated testing tool was considered but proved unnecessary as very few functions return a specific result and are most functions are chained together.

The following checks were done to ensure the website is working as intended:
- All links working and directed correctly
- All styles applied and display correctly
- All icons displayed with the intended styling
- All navigation elements are working as intended
- All popovers are operating as intended
- Bar chart displaying and filtering correctly
- Pie chart displaying and filtering correctly
- Google map loading and markers displaying correctly
- Loading screen displaying and hiding correctly
- Modal form fields are all required with a submit button
- W3C validator HTML errors fixed
- W3C validator CSS errors fixed
- Google Dev Tools Audit run and fixed issues on each page
- JSHint errors and warnings fixed (for all that were necessary)

## Deployment

### Example Deployment
This project has been deployed on GitHub Pages using the following method:
- When in the overview page select the repository you would like to publish
- When in the appropriate repository, using the repository navigation bar select the settings option
- When in the settings screen scroll down to GitHub Pages heading and below the source, sub-heading select the branch you would like to deploy (in this case the master branch was used)
- Enter the name for your project and publish it (Milestone 2 project was used)
- Wait for the website deployment to be finalised by GitHub

> The deployed version is the latest version of the website

### Deploy for yourself

#### Online
To deploy this application on Github Pages, fork the repository and use the same deployment method as stipulated in the example deployment. To deploy this application on your own server do the following:
- In the home screen of the repository, folder select the download button and select zip option.
- Once downloaded unzip the file and upload it to the directory you would like the application to run on, on your server.
- Run the index.html file in the browser to see the application run.
- Once confirming the application is running correctly replace the security tokens to request customer data from your own Wave account.
- Troubleshooting - if the application is not working as expected make sure to check the console for errors and file paths.

#### Local
To deploy this application locally:
- In the home screen of the repository, folder select the download button and select zip option.
- Once downloaded unzip the file
- Then open the index.html file in your browser.
- Once confirming the application is running correctly replace the security tokens to request customer data from your own Wave account.
- Troubleshooting - if the application is not working as expected make sure to check the console for errors and file paths.

#### Online
- All dependencies will work as intended by making use of all the files within the repository.
- When upgrading the dependencies make sure to update the files in the libraries directory and the links within the index.html file.

## Contribute
Developer contributions are welcomed and encouraged.

To contribute just fork the GitHub repository and when ready create a push request with detailed notes of the changes which will be reviewed and added to the project on success.

Feel free to pick up any of the above-mentioned features left to implement.

## Credits

### Content
- The icons used in this project are from [FontAwesome](https://fontawesome.com/).
- Most elements of this website use [Bootstrap](https://getbootstrap.com/) elements.
- [Bootswatch](https://bootswatch.com/) was used to customise the Bootstrap colour palette.
- The fonts were selected from [Google Fonts](https://fonts.google.com/).
- The table and graphs are rendered by a combination of [D3](https://dc-js.github.io/dc.js/), [DC](https://d3js.org/) and [Crossfilter](https://square.github.io/crossfilter/).
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/tutorial) was used to render the map to the index.html page.

### Acknowledgements
- [Responsinator](http://www.responsinator.com/) was used to check mobile and tablet responsiveness.
- [Google Maps Geocoding Service](https://developers.google.com/maps/documentation/javascript/geocoding) was used to transform the customer addresses to longitude and latitude format.
- [Giphy](https://giphy.com/gifs/icon-loading-beaker-11FuEnXyGsXFba) was used to find a loading gif.
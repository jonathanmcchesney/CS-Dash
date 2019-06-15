# CS-Dash

Internet Of Things experimental web application used to simulate edge/automated sensor interaction for the Queen's University Belfast Computer Science Builing. Developed as part of Computer Science Masters.

## Members
* Jonathan McChesney
* Erin Hughes
* Aoife Slevin
* Ieuan McDonnell
* Shane Fearon

## Dashboard

Home page depicted by user access, allowing quick navigation with a sticky navbar. Buttons lead to appropriate pages. Click logo to return to this page no matter where you are on website. Click “Toggle Occupancy” to change occupancy graph type

## FAQ

Access this page in the navbar dropdown (‘FAQ’), questions are displayed based on user access which appear as a collapsed menu, and can be clicked to expand.

## Room Details

Access this page through the “See Room Detail” button located on the Dashboard. Rooms are sorted in a collapsible menu separated by floor, expand by clicking and select button named with room name to display that room’s information.

## Signing In and Registering

Access login page in the navbar dropdown (‘Sign In’). Enter valid email and password, then click ‘Sign In’ button and you’ll be redirected to appropriate dash. Register link is found below the ‘Sign In’ button. Enter valid email and password in appeared modal and clicked ‘Register’. Click ‘Close’ if you’ve changed your mind. 

## Book A Room

Student+ access room bookings through the “Book Available” button located on Dashboard by searching for bookable room names in room card. Click on the time period you wish to book the room for and click again to cancel. 

## Timetable

Student+ access timetable page through the “Timetable” button on the Dashboard.

## Update Password

Student+ access this page in the navbar dropdown (‘Update Password’) Enter your current password and a valid new password, then click “Update Password”. Admin+ can update other users passwords by additionally entering a valid student email and a new password for them, and also update users access to admin by clicking “Make Admin”.

## HVAC

Admin+ access this page through the “Change HVAC Settings” on the Dashboard OR in the navbar dropdown (‘HVAC Control’). Tab navigation at the top allows you to view overall status, temperature, ventilation and lighting. 
* Overall Tab: If status is ‘X’ click “Click to see Errors” to display what rooms and what aspects need to be changed
* Temperature and Ventilation Tab: “Change” button renders modal. Either type number or use slider to select a temperature to change to. Click “Save Changes” to save and “Cancel” if you change your mind. “More Room Details” takes you to room information page.
* Lighting Tab: “Turn On” or “Turn Off” depending on status will turn the lights for that specific room on and off. “More Room Details” takes you to room information page.

## Statistics

Admin+ access statistics page through the “View CSB Statistics” button on the Dashboard. Click “[name] Chart” button of choice to display chart of choice, click “[aspect] Usage” button to display CSB statistics for that aspect. Finally click “Show Date Range” to choose a range of dates from a calendar widget and chart updates automatically.

## Deployment

CS-Dash is deployed to Heroku:

```
https://csc4008-e404.herokuapp.com/
```


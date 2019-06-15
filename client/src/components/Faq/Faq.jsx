import React, {Component} from 'react';

import './Faq.css'
import AdminUpdatePassword from '../../assets/img/FAQGifs/AdminUpdatePassword.gif';
import BookRoom from '../../assets/img/FAQGifs/BookRoom.gif';
import ChangeAnotherUserPassword from '../../assets/img/FAQGifs/ChangeAnotherUserPassword.gif';
import ChangeTemperature from '../../assets/img/FAQGifs/ChangeTemperature.gif';
import MakeAdmin from '../../assets/img/FAQGifs/MakeAdmin.gif';
import Register from '../../assets/img/FAQGifs/Register.gif';
import ReturnToHomepage from '../../assets/img/FAQGifs/ReturnToHomepage.gif';
import SendFeedback from '../../assets/img/FAQGifs/SendFeedback.gif';
import SignOut from '../../assets/img/FAQGifs/SignOut.gif';
import StudentUpdatePassword from '../../assets/img/FAQGifs/StudentUpdatePassword.gif';
import ViewMap from '../../assets/img/FAQGifs/ViewMap.gif';
import ViewRoomDetails from '../../assets/img/FAQGifs/ViewRoomDetails.gif';
import ViewStats from '../../assets/img/FAQGifs/ViewStats.gif';
import ViewStatsDateRange from '../../assets/img/FAQGifs/ViewStatsDateRange.gif';
import ViewTimetable from '../../assets/img/FAQGifs/ViewTimetable.gif';
import ViewWeather from '../../assets/img/FAQGifs/ViewWeather.gif';

class Faq extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pageTitle: 'Frequently Asked Questions',
            questionDetailsHTMLMap: new Map(),
            status: sessionStorage.getItem('status')
        };
        this.initQuestionDetailsMap(this.state.questionDetailsHTMLMap);
    }

    declareList(questionID, question) {
        let target = "#" + questionID;
        return (<li className="list-group-item d-flex justify-content-between align-items-center"
                    type="button" data-toggle="collapse"
                    data-target={target} aria-expanded="true"
                    aria-controls={questionID}
        >{question}
        </li>);
    }

    getFAQs() {
        return this.getQuestionsDetails(this.getQuestionIDs(this.state.status));
    }

    getQuestionIDs(AccessLevel) {
        //The order indicates which FAQs that user access level can view, and in what order they are rendered on the page
        switch (AccessLevel) {
            case 'admin':
                return [2, 3, 4, 5, 6, 7, 8, 20, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
            case 'student':
                return [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            case 'guest':
                return [1, 2, 3, 4];
            default:
                return [];
        }
    }

    getQuestionsDetails(questionIDs) {
        let buffer = [];
        var Length = questionIDs.length;
        for (var i = 0; i < Length; i++) {
            buffer.push({index: [i], questionHTML: [ this.state.questionDetailsHTMLMap.get(questionIDs[i])]});
        }
        return (
            <div className="container flex center">
                {buffer.map(a => a.questionHTML)}
            </div>
        );
    }

    render() {
        return (
            <div className="container">
                <div className="col-md">
                    <div style={{width: '100%', height: '100%'}}>
                        <h1 className="room header1 borderBottom">{this.state.pageTitle}</h1>
                        <br/>
                        <div className="room tab-pane active" id="rooms">
                            <div>
                                {this.getFAQs()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    getFAQTemplate(questionIDIn, questionIn, HTMLIn) {
        return (<ul className="list-group" key = {questionIDIn}>
            {this.declareList(questionIDIn, questionIn)}
            <div className="collapse" id={questionIDIn}>
                <div className="card card-body">
                    <div>
                        <div className="container">
                            {HTMLIn}
                        </div>
                    </div>
                </div>
            </div>
        </ul>);
    }

    initQuestionDetailsMap(questionDetailsHTMLMap) {
        //Initialise Question details here
        /* As questions have no template (each one may be unique to allow for maximum flexibility) they cannot be generated
        from data and must manually be stored in here
        To adjust the order they are viewed in, or the questions which are accessible to a particular user access level,
        see the getQuestionIDs() function. Edit the QuestionIDs in the order you like for a certain User Access Level there.
        To add a new Question, Please use a unique questionID
         */

        //FAQs for Guest only
        questionDetailsHTMLMap.set(1,
            this.getFAQTemplate("question1", "How do I register on the website?",
                <div>
                    <p>To register as a new user, simply navigate to the login page, and click on the "Register/Sign up"
                        hyperlink,
                        you will then be shown a window in which you can register with your QUB email and a password.
                        Then click
                        "Register" to complete.</p>
                    <img className="faq-gif" src={Register} alt="Registering on the website"/>
                </div>
            ));

        //FAQs for all User Levels
        questionDetailsHTMLMap.set(2, this.getFAQTemplate("question2", "How do I view room details?",
            <div><p>To view details of a room,first navigate to the Rooms page via the "View Rooms" button on the
                Homepage (Accessible by clicking the
                "CS Dash" Logo).</p>
                <img className="faq-gif" src={ViewRoomDetails} alt="Viewing Room Details"/>
                <p>From here, you can view a number of details about rooms, simply click on
                    the floor the room is on, and click the room you want to view.</p></div>));

        questionDetailsHTMLMap.set(3, this.getFAQTemplate("question3", "How can I give feedback about the website?",
            <div>
                <p>To give feedback about the site, click on the "Slack Feedback" button which is at the bottom-right of
                    the
                    page,
                    select what your feedback is about, and enter what you wish to tell us about, then click "Send
                    Feedback".</p>
                <img className="faq-gif" src={SendFeedback} alt="Sending feedback"/>
            </div>
        ));

        questionDetailsHTMLMap.set(4, this.getFAQTemplate("question4", "How do I return to the home page?",
            <div>
                <p>To return to the homepage, click on the "CS Dash" logo at the top left of the screen.</p>
                <img className="faq-gif" src={ReturnToHomepage} alt="Returning to Homepage"/>
            </div>));

        //FAQs only for Students and Admins
        questionDetailsHTMLMap.set(5, this.getFAQTemplate("question5", "How do I book a room?", <div
            className="container">
            <p>To book a room, first, make sure you are logged in. Then, navigate to the "Book
                Rooms" page on the Homepage (Accessible by clicking the "CS Dash" Logo).</p>
            <img className="faq-gif" src={BookRoom} alt="Booking a room - Rooms page"/>
            <p>From here, select the time and date you would like to book a room for, and click "Book me!".</p>
        </div>));

        questionDetailsHTMLMap.set(6, this.getFAQTemplate("question6", "How do I view a map of the building?",
            <div>
                <p>To view a map of the building, see the map on the homepage, or, for a more in-depth map, click on the
                    "See Full CSB Map" button just below the homepage map, which will take you to a in which you can see
                    the entire CSB as a map. Simply click on the floor you wish to view.</p>
                <img className="faq-gif" src={ViewMap} alt="Viewing a map of the building"/>
            </div>));

        questionDetailsHTMLMap.set(7, this.getFAQTemplate("question7", "How do I sign out of my account?",
            <div>
                <p>To sign out of your account, click the green drop-down menu at the top right of the screen, then
                    click "Sign Out".</p>
                <img className="faq-gif" src={SignOut} alt="Signing out of account"/>
            </div>));

        questionDetailsHTMLMap.set(8, this.getFAQTemplate("question8", "How do I contact someone for help?",
            <div>
                <p>To contact someone for help, please click the following link, this will redirect you to the team's
                    Github page, where contact details will be available (Opens in a new window):</p>
                <a className="hyperLink"
                   href="https://gitlab.eeecs.qub.ac.uk/40126401/csc4008frontend/raw/76f3ef01616c16c6c1d773337cf381a41b6cb980/README.md"
                   target="_blank">Team's Github</a>
            </div>));

        //This FAQ for Students only
        questionDetailsHTMLMap.set(9, this.getFAQTemplate("question9", "How can I change my password?",
            <div><p>To update your password, click the green drop down menu at the top right of the screen, then click
                "Update Password".</p>
                <img className="faq-gif" src={StudentUpdatePassword} alt="Student - updating password"/>
                <p>Then, enter your current password, your new password, then click "Update Password".</p>
            </div>));

        //This FAQ for Admins only
        questionDetailsHTMLMap.set(20, this.getFAQTemplate("question20", "How can I change my password?",
            <div><p>To update your password, click the green drop down menu at the top right of the screen, then click
                "Update Password".</p>
                <img className="faq-gif" src={AdminUpdatePassword} alt="Admin - updating password"/>
                <p>Then, enter your current password, your admin email, your new password, then click "Update
                    Password".</p>
            </div>));

        questionDetailsHTMLMap.set(10, this.getFAQTemplate("question10", "How do I view my timetable?",
            <div>
                <p>To view your timetable, click on the "Timetable" button on the Homepage. From here, you can see your
                    classes and room bookings for each day of the week.</p>
                <img className="faq-gif" src={ViewTimetable} alt="Viewing timetable"/>
            </div>));

        questionDetailsHTMLMap.set(11, this.getFAQTemplate("question11", "How do I see what the weather is like?",
            <div>
                <p>To see the current weather at the CSB, look for the Weather module on the homepage.</p>
                <img className="faq-gif" src={ViewWeather} alt="Viewing Weather"/>
                <p>Access the homepage by clicking on the "CS Dash" logo at the top left of the screen.</p>
            </div>));

        //FAQs only for Admins
        questionDetailsHTMLMap.set(12, this.getFAQTemplate("question12", "How do I adjust HVAC settings?",
            <div><p>To change HVAC settings, click on the "Change HVAC Settings" button on the homepage.</p>
                <p>Access the homepage by clicking on the "CS Dash" logo at the top left of the screen.</p>
                <p>From here, you will have access to HVAC settings for rooms,
                    such as Temperature Control, Lighting Control, Viewing electricity usage, and Ventilation.</p>
            </div>));

        questionDetailsHTMLMap.set(13, this.getFAQTemplate("question13", "How do I adjust the temperature of a room?",
            <div><p>To change the temperature of a room, click on the "Change HVAC Settings" button on the homepage
                (Access the homepage by clicking on the "CS Dash" logo at the top left of the screen).</p>
                <p>Or alternatively, click on the green drop down menu at the top right of the screen and click "HVAC
                    Control".</p>
                <p>From here, navigate to the "Temperature Control" Tab, click "Change" next to room which you wish to
                    change the temperature of.</p>
                <img className="faq-gif" src={ChangeTemperature} alt="Changing Temperature"/>
                <p>Now, select the new temperature you would like the room to be, and click "Save Changes".</p>
            </div>));

        questionDetailsHTMLMap.set(14, this.getFAQTemplate("question14", "How do I adjust the lighting of a room?",
            <div>
                <p>To adjust the lighting of a room, click on the "Change HVAC Settings" button on the homepage
                    (Access the homepage by clicking on the "CS Dash" logo at the top left of the screen).</p>
                <p>Or alternatively, click on the green drop down menu at the top right of the screen and click "HVAC
                    Control".</p>
                <p>From here, navigate to the "Lighting Control" Tab.</p>
            </div>));

        questionDetailsHTMLMap.set(15, this.getFAQTemplate("question15", "How do I view my electricity usage?",
            <div>
                <p>To view the electricity usage of a room, click on the "Change HVAC Settings" button on the homepage
                    (Access the homepage by clicking on the "CS Dash" logo at the top left of the screen).</p>
                <p>Or alternatively, click on the green drop down menu at the top right of the screen and click "HVAC
                    Control".</p>
                <p>From here, navigate to the "Electricity Monitor" Tab.</p>
            </div>));

        questionDetailsHTMLMap.set(16, this.getFAQTemplate("question16", "How can I view statistics about the building?",
            <div>
                <p>To view statistics about the building's Electricity usage, Carbon usage, Upkeep Costs, and Occcupancy
                    over a period of time, click on the "View CSB Statistics" button on the homepage (Access the
                    homepage by clicking on the "CS Dash" logo at the top left of the screen).</p>
                <img className="faq-gif" src={ViewStats} alt="Viewing Statistics"/>
            </div>));

        questionDetailsHTMLMap.set(17, this.getFAQTemplate("question17", "How can I view statistics about the building for a particular time period?",
            <div>
                <p>To change the Date Range that you view statistics about the building, first click on the "View CSB
                    Statistics" button on the homepage.</p>
                <img className="faq-gif" src={ViewStatsDateRange} alt="Viewing Statistics - date range"/>
                <p>From here, click the "Show Date Range" button, select the start and end date you would like to
                    view </p>
            </div>));

        questionDetailsHTMLMap.set(18, this.getFAQTemplate("question18", "How can I make a new Admin user?",
            <div>
                <p>To make a current user an admin user, click on the drop down menu on the top right of the screen, and
                    select "Update Password".</p>
                <img className="faq-gif" src={MakeAdmin} alt="Making an Admin"/>
                <p>From here, enter your password, enter the email of the user you wish to make an admin, and click on
                    "Make Admin".</p>
            </div>));

        questionDetailsHTMLMap.set(19, this.getFAQTemplate("question19", "How can I update another user's password?",
            <div>
                <p>To update another user's password, click on the drop down menu on the top right of the screen, and
                    select "Update Password".</p>
                <img className="faq-gif" src={ChangeAnotherUserPassword} alt="Updating another user's password"/>
                <p>From here, enter your password, enter the email of the user you wish to update the password of, enter
                    a new password for that user, and click on "Update Password".</p>
            </div>));

    }
}

export default Faq;
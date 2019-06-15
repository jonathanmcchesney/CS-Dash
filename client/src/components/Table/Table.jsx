import React, { Component } from 'react';
import './Table.css';
import $ from 'jquery';
import Classes from '../../controllers/Classes';
import Bookings from '../../controllers/Bookings';
import helperUtils from '../../utils/HelperUtils';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            timeslots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
            weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            todayIndex: 0,
            data: null,
            bookingNumber: 0
        }
    }

    componentWillMount() {
        if(this.props.user === 'guest')
            document.location.href='/login';
    }

    componentDidMount() {
        this.getTodayIndex();
        this.getTableData();

        // tooltip stuff
        $('[data-toggle="tooltip"]').tooltip();
    }

    componentDidUpdate() {
        // tooltip stuff
        $('[data-toggle="tooltip"]').tooltip();
    }

    getTodayIndex() {
        let day = new Date().getDay() - 1;
        this.setState({
            todayIndex: day
        });
    }

    getTableData() {
        if(this.props.type === 'timetable') {
            let timetable;
            Classes.getYear4Timetable()
            .then(result => {
                timetable = result.timetable;
            })
            .then(() => {
                Bookings.getBookings().then(result => {
                    result.bookings.map(booking => {
                        if (booking.booked_by === sessionStorage.email) {
                            timetable.push(booking);
                        }
                    });
                    this.setState({
                        data: timetable
                    });
                });
            });
        } else {
            Bookings.getBookings().then(result => {
                let num = 0;
                result.bookings.map(booking => {
                    if (sessionStorage.email === booking.booked_by) {
                        num++;
                    }
                });
                this.setState({
                    data: result.bookings,
                    bookingNumber: num
                });
            });
        }
    }

    makeBooking(day, time, user) {
        if (this.state.bookingNumber < 2) {
            let req = {
                day: day,
                time: time,
                booked_by: user
            }
            Bookings.makeBooking(req).then(result => {
                this.getTableData();
            });
        }
    }

    cancelBooking(day, time) {
        let req = {
            day: day,
            time: time
        }
        Bookings.cancelBooking(req).then(result => {
            this.getTableData();
        });
    }

    removePastBookings(booking) {
        if (sessionStorage.email === booking.booked_by) {
            if (booking.day !== this.state.weekdays[this.state.todayIndex] && booking.day !== this.state.weekdays[this.state.todayIndex + 1]) {
                this.cancelBooking(booking.day, booking.time);
            }
        }
    }

    getCellStyles(cellData) {
        let styles = 'cell-layout';
        if (cellData.module_code === 'CSC4005') {
            styles = (cellData.session_type === 'Lecture') ? 'cell-layout cell-lightblue' : 'cell-layout cell-blue';
        } else if (cellData.module_code === 'CSC4006') {
            styles += ' cell-yellow';
        } else {
            styles += ' cell-purple';
        }
        return styles;
    }

    getBookable(today) {
        let tomorrowIndex = (this.state.todayIndex + 1 < this.state.weekdays.length) ? this.state.todayIndex + 1 : 0;
        if (today === this.state.weekdays[this.state.todayIndex] || today === this.state.weekdays[tomorrowIndex]) {
            return true;
        } else {
            return false;
        }
    }

    fillCell(cellData, extraData, isBookable) {
        if (this.props.type === 'timetable') {
            return this.fillTimetableCell(cellData, extraData);
        } else {
            return this.fillBookingCell(cellData, isBookable);
        }
    }


    fillTimetableCell(cellData, extraData) {
        let cellJSX;
        let tooltipTitle = cellData.title + "<br/>" + cellData.lecturer;
        let styles = this.getCellStyles(cellData);

        // remove any past bookings that can't be manually cancelled
        if(extraData) {
            this.removePastBookings(extraData);
        }

        if (cellData.module_code !== undefined && extraData === undefined) {
            cellJSX = (
                <td className={styles} data-toggle="tooltip" data-placement="top" data-html="true" title={tooltipTitle}>
                    <p className="cell-span">{cellData.module_code}</p>
                    <p className="cell-span">{cellData.session_type}</p>
                    <p className="cell-span">{cellData.location}</p>
                </td>
            );
        } else if (cellData.module_code !== undefined && extraData) {
            cellJSX = (
                <td className={styles} data-toggle="tooltip" data-placement="top" data-html="true" title={tooltipTitle}>
                    <p className="cell-data-toggle"></p>
                    <div className="booking-bg">
                        <p className="cell-span booking-text booking-text-first">Room booking</p>
                        <p className="cell-span booking-text">Project Room 03-037</p>
                    </div>
                    <p className="cell-span class-text">{cellData.module_code}</p>
                    <p className="cell-span class-text">{cellData.session_type}</p>
                    <p className="cell-span class-text">{cellData.location}</p>
                </td>
            );
        } else if (cellData.module_code === undefined && extraData) {
            cellJSX = (
                <td className="cell-layout booked-cell my-booked-cell">
                    <p className="cell-span">Room booking</p>
                    <p className="cell-span">Project Room 03-037</p>
                </td>
            );
        } else {
            cellJSX = (<td></td>);
        }

        return cellJSX;
    }

    fillBookingCell(cellData, isBookable) {
        let cellJSX;

        // remove any past bookings that can't be manually cancelled
        this.removePastBookings(cellData);

        if (isBookable === false) {
            cellJSX = (
                <td className="empty-cell table-dark unbookable">
                    <div className="cell-layout button-container"/>
                </td>
            );
        } else if (cellData.booked_by !== undefined) {
            cellJSX = (sessionStorage.email === cellData.booked_by) ?
                <td className="cell-layout my-booked-cell">
                    <p className="cell-span my-booked-span">Booked by you!</p>
                    <div className="cell-layout cancel-button-container">
                        <button className="btn btn-outline-danger button" onClick={() => this.cancelBooking(cellData.day, cellData.time)}>Cancel</button>
                    </div>
                </td>
                :
                <td className="cell-layout booked-cell">
                    <p className="cell-span">Booked by:</p>
                    <p className="cell-span">{cellData.booked_by}</p>
                </td>
        } else if (this.state.bookingNumber < 2) {
            cellJSX = (
                <td className="empty-cell">
                    <div className="cell-layout button-container">
                        <button className="btn btn-outline-danger button" onClick={() => this.makeBooking(cellData.day, cellData.time, sessionStorage.email)}>Book me!</button>
                    </div>
                </td>
            );
        } else {
            cellJSX = (
                <td className="empty-cell">
                    <div className="cell-layout button-container"/>
                </td>
            );
        }

        return cellJSX;
    }

    generateCells(timeslot) {
        let timeslotCell = (<td className="table-dark time-cell">{timeslot}</td>);
        let cells = [timeslotCell];
        this.state.weekdays.map((day) => {
            let isBookable = this.getBookable(day);
            let cellData = this.state.data.find(x => (x.day === day && x.time === timeslot));
            if (cellData === undefined) {
                cellData = {
                    day: day,
                    time: timeslot
                }
            }
            let extraData = this.state.data.find(x => (x.day === cellData.day && x.time === cellData.time && x.booked_by === sessionStorage.email));
            if (day !== 'Saturday' && day !== 'Sunday')
                cells.push(this.fillCell(cellData, extraData, isBookable));
        });
        return cells;
    }

    generateHeaderRow(headers) {
        let headerCells = [<th></th>];
        headers.map(day => {
            if (day !== 'Saturday' && day !== 'Sunday')
                headerCells.push(<th>{day}</th>);
        });
        return headerCells;
    }

    generateRows() {
        let rows = [];
        this.state.timeslots.map(time => {
            rows.push(<tr>{this.generateCells(time)}</tr>);
        });
        return rows;
    }

    render() {
        let title = this.props.type === 'timetable' ?
            (<p>Now showing {helperUtils.toUpperCase(this.props.user)}'s timetable. Hover over your classes for more information!</p>) :
            (<p>Now showing the bookings for Project Room 03-037. You have <strong>{2 - this.state.bookingNumber}</strong> bookings slot(s) remaining.</p>);

        if(this.props.user !== 'guest' && this.state.data) {
            return (
                <div className="table-container">
                    {title}
                    <table className="table table-striped my-table">
                        <thead className="thead-dark">
                            <tr>{this.generateHeaderRow(this.state.weekdays)}</tr>
                        </thead>
                        <tbody>
                            {this.generateRows()}
                        </tbody>
                    </table>
                </div>

            );
        } else {
            return (<LoadingSpinner/>);
        }
    }

}

export default Table
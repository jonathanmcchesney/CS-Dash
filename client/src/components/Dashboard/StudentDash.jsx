import React, { Component } from 'react';
import groundMap from "../../assets/img/groundMap.png";
import firstMap from "../../assets/img/firstMap.png";
import secondMap from "../../assets/img/secondMap.png";
import thirdMap from "../../assets/img/thirdMap.png";
import timetable from "../../assets/img/timetableStudent.png";
import Weather from "../Weather/Weather";
import Statistics from "../../controllers/Statistics";
import Rooms from "../../controllers/Room";
import {extendMoment} from "moment-range";
import originalMoment from "moment";
import {Chart} from "react-google-charts";
import Gauge from "react-svg-gauge";
import "./List.css"
import  "./StudentDash.css"
import bgImage from '../../assets/img/csb.jpg';

const moment = extendMoment(originalMoment);

class StudentDash extends Component {

    constructor(props) {
        super(props);
        const today = moment();
        this.state = {
            title: this.props.title,
            contents: this.props.contents,
            dates: moment.range(today.clone().subtract(0, "days"), today.clone()),
            occupancy: null,
            startDate: "",
            endDate: "",
            user: "",
            occupancyType: 0,
            rooms: [],
            filterRooms: [],
            currentPage: 1,
            itemsPerPage: 3,
            mapLocation: 0
        }
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        document.title = this.state.title;
        let username = sessionStorage.getItem('user')
        username = username.charAt(0).toUpperCase() + username.slice(1)
        this.setState({
                startDate: this.state.dates.start.format("YYYY-MM-DD"),
                endDate: this.state.dates.end.format("YYYY-MM-DD"),
                user: username
            }
        );
        this.getStats();

        Rooms.getRooms().then(result => {
            this.setState({
                rooms: result.rooms,
                filterRooms: result.rooms
            });
        });
    }

    getStats() {

        let startDate;
        let endDate;
        startDate = this.state.dates.start.format("YYYY-MM-DD")
        endDate = this.state.dates.end.format("YYYY-MM-DD")
        let req = {
            startDate: startDate,
            endDate: endDate
        }
        Statistics.getStatsBetweenDates(req).then(result => {
            if (result.message == 'statistics retrieved successfully!') {
                this.setState({occupancy: result.stats.occupancy})
                this.getAllStats(result.stats);
            } else {
                this.getAllStats("err");

            }
        }).catch(error => {
            this.getAllStats("err");
        })
    }

    renderOccupancy() {
        return this.state.occupancyType == 0 ? this.renderGauge() : this.renderPieChart()
    }

    renderGauge() {
        let colour = this.state.occupancy >= 80 ? '#dc3545' : '#28a745'
        return (
            <div className="text-center">
                <Gauge value={this.state.occupancy} color={colour} width={500} height={320} label=""/>
            </div>
        )
    }

    renderPieChart() {
        let occupied = this.state.occupancy;
        let overOccupied;
        occupied > 100 ? overOccupied = 100 : overOccupied = occupied;
        let notOccupied = 100 - overOccupied;
        return (
            <div className="text-center offset-sm-2 pie-chart-container">
                <Chart
                    width={'660px'}
                    height={'320px'}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                        ['CSB Occupancy', '% Occupied'],
                        ['Occupied', occupied],
                        ['Not Occupied', notOccupied],
                    ]}
                    options={{
                        title: `CSB Occupancy %`,
                        is3D: true,
                        animation: {
                            duration: 1000,
                            easing: 'out',
                            startup: true,
                        },
                        slices: {
                            0: {color: '#dc3545'},
                            1: {color: '#28a745'},
                        },
                    }}
                    rootProps={{'data-testid': '2'}}
                />
            </div>

        )
    }

    getAllStats(e) {
        let date = [];
        if (e != "err") {
            this.setState({date: date, occupancy: e[0].occupancy})
        } else {
            this.setState({date: [], occupancy: []})
        }
    }

    toggleOccupancyType() {
        this.setState({occupancyType: this.state.occupancyType == 1 ? 0 : 1})
    }

    handleClick(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    searchFunction() {
        let input, filter, ul, li, a, i;
        const listDisplay = [];
        input = document.getElementById("roomSearch");
        filter = input.value.toUpperCase();
        ul = document.getElementById("list");
        li = ul.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("p")[0];
            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
                listDisplay.push(li[i]);
            }
        }
        this.setState({filterRooms: listDisplay})
        if (input.value === "") {
            this.setState({filterRooms: this.state.rooms});
        }
    }

    renderSearch() {
        return(
            <span>
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
                      integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
                      crossOrigin="anonymous"/>
                <span className="fas fa-search" style={{float: 'right', marginTop: 3, marginLeft: 4}}/>
                <input type="text" id="roomSearch" onKeyUp={this.searchFunction.bind(this)} placeholder="Search.."
                       style={{float: 'right'}}/>
            </span>
        );
    }

    roomList() {
        let { filterRooms, currentPage, itemsPerPage } = this.state;

        let lastIndex = currentPage * itemsPerPage;
        let firstIndex = lastIndex - itemsPerPage;
        let currentList = filterRooms.slice(firstIndex, lastIndex);

        const renderList = currentList.map((filterRooms, index) => {
            return (
                <li className="list-group-item py-sm-0" key={index}>
                    <p>{filterRooms.innerText || filterRooms.room_name}</p>
                    {
                        (filterRooms.innerText === "Project Room - 037" || filterRooms.room_name === "Project Room - 037")?
                        <a href={"/booking"} className="btn btn-success text-center" style={{float:'right'}}>Booking Available!</a>
                        : <p></p>
                    }
                </li>
            );
        });

        let pageNumbers = [];
        for (let i = 1; i <= Math.ceil(filterRooms.length / itemsPerPage); i++) {
                    pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li className="paginationStyle py-0" key={number} id={number} onClick={this.handleClick}>
                    {number}
                </li>
            );
        });

        return (
            <div style={{minHeight: "202px"}}>
                <ul className="pagination justify-content-center">{renderPageNumbers}</ul>
                <div>
                    <ul className="student-list" style={{height: 140}}>{renderList}</ul>
                </div>
            </div>
        )
    }

    downFloor(){
        if(!(this.state.mapLocation === 0)){
            this.setState({mapLocation: this.state.mapLocation-1})
        }
    }

    upFloor(){
        if(!(this.state.mapLocation === 3)){
            this.setState({mapLocation: this.state.mapLocation+1})
        }
    }

    renderMap(){
        if(this.state.mapLocation === 0){
            return (
                <div className="card-body">
                    <h5 className="card-title text-center"><strong>CSB Map Ground Floor:</strong></h5>
                    <img className="card-img-top" src={groundMap} alt="Card image cap" />
                </div>
            )
        } else if (this.state.mapLocation === 1){
            return (
                <div className="card-body">
                    <h5 className="card-title text-center"><strong>CSB Map First Floor:</strong></h5>
                    <img className="card-img-top" src={firstMap} alt="Card image cap" />
                </div>
            )
        } else if (this.state.mapLocation === 2){
            return (
                <div className="card-body">
                    <h5 className="card-title text-center"><strong>CSB Map Second Floor:</strong></h5>
                    <img className="card-img-top" src={secondMap} alt="Card image cap" />
                </div>
            )
        } else if (this.state.mapLocation === 3){
            return (
                <div className="card-body">
                    <h5 className="card-title text-center"><strong>CSB Map Third Floor:</strong></h5>
                    <img className="card-img-top" src={thirdMap} alt="Card image cap" />
                </div>
            )
        }

    }

    render() {
        let originalList = [];
        this.state.rooms.map(room => {
            originalList.push(<li><p>{room.room_name}</p></li>);
        });
        return (
            <div className="container-fluid" style={{height: "100px"}}>
                <img src={bgImage} className="bg-image"/>
                <div className="card-group" >
                    <div className="card border rounded col-sm-6 text-center" style={{padding: "5px", margin: '10px'}}>
                        <div className=" card-body">
                            <h5 className="card-title"><strong>{this.state.user}'s Weekly Timetable:</strong></h5>
                            <img className="card-img-top" src={timetable} alt="Card image cap" />
                        </div>
                        <div className="card-footer">
                            <div className="text-center">
                                <a href={"/timetable"} className="btn btn-danger text-center">See Your Timetable</a>
                            </div>
                        </div>
                    </div>
                    <div className="card border rounded col-sm-6 " style={{padding: "5px", margin: '10px'}}>
                        <div className="card-body occupancy-container">
                            <h5 className="card-title text-center"><strong>CSB Occupancy % ({this.state.startDate}):</strong></h5>
                            <div className="text-center">
                                {this.renderOccupancy()}
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="text-center">
                                <input className="btn btn-danger text-center" type="button" onClick={this.toggleOccupancyType.bind(this)} value="Toggle Occupancy View" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-group">
                    <div className="card border rounded col-sm-4 h-50" style={{padding: "5px", margin: '10px'}}>
                        <div className="card-body maps-container">
                            {this.renderMap()}
                        </div>
                        <div className="card-footer">
                            <div className="text-center">
                                <strong>Down</strong>
                                <button type="button" className="btn btn-outline-success" style={{margin: 10}} onClick={this.downFloor.bind(this)}>
                                    <i className="fa fa-chevron-down" aria-hidden="true"></i>
                                </button>
                                <a href={"/map"} className="btn btn-danger text-center">See Full CSB Map</a>
                                <button type="button" className="btn btn-outline-success" style={{margin: 10}} onClick={this.upFloor.bind(this)}>
                                    <i className="fa fa-chevron-up" aria-hidden="true"></i>
                                </button>
                                <strong> Up</strong>
                            </div>
                        </div>
                    </div>
                        <div className="card border rounded col-sm-5" style={{padding: "5px", margin: '10px'}}>
                            <div className="card-body">
                                <h5 className="card-title text-center"><strong>Available Rooms:</strong>
                                    {this.renderSearch()}</h5>
                                <div>
                                    <ul id="list" style={{display:"none"}}>{originalList}</ul>
                                    {this.roomList()}
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="text-center">
                                    <a href={"/room"} className="btn btn-danger text-center" style={{marginLeft: "5px"}}>See Room Details</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <Weather width='100px'/>
                        </div>
                </div>
            </div>
        )
    }
}

export default StudentDash;
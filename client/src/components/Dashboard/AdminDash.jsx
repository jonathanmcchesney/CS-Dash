import React, { Component } from 'react';
import Weather from "../Weather/Weather";
import Statistics from "../../controllers/Statistics";
import {extendMoment} from "moment-range";
import originalMoment from "moment";
import {Chart} from "react-google-charts";
import Gauge from "react-svg-gauge";
import Carousel from "../Stats/Carousel";
import HVACStatus from "../HVAC/HVACStatus";
import Rooms from '../../controllers/Room';
import './AdminDash.css'
import bgImage from '../../assets/img/csb.jpg';
const moment = extendMoment(originalMoment);

class AdminDash extends Component {

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
            occupancyType: 0
        }
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
        this.getRooms();
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
                this.setState({occupancy:result.stats.occupancy});
                this.getAllStats(result.stats);
            } else {
                this.getAllStats("err");

            }
        }).catch(error => {
            this.getAllStats("err");
        })
    }

    getRooms() {
        Rooms.getRooms().then(result => {
            this.setState({
                rooms : result.rooms
            });
        });
    }

    renderOccupancy() {
        return this.state.occupancyType == 0 ? this.renderGauge(): this.renderPieChart()
    }

    renderGauge() {
        let colour = this.state.occupancy >=80 ? '#dc3545': '#28a745'
        return (
            <div className="text-center gauge-container">
                <Gauge value={this.state.occupancy} color={colour} width={500} height={320} label="" />
            </div>
        )
    }

    renderPieChart() {
        let occupied = this.state.occupancy;
        let overOccupied;
        occupied > 100 ? overOccupied = 100: overOccupied = occupied;
        let notOccupied = 100 - overOccupied;
        return(
            <div className="pie-chart-container">
                <Chart
                    width={'660px'}
                    height={'320px'}
                    chartType="PieChart"
                    loader={<div>Loading Occupancy Pie Chart</div>}
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
                            0: { color: '#dc3545' },
                            1: { color: '#28a745' },
                        },
                    }}
                    rootProps={{ 'data-testid': '2' }}
                />
            </div>

        )
    }

    getAllStats(e){
        let date = [];
        if (e != "err") {
            this.setState({date:date, occupancy: e[0].occupancy})
        } else {
            this.setState({date:[], occupancy:[]})
        }
    }

    toggleOccupancyType() {
        this.setState({occupancyType: this.state.occupancyType == 1 ? 0 : 1})
    }

    render() {
        return (
            <div className="container-fluid" style={{height: "100px"}}>
                <img src={bgImage} className="bg-image"/>
                <div className="card-group" >
                    <div className="card border rounded col-sm-7 text-center" style={{padding: "5px", margin: '10px'}}>
                        <div className=" card-body">
                            <h5 className="card-title"><strong>CSB Statistics:</strong></h5>
                            <Carousel/>
                        </div>
                        <div className="card-footer">
                            <div className="text-center">
                                <a href={"/stats"} className="btn btn-danger text-center">View CSB Statistics</a>
                            </div>
                        </div>
                    </div>
                    <div className="card border rounded col-sm-5" style={{padding: "5px", margin: '10px'}}>
                        <div className="card-body">
                            <h5 className="card-title text-center"><strong>CSB Occupancy % ({this.state.startDate}):</strong></h5>
                            <div className="text-center offset-sm-1">
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
                    <div className="card border rounded col-sm-6" style={{padding: "5px", margin: '10px'}}>
                        <div className="card-body">
                            <h5 className="card-title text-center"><strong>CSB HVAC:</strong></h5>
                            {this.state.rooms ? <HVACStatus rooms={this.state.rooms} style="hvac-status"/> : <span/>}
                        </div>
                        <div className="card-footer">
                            <div className="text-center">
                                <a href={"/HVAC"} className="btn btn-danger text-center">Change HVAC Settings</a>
                            </div>
                        </div>
                    </div>
                    <div className="card border rounded col-sm-3" style={{padding: "5px", margin: '10px'}}>
                        <div className="card-body">
                            <h5 className="card-title text-center"><strong>Extra Screens:</strong></h5>
                            <div className="btn-group-vertical text-center">
                                <div className="row center offset-sm-2">
                                <a href={"/map"} className="btn btn-danger col-sm-9 text-center center-block" style={{margin: "4px"}}>CSB Map</a>
                                <a href={"/room"} className="btn btn-danger col-sm-9 text-center center-block" style={{margin: "4px"}}>Room Info</a>
                                <a href={"/booking"} className="btn btn-danger col-sm-9 text-center" style={{margin: "4px"}}>Room Bookings</a>
                                <a href={"/timetable"} className="btn btn-danger col-sm-9 text-center" style={{margin: "4px"}}>Timetable</a>
                                <a href={"/faq"} className="btn btn-success col-sm-9 text-center" style={{margin: "4px"}}>FAQ</a>
                                <a href={"https://gitlab.eeecs.qub.ac.uk/40126401/csc4008frontend"} className="btn btn-success col-sm-9 text-center" style={{margin: "4px"}}>Help</a>
                                </div>
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

export default AdminDash;
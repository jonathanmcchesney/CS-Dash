import React, { Component } from 'react';
import Statistics from "../../controllers/Statistics";
import { Chart } from "react-google-charts";
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import originalMoment from "moment";
import { extendMoment } from "moment-range";
import ErrorPage from "../Error/ErrorPage";
import timetable from "../../assets/img/timetableStudent.png";
const moment = extendMoment(originalMoment);

class Stats extends Component {

    constructor(props) {
        super(props);
        const today = moment();
        this.state = {
            title: this.props.title,
            contents: this.props.contents,
            startDate: "",
            endDate: "",
            stats: {},
            dataType: '',
            chartType: '',
            carbon: [],
            elec: [],
            upkeep: [],
            occupancy: [],
            date: [],
            isShown: false,
            dates: moment.range(today.clone().subtract(7, "days"), today.clone()),
            firstRender: true
        }
    }

    onSelect = (dates, states) => {
        this.setState({ dates, states });
        this.setState({startDate: dates.start.format("YYYY-MM-DD"), endDate: dates.end.format("YYYY-MM-DD")})
        this.getStats()
    };

    onToggle = () => {
        this.setState({ isShown: !this.state.isShown });
    };

    renderSelectionValue = () => {
        let start = this.state.startDate;
        let end = this.state.endDate;
        return (
            <div>
                <h5><strong>{start}</strong> to <strong>{end}</strong></h5>
            </div>
        );
    };

    componentDidMount() {
        document.title = this.state.title;
        if (sessionStorage.getItem('status')=="admin") {
            this.setState({
                    dataType: "Electricity Usage", chartType: "Column Chart",
                    startDate: this.state.dates.start.format("YYYY-MM-DD"),
                    endDate: this.state.dates.end.format("YYYY-MM-DD")
                }
            );
            this.getStats();
        }
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
            if (result.message == 'statistics retrieved successfully!'){
                this.setState({stats:result.stats})
                this.getAllStats(result.stats);
            } else {
                this.getAllStats("err");

            }
        }).catch(error => {
            this.getAllStats("err");
        })
    }

    getAllStats(e){
        let date = [];
        if (e != "err") {
            let carbon = [];
            let elec = [];
            let upkeep = [];
            let occupancy = [];
            for (let x = 0; x < e.length;x++) {
                date.push(e[x].date.substr(0,10));
                carbon.push(e[x].carbon_usage);
                elec.push(e[x].elec_usage);
                upkeep.push(e[x].upkeep_cost);
                occupancy.push(e[x].occupancy);
            }
            this.setState({date:date, carbon: carbon, elec: elec, upkeep: upkeep, occupancy: occupancy})
        } else {
            this.setState({carbon: [], elec: [], upkeep: [], date:[], occupancy:[]})
        }

    }

    getData() {
        let colours = ["green", "red", "grey"];
        let dates = this.state.date;
        let alertRange;
        let values;
        let data = [];

        switch(this.state.dataType){
            case "Electricity Usage":
                alertRange = 100;
                values = this.state.elec;
                data = [["Element", "Electricity Usage", { role: "style" }]]
                break;
            case "Carbon Usage":
                alertRange = 50;
                values = this.state.carbon;
                data = [["Element", "Carbon Usage", { role: "style" }]]
                break;
            case "Upkeep Costs":
                alertRange = 250;
                values = this.state.upkeep;
                data = [["Element", "Upkeep Costs", { role: "style" }]]
                break;
            case "Occupancy":
                alertRange = 80;
                values = this.state.occupancy;
                data = [["Element", "Occupancy", { role: "style" }]]
                break;
        }

        if (this.state.date.length == 0) {
            data.push(["",0,colours[2]])
        } else {
            for (let x = 0; x < this.state.date.length; x++) {
                data.push([dates[x], values[x], values[x] < alertRange ? colours[0] : colours[1]])
            }
        }
        return data;
    }

    renderColumnChart(data, options) {
        return (
            <div className="App">
                <Chart
                    chartType="ColumnChart"
                    width="100%"
                    height="400px"
                    data={data}
                    options={options}
                />
            </div>
        )
    }

    renderLineGraph(data, options) {
        return(
            <Chart
                height={'400px'}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={data}
                rootProps={{ 'data-testid': '1' }}
                options={options}
            />
            )
    }

    renderPieChart(data, options) {
        return(
            <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={data}
                options={{
                    title: options.title,
                    is3D: true,
                }}
                rootProps={{ 'data-testid': '2' }}
            />
        )
    }

    renderComboChart() {
        let dataRow = [];
        let dataCol = [[
            'Date',
            'Electricity Usage',
            'Carbon Usage',
            'Upkeep Costs',
            'Occupancy %',
        ]];
        for(let x = 0; x < this.state.stats.length; x++){
                dataRow.push(this.state.stats[x].date.substr(0,10))
                dataRow.push(this.state.stats[x].elec_usage)
                dataRow.push(this.state.stats[x].carbon_usage)
                dataRow.push(this.state.stats[x].upkeep_cost)
                dataRow.push(this.state.stats[x].occupancy)
                dataCol.push(dataRow)
                dataRow = []
        }
        return (
            <Chart
                height={'400px'}
                chartType="ComboChart"
                loader={<div>Loading Chart</div>}
                data={dataCol}
                options={{
                    hAxis: {
                        title: 'Date',
                    },
                    vAxis: {
                        title: 'Values',
                    },
                    animation: {
                        duration: 1000,
                        easing: 'out',
                        startup: true,
                    },
                    seriesType: 'bars',
                    series: { 4: { type: 'line' } },
                }}
                rootProps={{ 'data-testid': '1' }}
            />
            )
    }

    updateDataType(e) {
        e.persist()
        this.setState({dataType: e.target.outerText})
    }

    updateChartType(e) {
        e.persist()
        this.setState({chartType: e.target.outerText})
    }

    renderGraphType(data, options) {
        switch(this.state.chartType){
            case "Column Chart":
                return this.renderColumnChart(data, options)
                break;
            case "Line Graph":
                return this.renderLineGraph(data, options)
                break;
            case "Combo Chart":
                return this.renderComboChart()
                break;
        }
    }

    render() {
        if (sessionStorage.getItem('status')=="admin") {
            let options = {
                hAxis: {
                    title: 'Date',
                },
                vAxis: {
                    title: this.state.dataType,
                },
                animation: {
                    duration: 1000,
                    easing: 'out',
                    startup: true,
                }
            }
            let data = this.getData()
            return (
                <div>
                    <div className="card border rounded text-center" style={{padding: "5px", margin: '10px'}}>
                        <div className=" card-body">
                            <div className="text-center">
                                <div className="btn-group text-center" role="group" aria-label="Chart Type">
                                    <button type="button" className="btn btn-success"
                                            onClick={this.updateChartType.bind(this)}>Column Chart
                                    </button>
                                    <button type="button" className="btn btn-success"
                                            onClick={this.updateChartType.bind(this)}>Line Graph
                                    </button>
                                    <button type="button" className="btn btn-success"
                                            onClick={this.updateChartType.bind(this)}>Combo Chart
                                    </button>
                                </div>
                            </div>
                            <br/>
                            <div className="text-center">
                                <div className="btn-group text-center" role="group" aria-label="Chart Type">
                                    <button type="button" className="btn btn-danger"
                                            onClick={this.updateDataType.bind(this)}>Electricity Usage
                                    </button>
                                    <button type="button" className="btn btn-danger"
                                            onClick={this.updateDataType.bind(this)}>Carbon Usage
                                    </button>
                                    <button type="button" className="btn btn-danger"
                                            onClick={this.updateDataType.bind(this)}>Upkeep Costs
                                    </button>
                                    <button type="button" className="btn btn-danger"
                                            onClick={this.updateDataType.bind(this)}>Occupancy
                                    </button>
                                </div>
                            </div>
                            <div className="align-center text-center">
                                {this.renderGraphType(data, options)}
                            </div>
                        </div>
                    </div>

                    <div className={"text-center"}>
                        <div>{this.renderSelectionValue()}</div>
                        <div>
                            <button type="button" className="btn btn-danger" onClick={this.onToggle}>Show Date Range
                            </button>
                        </div>
                        {this.state.isShown && (
                            <DateRangePicker
                                value={this.state.dates}
                                onSelect={this.onSelect}
                                singleDateRange={true}
                            />
                        )}
                    </div>
                </div>
            )
        }
        let username = sessionStorage.getItem('user')
            username = username.charAt(0).toUpperCase() + username.slice(1)
        return (
            <ErrorPage errorCode="ERROR 403: " contents = {username}/>
        )
    }
}

export default Stats;
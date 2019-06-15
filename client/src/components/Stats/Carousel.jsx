import React, { Component } from 'react';
import logo from "../../assets/img/groundMap.png";
import { Chart } from "react-google-charts";
import "react-daterange-picker/dist/css/react-calendar.css";
import originalMoment from "moment";
import { extendMoment } from "moment-range";
import Statistics from "../../controllers/Statistics";
import './Carousel.css'
const moment = extendMoment(originalMoment);
class Carousel extends Component {

    constructor(props) {
        super(props);
        const today = moment();
        this.state = {
            title: this.props.title,
            contents: this.props.contents,
            startDate: today.clone().subtract(7, "days").format("YYYY-MM-DD"),
            endDate: today.clone().format("YYYY-MM-DD"),
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


    componentWillMount() {
        document.title = this.state.title;
        this.setState({
                dataType: "Electricity Usage", chartType: "Column Chart",
            }
        );
        this.getStats();
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

    getNewData(newdata) {
        let colours = ["green", "red", "grey"];
        let dates = this.state.date;
        let alertRange;
        let values;
        let data = [];

        switch(newdata){
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

    componentDidMount() {
        document.title = this.state.title;
    }

    renderColumnChart(data, options) {
        return (
            <div className="App">
                <Chart
                    chartType="ColumnChart"
                    data={data}
                    options={options}
                    width='10%'
                    height="10%"
                />
            </div>
        )
    }

    renderLineGraph(data, options) {
        return(
            <Chart
                height={'300px'}
                width={'500px'}
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
            '% Full',
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
        return (<div className='h-100 w-100' style={{height:'500px'}}>
                <Chart
                    height={'300px'}
                    width={'100%'}
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
                        series: { 5: { type: 'line' } },
                    }}
                    rootProps={{ 'data-testid': '1' }}
                />
            </div>

        )
    }

    renderStatsViews(view) {
        let data;
        let options = {
            hAxis: {
                title: 'Date',
            },
            vAxis: {
                title: this.state.view,
            },
            animation: {
                duration: 1000,
                easing: 'out',
                startup: true,
            }
        }
        switch(view) {
            case "1":
                data = this.getNewData("Electricity Usage");
               return this.renderComboChart(data,options)
                break;
            case "2":
                data = this.getNewData("Electricity Usage");
                return this.renderComboChart(data,options)

                break;
            case "3":
                data = this.getNewData("Electricity Usage");
                return (<div className="carousel-item">
                    {this.renderLineGraph(data,options)}
                </div>)
                break;
            case "4":
                data = this.getNewData("Carbon Usage");
                return (<div className="carousel-item">
                    {this.renderColumnChart(data,options)}
                </div>)
            break;
            case "5":
                data = this.getNewData("Carbon Usage");
                return (<div className="carousel-item">
                    {this.renderLineGraph(data,options)}
                </div>)
                break;
            case "6":
                data = this.getNewData("Upkeep Costs");
                return (<div className="carousel-item">
                    {this.renderColumnChart(data,options)}
                </div>)
                break;
            case "7":
                data = this.getNewData("Upkeep Costs");
                return (<div className="carousel-item">
                    {this.renderLineGraph(data,options)}
                    </div>)
                break;
            case "8":
                data = this.getNewData("Occupancy");
                return (<div className="carousel-item">
                    {this.renderColumnChart(data,options)}
                </div>)
                break;
            case "9":
                data = this.getNewData("Occupancy");
                return (<div className="carousel-item">
                    {this.renderLineGraph(data,options)}
                </div>)
                break;
        }
    }

    render() {
        let data = this.getData()
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
        return (
            <div>
                <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">

                    <div className="carousel-inner h-100 w-100">
                        <div className="carousel-item active h-100 w-100">
                            {this.renderComboChart(data, options)}
                        </div>
                    </div>
                    {/*<a className="carousel-control-prev" href="#carouselExampleIndicators" role="button"*/}
                       {/*data-slide="prev">*/}
                        {/*<span className="carousel-control-prev-icon" aria-hidden="true"></span>*/}
                        {/*<span className="sr-only">Previous</span>*/}
                    {/*</a>*/}
                    {/*<a className="carousel-control-next" href="#carouselExampleIndicators" role="button"*/}
                       {/*data-slide="next">*/}
                        {/*<span className="carousel-control-next-icon" aria-hidden="true"></span>*/}
                        {/*<span className="sr-only">Next</span>*/}
                    {/*</a>*/}
                </div>
            </div>
        )
    }
}

export default Carousel;
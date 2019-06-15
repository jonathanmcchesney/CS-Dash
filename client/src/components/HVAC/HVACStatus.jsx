import React, { Component } from 'react';
import Bad from '../../assets/img/bad.png';
import Good from '../../assets/img/good.png';

class HVACStatus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            itemsPerPage: 3
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    getStatus() {
        let error = [], ok = [];
        this.props.rooms.map(room => {
            if((room.temperature <= 30 && room.temperature >= 10) &&
                ((room.lighting === 1 && room.occupancy > 0) || (room.lighting === 0 && room.occupancy === 0)) &&
                (room.ventilation > 30)) {
                        ok.push(room);
            } else {
                error.push(room);
            }
        });
        return error;
    }

    roomList(errors) {
        let { currentPage, itemsPerPage } = this.state;

        let lastIndex = currentPage * itemsPerPage;
        let firstIndex = lastIndex - itemsPerPage;
        let currentList = errors.slice(firstIndex, lastIndex);

        const renderList = currentList.map((errors, index) => {
            return <li className="list-group-item py-md-1" key={index}>{errors.room_name} | Problem Area(s):
                {
                    errors.temperature <= 30 && errors.temperature >= 10 ?
                        '' :
                        <strong>  Temperature |</strong>
                }

                {
                    (errors.lighting === 1 && errors.occupancy > 0) || (errors.lighting === 0 && errors.occupancy === 0) ?
                        '' :
                        <strong>  Lighting |</strong>
                }
                {
                    errors.ventilation > 30 ?
                        '' :
                        <strong>  Ventilation |</strong>

                }
            </li>;
        });

        let pageNumbers = [];
        for (let i = 1; i <= Math.ceil(errors.length / itemsPerPage); i++) {
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
                <div><ul className="list-group list-group-flush" style={{height: 140}}>{renderList}</ul></div>
            </div>
        )
    }

    render() {
        let today = new Date(),
            date = today.getDate() + ' - ' + (today.getMonth() + 1) + ' - ' + (today.getFullYear());

        let problemRooms = this.getStatus();
        let status = (problemRooms.length === 0) ? "ok" : "error";
        let componentStyles = "mx-auto " + this.props.style;

        return (
            <div className={componentStyles} style={{margin: 20, width: 1000}}>
                <div className="card text-center">
                    <div className="card-header">
                        Status
                    </div>
                    <div className="card-body">
                        <h3 className="card-title">CSB Building Status</h3>
                        <p className="card-text">
                            {
                                status == "ok" ?
                                    <img src={Good} style={{width: 120, height: 120}}/> :
                                    <img src={Bad} style={{marginLeft: -10, width: 120, height: 120}}/>
                            }</p>
                        {
                            status == 'error' ?
                            <a href="#" className="btn btn-success" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">Click to see Errors</a> :
                                <p></p>
                        }
                    </div>
                    <div className="card-footer text-muted">
                        {date}
                    </div>
                </div>
                {
                    status == 'error' ?
                        <div className="collapse" id="collapseExample" style={{marginTop: 20, width: 1000}}>
                            <div className="card card-body">
                                <div>
                                    <h4>Problem Rooms</h4>
                                    {this.roomList(problemRooms)}
                                </div>
                            </div>
                        </div> :
                        ''
                }
            </div>
        );
    }

}

export default HVACStatus;

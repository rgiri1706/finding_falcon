import React from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import DropDown from '../../components/DropDown/DropDown';
import RadioButton from '../../components/RadioButton/RadioButton';
import Button from '../../components/Button/Button';
import './Main.css'

import { noPlanetsCanSelected } from '../../utils/constants';
import { updateShipCountRequest } from '../../store/actions/updateShipCount/upadateShipCount';
import { updateSelectedPlanet } from '../../store/actions/planets/planets';


class FormArea extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            planets: new Array(noPlanetsCanSelected),
            spaceShips: new Array(noPlanetsCanSelected),
        };
    }

    handlePlanetSelectChange = (index, e) => {
        const { selectedPlanetUpdate } = this.props;
        let value = e.target.value;
        this.setState(update(this.state, {
            planets: {
                [index]: {
                    $set: value
                }
            }
        }));
        selectedPlanetUpdate(index, value)
    }

    handleSpaceShipSelectChange = (index, e) => {
        debugger
        const { requestShipCountUpdate } = this.props;
        let value = e.target.value;
        requestShipCountUpdate(this.state.spaceShips[index], value, index);
        this.setState(update(this.state, {
            spaceShips: {
                [index]: {
                    $set: value
                }
            }
        }));
    }

    render() {
        const { planets, spaceShips, selectedPlanets, handleSubmit, totalTime, selectedSpaceShips } = this.props; 
        const iterationArray = new Array(noPlanetsCanSelected).fill(0,0,noPlanetsCanSelected);

        return (
            <>
                {planets && spaceShips &&
                    <>
                        <div className="drop-down-area">
                        {iterationArray.map((value, index) => 
                            <div key={index} className="drop-down-grid">
                                <div className="drop-down-wrapper">
                                        <div className="title">
                                            <span> Destination {index+1}</span>
                                        </div>
                                        <DropDown 
                                            options={planets}
                                            id={index}
                                            handleChange={(e)=> this.handlePlanetSelectChange(index, e)}
                                            disabled={(index!==0 && !this.state.spaceShips[index-1]) || this.state.planets[index+1]}
                                            selectedPlanets = {this.state.planets}
                                        />
                                </div>
                                <div className="radio-button-wrapper">
                                    {this.state.planets[index] &&  (
                                        <>
                                            <div className="title">
                                                <span> Select Vehicle : </span>
                                            </div>
                                            <RadioButton 
                                                options={spaceShips}
                                                id={index}
                                                handleChange={(e)=> this.handleSpaceShipSelectChange(index, e)}
                                                selectedPlanets={selectedPlanets}
                                                selectedSpaceShips = {selectedSpaceShips[index]}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        </div>
                        <div className="total-time-wrapper" >
                            <span className="total-time-text" >Total Time: {totalTime}</span>
                        </div>
                        <div className="button-wrapper">
                            {(this.state.spaceShips[noPlanetsCanSelected-1]) && (
                                <Button 
                                    handleClick={() => handleSubmit(this.state.planets, this.state.spaceShips)}
                                    text="SUBMIT"
                                />
                            )}
                        </div>
                    </>

                }
            </>
        );
    }
}


const mapStateToProps = state => ({
    planets: state.planets.planets,
    selectedPlanets: state.planets.selectedPlanet,
    spaceShips: state.spaceShips.spaceShips,
    selectedSpaceShips: state.spaceShips.selectedSpaceShips,
    totalTime: state.totalTime.totalTime
})
  
const mapDispatchToProps = dispatch => ({
    requestShipCountUpdate: (prevSelected, newSelected, index) => dispatch(updateShipCountRequest(prevSelected, newSelected, index)),
    selectedPlanetUpdate: (index, selectedPlanet) => dispatch(updateSelectedPlanet(index, selectedPlanet))
})

export default connect(mapStateToProps, mapDispatchToProps)(FormArea);
import React from 'react';
import './App.css';
import {GroupTable} from "./views/GroupTable";
import {StandingsTable} from "./views/StandingsTable";
import {raPredictions} from "./data/ra";
import {yngvePredictions} from "./data/yngve";
import {tobiasPredictions} from "./data/tobias";
import {wilbergPredictions} from "./data/wilberg";
import {results} from "./data/results";

const groups: string[] = ["Group A", "Group B", "Group C", "Group D", "Group E", "Group F"]

export interface Game {
    id: number,
    time: string,
    type: string,
    homeTeam: string,
    homeScore: number | "-",
    awayTeam: string,
    awayScore: number | "-"
}

export interface Player {
    name: string,
    predictions: Game[]
}

function App() {
    const players = [raPredictions, yngvePredictions, tobiasPredictions, wilbergPredictions];

    return (
        <>
            <div style={{width: '100%', display: 'flex', flexWrap: 'wrap'}}>
                <StandingsTable results={results} players={players}/>
            </div>
            <div style={{width: '100%', display: 'flex', flexWrap: 'wrap'}}>
                {players.length > 0 && results.length > 0 && (
                    groups.map(group => <GroupTable key={group} group={group} results={results} players={players}/>)
                )}
            </div>
        </>
    );
}

export default App;

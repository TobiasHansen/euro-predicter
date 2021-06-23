import React, {useState} from 'react';
import './App.css';
import {StandingsTable} from "./views/StandingsTable";
import {raPredictions} from "./data/ra";
import {yngvePredictions} from "./data/yngve";
import {tobiasPredictions} from "./data/tobias";
import {wilbergPredictions} from "./data/wilberg";
import {results} from "./data/results";
import {FormControl, FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import {ScheduleTable} from "./views/ScheduleTable";
import {GroupMatches} from "./views/GroupMatches";
import {PlayoffMatches} from "./views/PlayoffMatches";

type View = "Group Matches" | "Schedule" | "Playoffs"

const groups: string[] = ["Group A", "Group B", "Group C", "Group D", "Group E", "Group F"]
const views: View[] = ["Group Matches", "Schedule", "Playoffs"]

export interface Game {
    id: number,
    time: Date,
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

export function App() {
    const [view, setView] = useState("Playoffs");
    const players = [raPredictions, yngvePredictions, tobiasPredictions, wilbergPredictions];

    const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setView((event.target as HTMLInputElement).value);
    };
    return (
        <>
            <div style={{width: '100%', display: 'flex', flexWrap: 'wrap'}}>
                <StandingsTable results={results} players={players}/>
            </div>

            <FormControl component="fieldset">
                <RadioGroup row value={view} onChange={handleViewChange}>
                    {views.map(view =>
                        <FormControlLabel
                            key={view}
                            value={view}
                            control={<Radio color="primary"/>}
                            label={view}
                            labelPlacement="top"
                        />
                    )}
                </RadioGroup>
            </FormControl>

            {players?.length > 0 && (
                <div style={{width: '100%', display: 'flex', flexWrap: 'wrap'}}>
                    {view === "Playoffs" && (
                        <PlayoffMatches results={results} players={players}/>
                    )}

                    {view === "Group Matches" && (
                        groups.map(group => <GroupMatches key={group} group={group} results={results}
                                                          players={players}/>)
                    )}

                    {view === "Schedule" && (
                        <ScheduleTable results={results} players={players}/>
                    )}
                </div>
            )}
        </>
    );
}

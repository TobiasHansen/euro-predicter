import React, {useEffect, useState} from 'react';
import './App.css';
import Papa from 'papaparse';
import {GroupTable} from "./GroupTable";

const playerNames: string[] = ["yngve", "tobias", "wilberg", "ra"];
const groups: string[] = ["Group A", "Group B", "Group C", "Group D", "Group E", "Group F"]

export interface Game {
    id: number,
    time: string,
    type: string,
    homeTeam: string,
    homeScore: number,
    awayTeam: string,
    awayScore: number
}

export interface Player {
    name: string,
    predictions: Game[]
}

function App() {
    const [players, setPlayers] = useState<Player[]>([])
    const [results, setResults] = useState<Game[]>([])

    useEffect(() => {
        const a: Player[] = []
        playerNames.forEach(name => {
            Papa.parse<Game>(`./${name}.csv`, {
                header: true,
                download: true,
                skipEmptyLines: true,
                complete: data => {
                    a.push({
                        name,
                        predictions: data.data.sort((a, b) => a.time > b.time ? -1 : a.time === b.time ? 0 : 1)
                    })
                }
            });
        })
        setPlayers(a)
        Papa.parse<Game>(`./results.csv`, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: data => {
                setResults(data.data)
            }
        });
    }, [])

    return (
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {players.length > 0 && results.length > 0 && (
                groups.map(group => <GroupTable group={group} results={results} players={players}/>)
            )}
        </div>
    );
}

export default App;

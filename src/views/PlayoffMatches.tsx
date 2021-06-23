import React, {ReactNode} from "react";
import {Game, Player} from "../App";
import {Paper} from "@material-ui/core";
import MaterialTable from "@material-table/core";
import {format} from "date-fns";

const playoffTypes: string[] = ["Round of 16", "Quarter final", "Semi final", "Final"]

export function PlayoffMatches({results, players}: { results: Game[], players: Player[] }) {
    const playersPredictions: {name: string, predictions: {id: number, prediction: string}[]}[] = players.map(
        player => ({
            name: player.name,
            predictions: player.predictions.map(game => ({id: game.id, prediction: `${game.homeTeam}-${game.awayTeam}`}))
        })
    )

    const sortedGames = results
        .filter(game => playoffTypes.includes(game.type))
        .map(game => ({
            time: game.time,
            homeTeam: game.homeTeam,
            score: `${game.homeScore} - ${game.awayScore}`,
            awayTeam: game.awayTeam,
            ...playersPredictions.map(player => ({[player.name]: player.predictions
                    .filter(g => g.id === game.id)
                    .map(g => g.prediction)[0]}))
                .reduce((acc, curr) => ({...acc, ...curr}), [])
        }))
        .sort((a, b) => a.time.getTime() - b.time.getTime());

    return (
        <Paper style={{maxWidth: '700px', margin: '5px'}} elevation={3}>
            <MaterialTable
                columns={[
                    {
                        title: 'Tid',
                        field: 'time',
                        width: '60px',
                        render: (value): string => format(value.time, "dd-MM-yyyy")
                    },
                    {title: 'Hjemmelag', field: 'homeTeam', width: '75px'},
                    {title: '', field: 'score', width: '75px'},
                    {title: 'Bortelag', field: 'awayTeam', width: '75px'},
                    ...playersPredictions.map(player => ({title: player.name, field: player.name}))
                ]}
                data={sortedGames}
                title="Schedule"
                options={{
                    paging: false,
                    search: false,
                    sorting: false,
                    tableLayout: 'fixed',
                }}
            />
        </Paper>
    )
}

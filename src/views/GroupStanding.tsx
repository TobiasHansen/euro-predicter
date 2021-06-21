import React from "react";
import {Paper} from "@material-ui/core";
import MaterialTable from "@material-table/core";
import {Game, Player} from "../App";

interface Column {
    name: string,
    wins: number,
    draws: number,
    losses: number,
    goalsFor: number,
    goalsAgainst: number,
}

const didHomeTeamWin = (game: Game): boolean => game.homeScore !== "-" && game.awayScore !== "-" && game.homeScore > game.awayScore;
const didHomeTeamDraw = (game: Game): boolean => game.homeScore !== "-" && game.awayScore !== "-" && game.homeScore === game.awayScore;
const didHomeTeamLose = (game: Game): boolean => game.homeScore !== "-" && game.awayScore !== "-" && game.homeScore < game.awayScore;

export function GroupStandings({group, results, players}: { group: string, results: Game[], players: Player[] }) {
    const gamesInGroup = results
        .filter(game => game.type === group);

    const standing: Column[] = gamesInGroup
        .reduce((acc: Column[], curr) => ([
            ...acc,
            {
                name: curr.homeTeam,
                wins: didHomeTeamWin(curr) ? 1 : 0,
                draws: didHomeTeamDraw(curr) ? 1 : 0,
                losses: didHomeTeamLose(curr) ? 1 : 0,
                goalsFor: curr.homeScore !== "-" ? curr.homeScore : 0,
                goalsAgainst: curr.awayScore !== "-" ? curr.awayScore : 0,
            },
            {
                name: curr.awayTeam,
                wins: didHomeTeamLose(curr) ? 1 : 0,
                draws: didHomeTeamDraw(curr) ? 1 : 0,
                losses: !didHomeTeamWin(curr) ? 1 : 0,
                goalsFor: curr.awayScore !== "-" ? curr.awayScore : 0,
                goalsAgainst: curr.homeScore !== "-" ? curr.homeScore : 0,
            }
        ]), [])
        .reduce((acc: Column[], curr) => {
            if (acc.find(team => team.name === curr.name)) {
                return acc.map(team => team.name !== curr.name ? team : {
                    name: team.name,
                    wins: team.wins + curr.wins,
                    draws: team.draws + curr.draws,
                    losses: team.losses + curr.losses,
                    goalsFor: team.goalsFor + curr.goalsFor,
                    goalsAgainst: team.goalsAgainst + curr.goalsAgainst,
                })
            } else {
                return [...acc, curr]
            }
        }, [])
        .sort((a, b) => (b.wins * 3 + b.draws) - (a.wins * 3 + a.draws));

    return (
        <Paper style={{maxWidth: '700px', margin: '5px'}} elevation={3}>
            <MaterialTable
                columns={[
                    {title: 'Team', field: 'name', width: '75px'},
                    {title: 'pts', field: 'points', width: '30px', render: (values) => values.wins * 3 + values.draws},
                    {title: 'w', field: 'wins', width: '30px'},
                    {title: 'd', field: 'draws', width: '30px'},
                    {title: 'l', field: 'losses', width: '30px'},
                    {title: 'gf', field: 'goalsFor', width: '30px'},
                    {title: 'ga', field: 'goalsAgainst', width: '30px'},
                    {
                        title: 'gd',
                        field: 'goalDifference',
                        width: '30px',
                        render: (values) => values.goalsFor - values.goalsAgainst
                    },
                ]}
                data={standing}
                title={group}
                onRowClick={(event, rowData, togglePanel) => togglePanel ? togglePanel() : {}}
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

import React from "react";
import {Paper} from "@material-ui/core";
import MaterialTable from "@material-table/core";
import {Game, Player} from "../App";
import {correctResult, correctWinner} from "../utils";

//Winner 20, 2nd 4, golden boot 8, best player  6
const getExtraPointsForPlayer = (player: string): number => {
    const extraPoints = {
        ra: 0,
        yngve: 0,
        tobias: 0,
        wilberg: 0
    }

    // @ts-ignore
    return extraPoints[player]
}

export function StandingsTable({results, players}: { results: Game[], players: Player[] }) {
    const finishedGames = results.filter(res => res.awayScore !== '-');
    const sixteenthTeams: string[] = results.filter(game => game.type === "Round of 16")
        .reduce((acc: string[], curr) => [...acc, curr.homeTeam, curr.awayTeam], [])
    const quarterFinalTeams: string[] = results.filter(game => game.type === "Quarter final")
        .reduce((acc: string[], curr) => [...acc, curr.homeTeam, curr.awayTeam], [])
    const semiFinalTeams: string[] = results.filter(game => game.type === "Semi final")
        .reduce((acc: string[], curr) => [...acc, curr.homeTeam, curr.awayTeam], [])
    const finalTeams: string[] = results.filter(game => game.type === "Final")
        .reduce((acc: string[], curr) => [...acc, curr.homeTeam, curr.awayTeam], [])

    const playerScores = players.map(player => {
        let score = 0;
        let winner = 0;
        let wrong = 0;
        let sixteenth = player.predictions.filter(game => game.type === "Round of 16")
            .reduce((acc: string[], curr) => [...acc, curr.homeTeam, curr.awayTeam], [])
            .filter(team => sixteenthTeams.includes(team))
            .length
        let quarter = player.predictions.filter(game => game.type === "Quarter final")
            .reduce((acc: string[], curr) => [...acc, curr.homeTeam, curr.awayTeam], [])
            .filter(team => quarterFinalTeams.includes(team))
            .length
        let semi = player.predictions.filter(game => game.type === "Semi final")
            .reduce((acc: string[], curr) => [...acc, curr.homeTeam, curr.awayTeam], [])
            .filter(team => semiFinalTeams.includes(team))
            .length
        let final = player.predictions.filter(game => game.type === "Final")
            .reduce((acc: string[], curr) => [...acc, curr.homeTeam, curr.awayTeam], [])
            .filter(team => finalTeams.includes(team))
            .length

        player.predictions.forEach(prediction => {
            const gameResult = finishedGames.find(game => game.id === prediction.id);
            if (!!gameResult) {
                if (correctResult(prediction, gameResult)) {
                    score++;
                } else if (correctWinner(prediction, gameResult)) {
                    winner++;
                } else {
                    wrong++;
                }
            }
        })

        return {
            name: player.name,
            bonus: getExtraPointsForPlayer(player.name),
            final,
            semi,
            quarter,
            sixteenth,
            score,
            winner,
            wrong,
            points: score*3 + winner*2 + sixteenth*3 + quarter*4 + semi*8 + final*16 + getExtraPointsForPlayer(player.name),
        }
    })
    return (
        <Paper style={{maxWidth: '700px', margin: '5px'}} elevation={3}>
            <MaterialTable
                columns={[
                    {title: 'Navn', field: 'name', width: '70px'},
                    {title: '++', field: 'bonus', width: '70px'},
                    {title: '1/1', field: 'final', width: '70px'},
                    {title: '1/2', field: 'semi', width: '70px'},
                    {title: '1/4', field: 'quarter', width: '70px'},
                    {title: '1/8', field: 'sixteenth', width: '70px'},
                    {title: 'Riktig resultat', field: 'score', width: '70px'},
                    {title: 'Riktig vinner', field: 'winner', width: '70px'},
                    {title: 'Bom', field: 'wrong', width: '70px'},
                    {title: 'Peong', field: 'points', width: '70px'},
                ]}
                data={playerScores.sort((a, b) => a.points > b.points ? -1 : a.points === b.points ? 0 : 1)}
                title="Sammenlagt"
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

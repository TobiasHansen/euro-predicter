import React from "react";
import {Paper} from "@material-ui/core";
import MaterialTable from "@material-table/core";
import {Game, Player} from "../App";
import {correctResult, correctWinner} from "../utils";

export function GroupTable({group, results, players}: { group: string, results: Game[], players: Player[] }) {
    const gamesInGroup = results.filter(game => game.type === group);
    return (
        <Paper style={{maxWidth: '700px', margin: '5px'}} elevation={3}>
            <MaterialTable
                columns={[
                    {title: 'Tid', field: 'time', width: '60px'},
                    {title: 'Hjemmelag', field: 'homeTeam', width: '75px'},
                    {title: '', field: 'homeScore', width: '30px'},
                    {title: '', field: 'awayScore', width: '30px'},
                    {title: 'Bortelag', field: 'awayTeam', width: '75px'},
                ]}
                detailPanel={rowData => {
                    const predictions: { homeScore: number | "-"; awayScore: number | "-"; name: string }[] =
                        players.map(p => {
                            const game = p.predictions.find(game => game.id === rowData.id)!!;
                            return {
                                name: p.name,
                                homeScore: game?.homeScore,
                                awayScore: game?.awayScore
                            }
                        })
                    return (
                        <MaterialTable
                            style={{width: '310px', marginLeft: '10px'}}
                            columns={[
                                {title: 'Navn', field: 'name', width: '90px'},
                                {title: rowData.homeTeam, field: 'homeScore', width: '29px'},
                                {title: rowData.awayTeam, field: 'awayScore', width: '29px'},
                            ]}
                            data={predictions}
                            options={{
                                showTitle: false,
                                paging: false,
                                search: false,
                                sorting: false,
                                toolbar: false,
                                header: false,
                                padding: 'dense',
                                rowStyle: rData => {
                                    const gameNotPlayed = rowData.homeScore === '-';
                                    return {
                                        backgroundColor: gameNotPlayed ? '' : correctResult(rowData, rData) ? 'green' : correctWinner(rowData, rData) ? 'orange' : 'red'
                                    }
                                }
                            }}
                        />
                    )
                }}
                data={[...gamesInGroup]}
                title={group}
                onRowClick={(event, rowData, togglePanel) => togglePanel ? togglePanel() : {}}
                options={{
                    paging: false,
                    search: false,
                    sorting: false,
                    header: false,
                    tableLayout: 'fixed',
                }}
            />
        </Paper>
    )
}

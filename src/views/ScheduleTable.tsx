import React from "react";
import {Game, Player} from "../App";
import {Paper} from "@material-ui/core";
import MaterialTable from "@material-table/core";
import {format} from "date-fns";

export function ScheduleTable({results, players}: { results: Game[], players: Player[] }) {
    const sortedGames = results
        .filter(game => game.type.includes("Group"))
        .map(game => ({
            time: game.time,
            homeTeam: game.homeTeam,
            score: `${game.homeScore} - ${game.awayScore}`,
            awayTeam: game.awayTeam,
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
                ]}
                data={sortedGames}
                title="Schedule"
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

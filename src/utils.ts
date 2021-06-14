import {Game} from "./App";

export const correctResult = (game1: Game, game2: Game) => game1.homeScore === game2.homeScore && game1.awayScore === game2.awayScore;

export const correctWinner = (game1: Game, game2: Game) => (game1.homeScore > game1.awayScore && game2.homeScore > game2.awayScore)
    || (game1.homeScore === game1.awayScore && game2.homeScore === game2.awayScore)
    || (game1.homeScore < game1.awayScore && game2.homeScore < game2.awayScore)

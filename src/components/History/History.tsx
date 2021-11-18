import React, { FC, ReactElement } from "react";
import { DifficultyLevel, HistoryEntry } from "../../common/Types";
import "./History.css";

const History: FC<{ history: HistoryEntry[]; playerName?: string ,difficultyLevel: DifficultyLevel}> = ({
  history,
  playerName,
  difficultyLevel
}): ReactElement => {
  return (
    <section className="History">
      <h2>{`Previous Games${
        playerName ? ` of ${playerName}` : ""
      } on Difficulty ${difficultyLevel}:`}</h2>
      <ol>
        {history.map((entry, index) => {
          if (entry.playerName === playerName && entry.difficultyLevel === difficultyLevel && difficultyLevel !== "PROg(r)amer")
            return (
              <li
                key={index}
              >{`${entry.playerName} required ${entry.numGuesses} guesses to guess the number ${entry.number}`}</li>
            );
          if (entry.playerName === playerName && entry.difficultyLevel === difficultyLevel && difficultyLevel === "PROg(r)amer")
            return (
              <li
                key={index}
              >{`${entry.playerName} wrote a function that required ${entry.numGuesses} guesses to guess the number ${entry.number}`}</li>
            );
          return undefined
        })}
      </ol>
    </section>
  );
};

export default History;

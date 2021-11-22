import React, { FC, ReactElement } from "react";
import { DifficultyLevel, OptionsState } from "../../common/Types";
import "./Options.css";

const Options: FC<{
  disabled: boolean;
  setOptions: (arg: Partial<OptionsState>) => void;
  optionState: OptionsState;
  previousPlayers: string[];
}> = ({
  disabled,
  optionState: { playerName, difficultyLevel },
  setOptions,
  previousPlayers
}): ReactElement => {
  const difficultyListId = "difficultyLevels";
  return (
    <section className="Options">
      <label htmlFor="playerName">
        Player Name:
        <input
          list="playerNames"
          type="text"
          name="playerName"
          value={playerName}
          onChange={(event) => setOptions({ playerName: event.target.value })}
          disabled={disabled}
        />
        <datalist id="playerNames">
          {previousPlayers.map((playerName, index)=><option key={index} value={playerName}></option>)}
        </datalist>
      </label>
      <label htmlFor="difficulty">
        Difficulty:
        <select
          name="difficulty"
          value={difficultyLevel}
          id={difficultyListId}
          onChange={(event) =>
            setOptions({
              difficultyLevel: event.target.value as DifficultyLevel,
            })
          }
          disabled={disabled}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="PROg(r)amer">PROg(r)amer</option>
        </select>
      </label>
    </section>
  );
};

export default Options;

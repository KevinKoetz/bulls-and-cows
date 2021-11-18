import React, { FC, ReactElement } from "react";
import { DifficultyLevel } from "../../common/Types";
import "./GuessInterface.css";

const GuessInterface: FC<{
  difficultyLevel: DifficultyLevel;
  guessState: string;
  setGuess: (guess: string) => void;
  onTakeGuess: () => void;
  disabled: boolean;
}> = ({
  disabled,
  onTakeGuess,
  guessState,
  setGuess,
  difficultyLevel,
}): ReactElement => {
  return (
    <section className="GuessInterface">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onTakeGuess();
        }}
      >
        <label htmlFor="guess">
          Your Guess:
          <input
            autoComplete="off"
            type="string"
            name="guess"
            value={guessState}
            onChange={(event) =>
              (containsOnlyDigits(event.target.value) ||
                event.target.value === "") &&
              event.target.value.length <= 4 &&
              setGuess(event.target.value)
            }
            disabled={disabled}
            placeholder="4 Digit Number"
          />
        </label>
        <input
          type="submit"
          value="Take Guess"
          disabled={disabled || !isValidGuess(guessState, difficultyLevel)}
        />
      </form>
    </section>
  );
};

export default GuessInterface;

function isValidGuess(guess: string, difficultyLevel: DifficultyLevel) {
  //Not 4 digits
  if (guess.length !== 4) return false;
  //Contains non-number character
  if (!containsOnlyDigits(guess)) return false;
  if (difficultyLevel === "Easy" && !guessHasUniqueDigits(guess)) return false;
  return true;
}

function guessHasUniqueDigits(guess: string) {
  for (let i = 0; i < guess.length; i++) {
    if (guess.lastIndexOf(guess[i]) !== i) return false;
  }
  return true;
}

function containsOnlyDigits(guess: string) {
  return guess.match(/[0-9]/g)?.join("") === guess;
}

import React, { FC, ReactElement, useState } from "react";
import { DifficultyLevel, GuessingFunction } from "../../common/Types";
import "./GuessInterface.css";

const GuessInterface: FC<{
  difficultyLevel: DifficultyLevel;
  guessState: string;
  setGuess: (guess: string) => void;
  onTakeGuess: () => void;
  onSubmitGuessFunction: () => void;
  guessFunctionBody: string;
  setGuessFunctionBody: (guessFunctionBody: string) => void;
  disabled: boolean;
}> = ({
  disabled,
  onTakeGuess,
  guessState,
  onSubmitGuessFunction,
  guessFunctionBody,
  setGuessFunctionBody,
  setGuess,
  difficultyLevel,
}): ReactElement => {
  return (
    <section className="GuessInterface">
      {difficultyLevel === "PROg(r)amer" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitGuessFunction();
          }}
        >
          <label htmlFor="guessFunction" style={{ display: "block" }}>
            {
              "function (lastGuess:{guess: string, bulls: number, cows:number}, memory:any){"
            }
            <br />
            {"const result = {guess: '', memory: undefined"}
          </label>
          <textarea
            style={{ display: "block" }}
            onChange={(e) => setGuessFunctionBody(e.target.value)}
            value={guessFunctionBody}
            disabled={disabled}
          ></textarea>
          {"return result:{guess: string, memory: any}"}
          <br />
          {"}"}
          <input
            type="submit"
            value="Submit Function"
            disabled={disabled}
            style={{ display: "block" }}
          />
        </form>
      ) : (
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
      )}
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

function createGuessFunction(guessFunctionBody: string) {
  return (
    lastGuess: { guess: string; bulls: number; cows: number },
    memory: any
  ) => {
    const result = { guess: "", memory: undefined };
    // eslint-disable-next-line no-eval
    eval(guessFunctionBody);
    return result;
  };
}

import React, { useReducer } from "react";
import "./App.css";

const initialState = {
  number: generateNumber(),
  correctGuess: false,
  playerName: "Stranger",
  guess: "",
  numGuesses: 0,
  message: "Take a guess!",
  history: [] as { playerName: string; numGuesses: number; number: string }[],
};

type dispatchActions =
  | { type: "guess" }
  | { type: "newRound" }
  | { type: "nameChange"; name: string }
  | { type: "guessChange"; guess: string };

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state.number);

  return (
    <div className="App">
      <h1>Bulls and Cows</h1>
      <p>
        The computer will come up with a random 4 digit number where all digits
        are unique. Your Goal is to guess this number.
      </p>
      <p>
        After each guess you will get a hint on how "close" your guess is to the
        number. If there are any matching digits and they are in their right
        positions, they are counted as "bulls". If in different positions, they
        are counted as "cows".
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({
            type: "guess",
          });
        }}
      >
        <label htmlFor="playerName">
          Player Name:
          <input
            type="text"
            name="playerName"
            value={state.playerName}
            onChange={(event) =>
              dispatch({ type: "nameChange", name: event.target.value })
            }
            disabled={state.correctGuess}
          />
        </label>
        <label htmlFor="guess">
          Your Guess:
          <input
            autoComplete="off"
            type="string"
            name="guess"
            value={state.guess}
            onChange={(event) =>
              dispatch({ type: "guessChange", guess: event.target.value })
            }
            disabled={state.correctGuess}
            placeholder="4 Digit Number"
          />
        </label>
        <input
          type="submit"
          value="Take Guess"
          disabled={!isValidGuess(state.guess) || state.correctGuess}
        />
      </form>

      <p>{state.message}</p>
      <input
        type="button"
        value="New Round"
        disabled={!state.correctGuess}
        onClick={() => dispatch({ type: "newRound" })}
      />
      <section>
        <h2>Previous Games:</h2>
        <ol>
          {state.history.map((entry, index) => (
            <li
              key={index}
            >{`${entry.playerName} required ${entry.numGuesses} guesses to guess the number ${entry.number}`}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function reducer(
  state: typeof initialState,
  action: dispatchActions
): typeof initialState {
  switch (action.type) {
    case "guess":
      return {
        ...state,
        ...handleGuess(state),
      };
    case "newRound":
      return {
        ...state,
        ...handleNewRound(),
      };
    case "nameChange":
      return { ...state, playerName: action.name };
    case "guessChange":
      return { ...state, guess: action.guess };
    default:
      return initialState;
  }
}

function handleGuess({
  playerName,
  number,
  guess,
  numGuesses,
  history,
}: typeof initialState) {
  const randomMessages = [
    "Woops, no cows and no bulls? Better guess next time!",
    "At least you tried?!",
    "Are you sure you understood the Game?",
    `${provideHint(number)}`,
  ];
  const bulls = getNumberOfBulls(number, guess);
  const cows = getNumberOfCows(number, guess);
  if (bulls === 4) {
    return {
      numGuesses: ++numGuesses,
      correctGuess: true,
      message: `Congratulation ${playerName}! You found the correct Number. Ready for a new Round?`,
      history: [...history, { playerName, numGuesses, number }],
    };
  }
  if (bulls + cows > 0) {
    return {
      numGuesses: ++numGuesses,
      message: `Almost, you found ${bulls} bulls and ${cows} cows. This is your ${humanizeNumber(
        numGuesses
      )} guess.`,
    };
  }
  return {
    numGuesses: ++numGuesses,
    message:
      randomMessages[Math.floor(Math.random() * randomMessages.length)] +
      ` This is your ${humanizeNumber(numGuesses)} guess.`,
  };
}

function humanizeNumber(num: number) {
  switch (num) {
    case 1:
      return 1 + "st";
    case 2:
      return 2 + "nd";
    case 3:
      return 3 + "rd";
    default:
      return num + "th";
  }
}

function getNumberOfBulls(number: string, guess: string) {
  let result = 0;
  for (let i = 0; i < guess.length; i++) {
    const digit = guess[i];
    if (digit === number[i]) result++;
  }
  return result;
}

function getNumberOfCows(number: string, guess: string) {
  let result = 0;
  for (let i = 0; i < guess.length; i++) {
    const digit = guess[i];
    if (number.includes(digit) && digit !== number[i]) result++;
  }
  return result;
}

function provideHint(num: string) {
  const index = Math.floor(Math.random() * num.length);
  return `If i were you, i would put a ${num[index]} on the ${humanizeNumber(
    index + 1
  )} position.`;
}

function isValidGuess(guess: string) {
  //Not 4 digits
  if (guess.length !== 4) return false;
  //Contains non-number character
  if (guess.match(/[0-9]/g)?.join("") !== guess) return false;
  return true;
}

function handleNewRound() {
  return {
    number: generateNumber(),
    correctGuess: false,
    guess: "",
    numGuesses: 0
  };
}

function generateNumber() {
  const digits: number[] = [];
  while (digits.length < 4) {
    const digit = Math.floor(Math.random() * 10);
    if (!digits.includes(digit)) digits.push(digit);
  }
  return digits.join("");
}

export default App;

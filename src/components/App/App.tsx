import React, {
  useReducer,
  FC,
  ReactElement,
  useLayoutEffect,
} from "react";
import "./App.css";
import {
  DispatchAction,
  AppState,
  DifficultyLevel,
  GuessingFunction,
  GuessingFunctionRunnerResponse,
  AppHistory,
} from "../../common/Types";
import History from "../History/History";
import Description from "../Description/Description";
import Options from "../Options/Options";
import GuessInterface from "../GuessInterface/GuessInterface";
import GuessFunctionRunner from "../../common/guessingFunctionRunner";

const App: FC<Partial<AppState>> = ({
  options: defaultOptions = { playerName: "Stranger", difficultyLevel: "Easy" },
  round: defaultRound = {
    number: generateNumber(defaultOptions.difficultyLevel),
    correctGuess: false,
    guess: "",
    numGuesses: 0,
    message: "Take a guess!",
    bulls: 0,
    cows: 0,
    guessFunctionBody: "",
  },
  history: defaultHistory = [],
}): ReactElement => {
  const [state, dispatch] = useReducer(reducer, {
    options: defaultOptions,
    round: defaultRound,
    history: defaultHistory,
  });

  useLayoutEffect(() => {
    const historyString = localStorage.getItem("history");
    const history = historyString ? JSON.parse(historyString) : [];
    dispatch({ type: "history", history });
  }, []);

  return (
    <div className="App">
      <Description />
      <Options
        disabled={state.round.numGuesses > 0}
        previousPlayers={getPreviousPlayers(state.history)}
        optionState={state.options}
        setOptions={(options) => {
          dispatch({ type: "options", options });
          if ("difficultyLevel" in options)
            dispatch({
              type: "round",
              round: {
                number: generateNumber(options.difficultyLevel ?? "Easy"),
              },
            });
        }}
      />
      <GuessInterface
        difficultyLevel={state.options.difficultyLevel}
        guessState={state.round.guess}
        setGuess={(guess) => dispatch({ type: "round", round: { guess } })}
        disabled={state.round.correctGuess}
        onSubmitGuessFunction={() =>
          handleGuessFunctionSubmit(
            dispatch,
            state.round.number,
            state.round.guessFunctionBody
          )
        }
        guessFunctionBody={state.round.guessFunctionBody}
        setGuessFunctionBody={(guessFunctionBody) =>
          dispatch({ type: "round", round: { guessFunctionBody } })
        }
        onTakeGuess={() => {
          const guessResults = getGuessResult(state);
          console.log({ ...state, ...guessResults });
          const newMessage = generateMessage({
            ...state,
            round: { ...state.round, ...guessResults },
          });
          console.log(newMessage);

          dispatch({
            type: "round",
            round: {
              ...guessResults,
              message: newMessage,
            },
          });
        }}
      />
      <p>{state.round.message}</p>
      <input
        type="button"
        value="New Round"
        disabled={!state.round.correctGuess}
        onClick={() => {
          dispatch({ type: "resetGuessFunction" });
          dispatch({
            type: "round",
            round: {
              ...defaultRound,
              number: generateNumber(state.options.difficultyLevel),
            },
          });
          const newHistory = [
            ...state.history,
            {
              playerName: state.options.playerName,
              numGuesses: state.round.numGuesses,
              number: state.round.number,
              difficultyLevel: state.options.difficultyLevel,
            },
          ];
          dispatch({
            type: "history",
            history: newHistory,
          });
          localStorage.setItem("history", JSON.stringify(newHistory));
        }}
      />
      <History
        history={state.history}
        playerName={state.options.playerName}
        difficultyLevel={state.options.difficultyLevel}
      />
    </div>
  );
};

function handleGuessFunctionSubmit(
  dispatch: React.Dispatch<DispatchAction>,
  number: string,
  guessFunctionBody: string
) {
  const code = GuessFunctionRunner.toString();
  const blob = new Blob(["(" + code + ")()"]);
  const worker = new Worker(URL.createObjectURL(blob));
  let receivedMsg = false;
  worker.onmessage = (msg) => {
    receivedMsg = true;
    const data = msg.data as GuessingFunctionRunnerResponse;
    switch (data.type) {
      case "result":
        if (data.correctGuess) {
          dispatch({
            type: "round",
            round: {
              numGuesses: data.numGuesses,
              message: `Your Function needed ${data.numGuesses} guesses to find the number`,
              correctGuess: true,
              guess: number,
            },
          });
        } else {
          dispatch({
            type: "round",
            round: {
              message: `Your Function has not found the correct Number after ${data.numGuesses} guesses. Try changing it.`,
            },
          });
        }
        break;
    }
    worker.terminate()
  };
  worker.postMessage({
    type: "runFunction",
    payload: { functionBody: guessFunctionBody, number: number },
  });
  setTimeout(() => {
    if (!receivedMsg) {
      worker.terminate()
      dispatch({
        type: "round",
        round: {
          message: `It seems like your function is too slow or contains an infinite loop, try changing it. It took more than 5s to complete.`,
        },
      });
    }
  }, 5000);
}

function getPreviousPlayers(history: AppHistory){
  const previousPlayers:string[] = []
  for (const entry of history) {
    if(!previousPlayers.includes(entry.playerName)) previousPlayers.push(entry.playerName)
  }
  return previousPlayers
}

function reducer(oldState: AppState, action: DispatchAction): AppState {
  switch (action.type) {
    case "options":
      return {
        ...oldState,
        options: { ...oldState.options, ...action.options },
      };
    case "round":
      return {
        ...oldState,
        round: {
          ...oldState.round,
          ...action.round,
        },
      };
    case "history":
      return { ...oldState, history: action.history };
    default:
      return oldState;
  }
}

function runGuessingFunction(
  guessingFunction: GuessingFunction,
  number: string
) {
  try {
    const maxIterations = 10000;
    let i = 1;
    const lastGuess = { guess: "", bulls: 0, cows: 0 };
    let oldMemory = null;
    while (i <= maxIterations) {
      const { guess, memory } = guessingFunction(lastGuess, oldMemory);
      oldMemory = memory;
      lastGuess.guess = guess;
      lastGuess.bulls = getNumberOfBulls(number, guess);
      lastGuess.cows = getNumberOfCows(number, guess);
      if (lastGuess.guess === number) break;
      i++;
    }
    return { foundNumber: lastGuess.guess === number, numGuesses: i };
  } catch (error: any) {
    return { foundNumber: false, numGuesses: Infinity, error };
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

function generateNumber(difficultyLevel: DifficultyLevel) {
  const digits: number[] = [];
  while (digits.length < 4) {
    const digit = Math.floor(Math.random() * 10);
    if (!digits.includes(digit) && difficultyLevel === "Easy") {
      digits.push(digit);
    }
    if (difficultyLevel !== "Easy") digits.push(digit);
  }
  return digits.join("");
}

function generateMessage({
  round: { number, numGuesses, bulls, cows },
  options: { playerName },
}: AppState) {
  const randomMessages = [
    "Woops, no cows and no bulls? Better luck next time!",
    "At least you tried?!",
    "Are you sure you understood the Game?",
    `${provideHint(number)}`,
  ];
  if (numGuesses > 0) {
    if (bulls === 4) {
      return `Congratulation ${playerName}! You found the correct Number. Ready for a new Round?`;
    }
    if (bulls + cows > 0) {
      return `Almost, you found ${bulls} bulls and ${cows} cows. This is your ${humanizeNumber(
        numGuesses
      )} guess.`;
    }
    return (
      randomMessages[Math.floor(Math.random() * randomMessages.length)] +
      ` This is your ${humanizeNumber(numGuesses)} guess.`
    );
  } else return "Take a guess!";
}

function getGuessResult({ round: { number, guess, numGuesses } }: AppState) {
  const bulls = getNumberOfBulls(number, guess);
  const cows = getNumberOfCows(number, guess);
  return {
    numGuesses: ++numGuesses,
    correctGuess: number === guess,
    bulls,
    cows,
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

export default App;

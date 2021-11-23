declare namespace Types {
  type HistoryEntry = {
    playerName: string;
    numGuesses: number;
    number: string;
    difficultyLevel: DifficultyLevel;
  };

  type AppHistory = HistoryEntry []

  type AppState = {
    options: OptionsState;
    round: RoundState;
    history: AppHistory;
  };

  type OptionsState = {
    playerName: string;
    difficultyLevel: DifficultyLevel;
  };

  type RoundState = {
    evaluatingFunction: boolean;
    number: string;
    correctGuess: boolean;
    guess: string;
    numGuesses: number;
    guessFunctionBody: string;
    message: string;
    bulls: number;
    cows: number;
  };

  type GuessingFunction = (
    lastGuess: { guess: string; bulls: number; cows: number },
    memory: any
  ) => { guess: string; memory: any };

  type DifficultyLevel = "Easy" | "Medium" | "PROg(r)amer";

  type DispatchType = keyof AppState;

  type DispatchAction =
    | { type: "options"; options: Partial<OptionsState> }
    | { type: "round"; round: Partial<RoundState> }
    | { type: "history"; history: HistoryEntry[] }
    | { type: "handleGuessFunctionSubmit"; guessFunction: GuessingFunction }
    | { type: "resetGuessFunction" };

  type GuessingFunctionRunnerMessage =
    | { type: "ping" }
    | { type: "runFunction", payload:{functionBody: string, number: string} };
  type GuessingFunctionRunnerResponse =
    | { type: "pong" }
    | { type: "result", correctGuess: boolean, numGuesses: number };
}

export = Types;
export as namespace Types;

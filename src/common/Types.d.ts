declare namespace Types {
  type HistoryEntry = {
    playerName: string;
    numGuesses: number;
    number: string;
    difficultyLevel: DifficultyLevel;
  };

  type AppState = {
    options: OptionsState;
    round: RoundState;
    guessingFunction: GuessingFunction | null;
    history: HistoryEntry[];
  };

  type OptionsState = {
    playerName: string;
    difficultyLevel: DifficultyLevel;
  };

  type RoundState = {
    number: string;
    correctGuess: boolean;
    guess: string;
    numGuesses: number;
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
}

export = Types;
export as namespace Types;

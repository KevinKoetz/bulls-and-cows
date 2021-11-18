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
    guessingFunction: GuessingFunction
    numGuesses: number;
    message: string;
    bulls: number,
    cows: number
  };

  type GuessingFunction<T> = (bullAndCows:{bulls:number, cows:number}, memory: T) => {guess:string, memory: T}

  type DifficultyLevel = "Easy" | "Medium" | "PROg(r)amer";

  type DispatchType = keyof AppState;

  type DispatchAction =
    | { type: "options"; options: Partial<OptionsState> }
    | { type: "round"; round: Partial<RoundState> }
    | { type: "history"; history: HistoryEntry[] };
}

export = Types;
export as namespace Types;

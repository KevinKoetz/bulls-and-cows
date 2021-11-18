/// <reference lib="WebWorker" />
import { GuessingFunctionRunnerMessage, GuessingFunction} from "./Types";
declare const self: Worker;
// export empty type because of tsc --isolatedModules flag
const worker = () => {


self.onmessage = (msg) => {
    const data = msg.data as GuessingFunctionRunnerMessage;
    switch(data.type){
        case "ping":
            self.postMessage({type: "pong"})
        break;
        case "runFunction":
            const guessFunction = createGuessFunction(data.payload.functionBody)
            const result = runGuessingFunction(guessFunction, data.payload.number)
            self.postMessage({type:"result", correctGuess: result.foundNumber, numGuesses: result.numGuesses})
    }
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
}

export default worker
/// <reference lib="WebWorker" />
import { GuessingFunctionRunnerMessage, GuessingFunction } from "./Types";
declare const self: Worker;
// export empty type because of tsc --isolatedModules flag
const worker = () => {
  self.onmessage = (msg) => {
    const data = msg.data as GuessingFunctionRunnerMessage;
    switch (data.type) {
      case "ping":
        self.postMessage({ type: "pong" });
        break;
      case "runFunction":
        const guessFunction = createGuessFunction(data.payload.functionBody);
        let averageGuesses = 0;
        let result: {
          type: "success",
          foundNumber: boolean
          numGuesses: number
        } | { type: "error", error: any } = { type: "error", error: new Error("should never happen") };
        for (let counter = 0; counter < 1000; counter++) {
          result = runGuessingFunction(guessFunction, generateNumber());
          if(result.type === "error") break;
          if(result.type === "success" && result.foundNumber === false) break;
          averageGuesses += result.numGuesses
        }
        averageGuesses = averageGuesses / 1000
        

        if (result.type === "success")
          self.postMessage({
            type: "result",
            correctGuess: result.foundNumber,
            numGuesses: result.foundNumber ? Math.floor(averageGuesses) : 10000,
          });
        if (result.type === "error")
          self.postMessage({
            type: "error",
            error: result.error.toString(),
          });
    }
  };

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
  ): {
    type: "success",
    foundNumber: boolean
    numGuesses: number
  } | { type: "error", error: any } {
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
      return {
        type: "success",
        foundNumber: lastGuess.guess === number,
        numGuesses: i,
      };
    } catch (error: any) {
      return { type: "error", error };
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

  function generateNumber() {
    const digits: number[] = [];
    while (digits.length < 4) {
      const digit = Math.floor(Math.random() * 10);
      digits.push(digit);
    }
    return digits.join("");
  }
};

export default worker;

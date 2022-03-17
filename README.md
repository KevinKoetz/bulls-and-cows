# Bulls and Cows
Number guessing game with a catch, built in react.

The computer will come up with a random 4 digit number. Your Goal is to guess this number.

After each guess you will get a hint on how "close" your guess is to the number. If there are any matching digits and they are in their right positions, they are counted as "bulls". If in different positions, they are counted as "cows".

Difficulty Levels:
Easy
All Digits are unique.
Medium
Digits may not be unique.
PROg(r)amer
Instead of guessing, you write a function which guesses for you. The function is always called with the lastGuess object and a memory argument. In the first invocation of the function lastGuess = {guess: '', bulls: 0, cows: 0} and memory = null. The function should return a results object like {guess: string, memory: any} where guess should be a 4 digit String containing your guess and memory can be anything you want to remember for further invocations. On further invocations the function will be called with it's last Guess, the number of bulls and cows this guess had and the last memory returned by the function.

## About the PROg(r)amer difficulty
I mainly implemented this to try out Service Workers. And because i wanted to see who could come up with the most effective algorithm to solve the game.

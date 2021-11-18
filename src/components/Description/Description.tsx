import React, { FC, ReactElement } from "react";
import "./Description.css";

const Description: FC = (): ReactElement => {
  return (
    <section className="Description">
      <h1>Bulls and Cows</h1>
      <p>
        The computer will come up with a random 4 digit number. Your Goal is to
        guess this number.
      </p>
      <p>
        After each guess you will get a hint on how "close" your guess is to the
        number. If there are any matching digits and they are in their right
        positions, they are counted as "bulls". If in different positions, they
        are counted as "cows".
      </p>
      <section>
        Difficulty Levels:
        <dl>
          <dt>Easy</dt>
          <dd>All Digits are unique.</dd>

          <dt>Medium</dt>
          <dd>Digits may not be unique.</dd>

          <dt>PROg(r)amer</dt>
          <dd>
            Instead of guessing, you write a function which guesses for you. The
            function is always called with the lastGuess object and a memory
            argument. In the first invocation of the function lastGuess ={" "}
            {"{guess: '', bulls: 0, cows: 0}"} and memory = null. The function
            should return a results object like {"{guess: string, memory: any}"}{" "}
            where guess should be a 4 digit String containing your guess and
            memory can be anything you want to remember for further invocations.
            On further invocations the function will be called with it's last
            Guess, the number of bulls and cows this guess had and the last
            memory returned by the function.
          </dd>
        </dl>
      </section>
    </section>
  );
};

export default Description;

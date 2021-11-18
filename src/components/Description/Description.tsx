import React, {FC, ReactElement} from "react";
import "./Description.css";

const Description: FC = (): ReactElement => {
  return (
    <section className="Description">
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
    </section>
  );
}


export default Description;

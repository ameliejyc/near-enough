import React from "react";

export const GameInfo = () => {
  return (
    <main>
      <h1>NEAR enough</h1>
      <p>
        ...is a wisdom of the crowd guessing game where participants guess the
        weight of the animal in the picture.
      </p>
      <p>
        The winning guess is the one closest to the average of what the crowd
        thinks is the truth. If enough people play, this should be close to the
        real answer. That is the wisdom of the crowd!
      </p>
      <p>
        Each game has one winner (if there are multiple winning answers the
        first one wins). To play, each player donates 0.1 NEAR. The winner
        receives all the money in the pot.
      </p>
      <p>Check out the code <a href="https://github.com/ameliejyc/near-enough">here</a>.</p>
    </main>
  );
};

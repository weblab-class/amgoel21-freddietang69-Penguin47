import React from "react";
import "./Rules.css";
import logo from "../../corgi.jpg";

const Rules = () => {
  return (
    <div>
      <h1 class="underline decoration-2 mb-4 text-xl flex justify-center font-sans leading-none tracking-tight text-neutral-50 md:text-5xl lg:text-6xl dark:text-white">
        Rules of Palace
      </h1>
      <h1 class="underline decoration-2 mb-4 text-base flex justify-center font-sans leading-none tracking-tight text-neutral-50 md:text-2xl lg:text-3xl dark:text-white">
        Overview
      </h1>
      <div className="flex justify-center text-white font-serif">
        Palace is a turn-based game for 3+ players played with a regular deck of card (or more, if
        many players). The object of the game is to be the first player to play all of their cards,
        ie have an empty hand. The basic structure of the game revolves around playing a equal or
        higher numbered card than the previous card played, but with many cards having special
        rules/powers.
      </div>
      <h1 class="underline decoration-2 mb-4 text-base flex justify-center font-sans leading-none tracking-tight text-neutral-50 md:text-2xl lg:text-3xl dark:text-white">
        Setup
      </h1>
      <div class="flex flex-col space-y-4">
        <div className="flex justify-center text-white font-serif">
          Shuffle a Deck of Cards after removing the 2s, 7s, 10s, and Aces. Deal each player 3 cards
          face down, which nobody (including the player) can currently view. Next, shuffle the 2s,
          7s, 10s, and Aces back into the remaining cards and deal each player another 6 cards,
          which they can view. The remaining cards become the draw pile.
        </div>
        <div className="flex justify-center text-white font-serif">
          Players don't touch their 3 facedown cards, but view their other 6 cards. They choose 3 of
          these and place one of each of these on top of each of their facedown cards. The remaining
          3 cards they have will be their starting hand.
        </div>
      </div>
      <h1 class="underline decoration-2 mb-4 text-base flex justify-center font-sans leading-none tracking-tight text-neutral-50 md:text-2xl lg:text-3xl dark:text-white">
        Gameplay
      </h1>
      <div class="flex flex-col space-y-4">
        <div className="flex justify-center text-white font-serif">
          The goal of Palace is to be the first to play all of your cards. On your turn, you can
          play a card (or potentially multiple). If you cannot play a card, you have to pick up all
          the cards in the current pile and the new pile is started by whoever's turn is next. These
          rules are constant throughout the game, but there are additional rules about the cards in
          your deck. We can split the game into 3 stages to explain these.
        </div>
        <div className="flex justify-center text-white font-serif">
          In the first stage, you start with the 3 cards in your hand and play if possible. During
          this stage, there is still a drawpile. After your turn (where you either played a card or
          picked the deck), you must pick cards until your hand has at least 3 cards. If you already
          have 3 or more cards, you don't need to pick any cards. This continues until the drawpile
          is out of cards, and now you no longer have to have 3 cards after your turn. Once you have
          played all the cards in your current hand, you can progress to stage 2.{" "}
        </div>
        <div className="flex justify-center text-white font-serif">
          The moment you have played all the cards in your hand, you reach stage 2. Here, pick up
          the 3 cards that you put faceup on top of your hidden cards at the beginning. These become
          your new hand, and the game continues. One small side rule here: If one or more of these
          cards match the card you just put down, you may play it as well. For example, if you just
          played a 3, and one of your three cards that you pick up is also a 3, you may play that
          now as well. Once you get rid of all cards in your hand in this section, you progress to
          stage 3.{" "}
        </div>
        <div className="flex justify-center text-white font-serif">
          In stage 3, you now reach your unknown facedown cards. You now pick up exactly one of your
          facedown cards and add it to your hand. You cannot immediately play it like in stage 2.
          The game progresses, and once your hand is empty again, you can pick up a second facedown
          card and add it to your hand. The game progresses, and when you finally get a empty hand
          again, you can pick up the last facedown card. If you now reach an empty hand, (meaning
          you are the first to do so), you win the game!{" "}
        </div>
      </div>
      <h1 class="underline decoration-2 mb-4 text-base flex justify-center font-sans leading-none tracking-tight text-neutral-50 md:text-2xl lg:text-3xl dark:text-white">
        Playing Cards
      </h1>
      <div className="flex justify-center text-white font-serif">
        The most basic rules of playing cards in Palace are that you must almost always play a
        higher card than the previous card played (with 2 being the lowest and Ace being highest)
        and that you can play multiple of the same value card. There are some special rules which we
        will know go over.
      </div>
      <h1 class="underline decoration-2 mb-4 text-base flex justify-center font-sans leading-none tracking-tight text-neutral-50 md:text-xl lg:text-2xl dark:text-white">
        Special Rules
      </h1>
      <ul class="list-disc text-white font-serif">
        <li>
          2 is a wildcard that can be played on top of any card and allows the player of the card to
          go again (allowing the user to play anything on top of it)
        </li>
        <li>
          7 is a wildcard that can be played on top of any card that acts like a temporary skip. It
          then becomes the next player's turn, who has to play a card that addresses the card under
          the 7. For example, a player can play a 7 on top of a King, even though the King is larger
          than the 7. The next player will then have to play a card that can be played on top of the
          King, not the 7.
        </li>
        <li>
          9 is the one card that breaks the rule of playing a card equal to or higher than the
          previous card. When a 9 is played, the next player must play a card lower than 9. If a 7
          is played on top of a 9, the next player still has to play a card lower than 9.
        </li>
        <li>
          9 is the one card that breaks the rule of playing a card equal to or higher than the
          previous card. When a 9 is played, the next player must play a card lower than 9. If a 7
          is played on top of a 9, the next player still has to play a card lower than 9.
        </li>
        <li>
          10 is a card that can be played on top of any card except the 9. The 10 is a Bomb, meaning
          the current pile of cards is discarded, and the player who played the 10 starts a new pile
          by playing any card they want.
        </li>
        <li>
          Playing 4 of the same card (or 8 if with 2 decks) also acts like a bomb if they are
          legally played. For example, someone could play four 5s on top of a 2 and that current
          pile would be discarded, but they could not play the four 5s on top of a 6.
        </li>
      </ul>
    </div>
  );
};

export default Rules;

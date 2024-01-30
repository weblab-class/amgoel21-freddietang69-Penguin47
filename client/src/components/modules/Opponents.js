import React from "react";

import CardContainer from "./CardContainer";

import "../pages/Game.css";
const Opponents = ({ players, turn, userId, steal, deck }) => {
    return (
        <div>
            {players.map((player, index) => {
                return (
                    <div className="text-white m-5 border-2 border-dotted border-green-500 bg-gray-600 p-3">
                        {player._id === userId ? (
                            <div className="flex justify-center"> YOU </div>
                        ) : (
                            <div>
                                <div className="flex justify-center">{player.name}</div>
                                <div className="flex justify-center">
                                    <button
                                        className="u-bold flex justify-center steal-button"
                                        onClick={() => {
                                            steal(index);
                                        }}
                                    >
                                        Steal
                                    </button>
                                </div>
                            </div>
                        )}
                        {index === turn && (
                            <div className="text-yellow-500 flex justify-center">TO PLAY</div>
                        )}
                        <div className="flex justify-center">Top cards</div>
                        {player.tops.length === 0 ? (
                            <div className="flex justify-center text-black italic">
                                No Tops Left!
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 my-3">
                                {player.tops.map((card) => (
                                    <CardContainer card={card} width={75} />
                                ))}
                            </div>
                        )}
                        <div className="flex justify-center">{player.deck} cards in hand </div>
                        <div className="grid grid-cols-3 my-3">
                            {player.revealed.map((card) => (
                                <CardContainer card={card} width={75} />
                            ))}
                        </div>
                        <div className="flex justify-center">{player.bottoms} cards in bottom</div>
                    </div>
                );
            })}
            <div className="text-white m-5 border-2 border-dotted border-green-500 bg-gray-600 p-3">
                <div className="flex justify-center">{deck} cards left in the deck</div>
            </div>
        </div>
    );
};

export default Opponents;

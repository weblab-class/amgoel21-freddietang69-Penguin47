import React from "react";

import CardContainer from "./CardContainer";

const Opponents = ({ players, turn, userId, steal }) => {
    return (
        <div>
            {players.map((player, index) => {
                return (
                    <span className="text-white">
                        <div>
                            ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                        </div>
                        {player._id === userId ? (
                            <div>YOU</div>
                        ) : (
                            <div>
                                <div>
                                    Opponent {index + 1}: {player.name}
                                </div>
                                <button
                                    className="u-bold"
                                    onClick={() => {
                                        steal(index);
                                    }}
                                >
                                    Steal
                                </button>
                            </div>
                        )}
                        {index === turn && <div className="text-yellow-500">TO PLAY</div>}
                        <div class="grid grid-cols-3">
                            {player.tops.map((card) => (
                                <CardContainer card={card} width={75} />
                            ))}
                        </div>
                        <div>{player.deck} cards in hand </div>
                        <div class="grid grid-cols-3">
                            {player.revealed.map((card) => (
                                <CardContainer card={card} width={75} />
                            ))}
                        </div>
                        <div>{player.bottoms} cards in bottom</div>
                        <div>
                            -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                        </div>
                    </span>
                );
            })}
        </div>
    );
};

export default Opponents;

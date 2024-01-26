import React from "react";

import CardContainer from "../modules/CardContainer";

const Opponent = (props) => {
    return (
        <span className="text-white">
            <div>
                ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            </div>
            <div>Player name: {props.player.name}</div>
            <div class="grid grid-cols-3">
                {props.player.tops.map((card) => (
                    <CardContainer card={card} width={75} />
                ))}
            </div>
            <div>{props.player.deck} cards in hand </div>
            <div>{props.player.bottoms} cards in bottom</div>
            <div>
                -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            </div>
        </span>
    );
};

export default Opponent;

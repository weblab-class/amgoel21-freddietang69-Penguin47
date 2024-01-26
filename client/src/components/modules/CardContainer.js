import React from "react";

const images = require.context("../../cards", true);

/**
 * Lobby is a component that renders a single lobby in the hub
 * It renders the lobby information: name, players, etc
 *
 * Proptypes
 * @param {card} card
 * card.value -> an integer
 * card.suit -> the suit of the card
 */
const CardContainer = ({ card, width = 150, onClick = () => {}, highlighted = false }) => {
    const image = images("./" + card.value.toString() + "_of_" + card.suit + ".png");
    return (
        <>
            {highlighted ? (
                <div onClick={onClick} class="p-1 bg-yellow-300">
                    <img src={image.default} width={width} />
                </div>
            ) : (
                <div onClick={onClick}>
                    <img src={image.default} width={width} />
                </div>
            )}
        </>
    );
};

export default CardContainer;

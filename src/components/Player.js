import React from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import {
  addToRed,
  addToBlue,
  removeFromRed,
  removeFromBlue,
  addToSpec,
} from "../util/firebaseFunctions";

export default function Player(props) {
  const { data, firestore } = props;

  const isRed = props.color === "#ec4053";

  const movePlayer = (toSpec) => {
    if (isRed) {
      removeFromRed(firestore, data.battletag);
      toSpec
        ? addToSpec(firestore, data.battletag, data)
        : addToBlue(firestore, data.battletag, data);
    } else {
      removeFromBlue(firestore, data.battletag);
      toSpec
        ? addToSpec(firestore, data.battletag, data)
        : addToRed(firestore, data.battletag, data);
    }
  };

  return (
    <div>
      <ContextMenuTrigger id={data.battletag}>
        {/* VISIBLE COMPONENT */}
        <div style={{ ...s.container, backgroundColor: props.color }}>
          {data.battletag.toUpperCase()}
        </div>
        {/* CONTEXT MENU */}
        <ContextMenu id={data.battletag}>
          <div style={s.contextContainer}>
            <div style={s.contextItem}>
              <MenuItem
                onClick={() => {
                  movePlayer(false);
                }}
              >
                Add to {!isRed ? "Red" : "Blue"}
              </MenuItem>
            </div>
            <div style={s.contextItem}>
              <MenuItem
                onClick={() => {
                  movePlayer(true);
                }}
              >
                Move to Spectator
              </MenuItem>
            </div>
            <div style={s.contextItem}>
              <MenuItem
                onClick={() => {
                  isRed
                    ? removeFromRed(firestore, data.battletag, data)
                    : removeFromBlue(firestore, data.battletag, data);
                }}
              >
                Remove
              </MenuItem>
            </div>
          </div>
        </ContextMenu>
      </ContextMenuTrigger>
    </div>
  );
}

const s = {
  container: {
    flex: 1,
    display: "flex",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginBottom: 5,
    color: "white",
    fontWeight: "bold",
  },
  contextContainer: {
    backgroundColor: "black",
    border: "2px solid white",
    borderRadius: 3,
  },

  contextItem: {
    color: "white",
  },
};

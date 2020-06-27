import React, { useState } from "react";
import "../styling/spectator.css";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

export default function Spectator(props) {
  const { data } = props;

  /**
   * ********STATE*********
   */

  /**
   * *******FUNCTIONS******
   */

  const addToRed = () => {};

  const addToBlue = () => {};

  const remove = () => {};

  return (
    <div>
      <ContextMenuTrigger id={data.battletag}>
        {/* VISIBLE COMPONENT */}
        <div style={s.container}>
          <div style={s.specText}>
            <div>{data.battletag.toUpperCase()}</div>
            <div>{data.gamesPlayed}</div>
          </div>
        </div>
      </ContextMenuTrigger>
      {/* CONTEXT MENU */}

      <ContextMenu id={data.battletag}>
        <div style={s.contextContainer}>
          <div style={s.contextItem}>
            <MenuItem onClick={addToRed}>Add to Red</MenuItem>
          </div>
          <div style={s.contextItem}>
            <MenuItem onClick={addToBlue}>Add to Blue</MenuItem>
          </div>
          <div style={s.contextItem}>
            <MenuItem onClick={remove}>Remove</MenuItem>
          </div>
        </div>
      </ContextMenu>
    </div>
  );
}

const s = {
  container: {
    backgroundColor: "#eab900",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    margin: 5,
  },

  specText: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
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

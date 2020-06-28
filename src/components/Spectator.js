import React, { useState } from "react";
import "../styling/spectator.css";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { removeFromSpec, addToRed, addToBlue } from "../util/firebaseFunctions";

export default function Spectator(props) {
  const { data, firestore } = props;

  /**
   * ********STATE*********
   */

  return (
    <div>
      <ContextMenuTrigger id={data.battletag + "spec"}>
        {/* VISIBLE COMPONENT */}
        <div style={s.container}>
          <div style={s.specText}>
            <div>{data.battletag.toUpperCase()}</div>
            <div>{data.gamesPlayed}</div>
          </div>
        </div>
      </ContextMenuTrigger>
      {/* CONTEXT MENU */}
      <ContextMenu id={data.battletag + "spec"}>
        <div style={s.contextContainer}>
          <div style={s.contextItem}>
            <MenuItem
              onClick={() => {
                removeFromSpec(firestore, data.battletag);
                addToRed(firestore, data.battletag, data);
              }}
            >
              Add to Red
            </MenuItem>
          </div>
          <div style={s.contextItem}>
            <MenuItem
              onClick={() => {
                removeFromSpec(firestore, data.battletag);
                addToBlue(firestore, data.battletag, data);
              }}
            >
              Add to Blue
            </MenuItem>
          </div>
          <div style={s.contextItem}>
            <MenuItem
              onClick={() => {
                removeFromSpec(firestore, data.battletag);
                window.location.reload();
              }}
            >
              Remove
            </MenuItem>
          </div>
        </div>
      </ContextMenu>
    </div>
  );
}

const s = {
  container: {
    backgroundColor: "#eab900",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginBottom: 5,
  },

  specText: {
    flex: 1,
    display: "flex",
    fontWeight: "bold",
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

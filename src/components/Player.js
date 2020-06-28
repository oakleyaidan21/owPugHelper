import React from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

export default function Player(props) {
  const { data } = props;
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
              <MenuItem>
                Add to {props.color !== "#ec4053" ? "Red" : "Blue"}
              </MenuItem>
            </div>
            <div style={s.contextItem}>
              <MenuItem>Move to Spectator</MenuItem>
            </div>
            <div style={s.contextItem}>
              <MenuItem>Remove</MenuItem>
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
    margin: 5,
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

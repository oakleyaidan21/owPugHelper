import React from "react";
import "../styling/spectator.css";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import {
  removeFromSpec,
  addToRed,
  addToBlue,
  makeAdmin,
} from "../util/firebaseFunctions";

export default function Spectator(props) {
  const { data, firestore, sizes, isAdmin } = props;
  const roles = data.selectedRoles;

  const redDisabled = sizes[0] === 6;
  const blueDisabled = sizes[1] === 6;

  return (
    <div>
      <ContextMenuTrigger id={data.battletag + "spec"}>
        {/* VISIBLE COMPONENT */}
        <div style={s.container}>
          <div style={s.specText}>
            <div style={{ width: 120 }}>{data.battletag.toUpperCase()}</div>
            {/* ROLES */}
            <div style={s.roleContainer}>
              <div style={{ color: roles.Tank ? "white" : "black" }}>T</div>
              <div style={{ color: roles.Damage ? "white" : "black" }}>D</div>
              <div style={{ color: roles.Support ? "white" : "black" }}>S</div>
            </div>
            <div>{data.gamesPlayed}</div>
          </div>
        </div>
      </ContextMenuTrigger>
      {/* CONTEXT MENU */}
      {isAdmin && (
        <ContextMenu id={data.battletag + "spec"}>
          <div style={s.contextContainer}>
            <div style={s.contextItem}>
              <MenuItem
                onClick={() => {
                  makeAdmin(firestore, data);
                }}
              >
                Make Admin
              </MenuItem>
            </div>
            <div
              style={{
                ...s.contextItem,
                color: redDisabled ? "grey" : "white",
              }}
            >
              <MenuItem
                onClick={() => {
                  if (redDisabled) return;
                  removeFromSpec(firestore, data.battletag);
                  addToRed(firestore, data.battletag, data);
                }}
              >
                Add to Red
              </MenuItem>
            </div>
            <div
              style={{
                ...s.contextItem,
                color: blueDisabled ? "grey" : "white",
              }}
            >
              <MenuItem
                onClick={() => {
                  if (blueDisabled) return;
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
                  // window.location.reload();
                }}
              >
                Remove
              </MenuItem>
            </div>
          </div>
        </ContextMenu>
      )}
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

  roleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
  },
};

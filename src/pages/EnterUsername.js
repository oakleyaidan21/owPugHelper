import React, { useState } from "react";
import "../styling/EnterUsername.css";
import Form from "react-bootstrap/Form";
import * as firebase from "firebase";
import "firebase/firestore";
import { useHistory } from "react-router-dom";
import { adminPassword, createAdmin } from "../constants/hiddenConstants";

export default function EnterUsername(props) {
  const history = useHistory();
  const roles = ["Tank", "Damage", "Support"];

  const firestore = firebase.firestore();

  /**
   * *********STATE*********
   */
  const [battletag, setBattletag] = useState("");
  const [skillRating, setSkillRating] = useState(0);
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState({
    Tank: false,
    Damage: false,
    Support: false,
  });

  /**
   * *********FUNCTIONS*****
   */

  /**
   * Submits the entered battletag, sr, and roles to firebase
   */
  const submitBattletag = () => {
    if (!isSubmissionReady()) return;
    const playerInfo = {
      battletag: battletag,
      sr: skillRating,
      selectedRoles: selectedRoles,
      gamesPlayed: 0,
    };
    firestore
      .collection("spectators")
      .doc(battletag)
      .set(playerInfo)
      .then(() => {
        console.log("spectator added successfully!");
        history.push("/pug/" + createAdmin(battletag));
      })
      .catch((error) => {
        console.error("error adding spectator: ", error);
      });

    if (password === adminPassword) {
      firestore
        .collection("admins")
        .doc(battletag)
        .set({ ...playerInfo, match: createAdmin(battletag) })
        .then(history.push("/pug/" + createAdmin(battletag)));
    }
  };

  /**
   * Checks if the user has filled in the valid fields
   */
  const isSubmissionReady = () => {
    let result = true;
    let newErrorMessage = "";
    if (battletag.length < 1) {
      newErrorMessage += "\nPlease enter your full battletag";
      result = false;
    }
    if (parseInt(skillRating) < 1 || parseInt(skillRating > 5000)) {
      newErrorMessage += "\nPlease enter a valid skill rating";
      result = false;
    }
    let foundRole = false;
    if (selectedRoles.Tank || selectedRoles.Support || selectedRoles.Damage) {
      foundRole = true;
    }
    if (!foundRole) {
      newErrorMessage += "\nPlease select at least one role";
      result = false;
    }
    if (newErrorMessage.length > 0) alert(newErrorMessage);
    return result;
  };

  return (
    <div className="mainContainer">
      <div
        style={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Form>
          <Form.Group>
            <Form.Label>
              Enter your battle tag (i.e, Krusher99#11175)
            </Form.Label>
            <Form.Control
              size="lg"
              type="text"
              placeholder="Battle Tag"
              onChange={(e) => setBattletag(e.target.value)}
              value={battletag}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              Enter your Skill Rating (please be honest, 1-5000)
            </Form.Label>
            <Form.Control
              size="lg"
              type="text"
              placeholder="Skill Rating"
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  /^[0-9\b]+$/.test(e.target.value)
                ) {
                  setSkillRating(e.target.value);
                }
              }}
              value={skillRating}
            />
          </Form.Group>
          <div>Select your role(s)</div>
          <div style={s.roleContainer}>
            {roles.map((role) => {
              const selected = selectedRoles[role];
              return (
                <div
                  style={{ ...s.role, ...(selected && s.selectedRole) }}
                  onClick={() => {
                    let sel = selectedRoles;
                    sel[role] = selected ? false : true;
                    setSelectedRoles({ ...sel });
                  }}
                >
                  {role}
                </div>
              );
            })}
          </div>
          <Form.Group>
            <Form.Label>Enter admin password (optional)</Form.Label>
            <Form.Control
              size="lg"
              type="password"
              placeholder="Password"
              secur
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </Form.Group>
        </Form>
        <div onClick={submitBattletag} style={s.submitButton}>
          Submit
        </div>
      </div>
    </div>
  );
}

const s = {
  roleContainer: {
    display: "flex",
    flexDirection: "row",
  },
  role: {
    padding: 10,
    border: "2px solid lightgrey",
    borderRadius: 5,
    margin: 5,
    flex: 1,
    cursor: "pointer",
  },
  selectedRole: {
    backgroundColor: "#4087bd",
    color: "white",
    border: "2px solid #4087bd",
  },
  submitButton: {
    backgroundColor: "#4087bd",
    padding: 10,
    borderRadius: 3,
    cursor: "pointer",
    color: "white",
    marginTop: 10,
    fontWeight: "bold",
  },
};

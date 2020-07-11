import React, { useState } from "react";
import "../styling/EnterUsername.css";
import Form from "react-bootstrap/Form";
import * as firebase from "firebase";
import "firebase/firestore";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";

export default function EnterUsername(props) {
  const history = useHistory();
  const roles = ["Tank", "Damage", "Support"];

  const firestore = firebase.firestore();

  /**
   * *********STATE*********
   */
  const [battletag, setBattletag] = useState("");
  const [skillRating, setSkillRating] = useState(0);
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
    firestore
      .collection("spectators")
      .doc(battletag)
      .set({
        battletag: battletag,
        sr: skillRating,
        selectedRoles: selectedRoles,
        gamesPlayed: 0,
      })
      .then(() => {
        console.log("spectator added successfully!");
        history.push("/pug");
      })
      .catch((error) => {
        console.error("error adding spectator: ", error);
      });

    history.push("/pug");
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
      <div style={{ flexDirection: "column" }}>
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
          <Button variant="primary" type="submit" onClick={submitBattletag}>
            Submit
          </Button>
        </Form>
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
    backgroundColor: "blue",
    color: "white",
    border: "2px solid blue",
  },
};

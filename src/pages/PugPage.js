import React, { useEffect, useState } from "react";
import Player from "../components/Player.js";
import * as firebase from "firebase";
import "firebase/firestore";
import Spectator from "../components/Spectator.js";

export default function PugPage(props) {
  useEffect(() => {
    getCurrentTeams();
  }, []);

  /**
   * ********STATE**************
   */
  const [redTeam, setRedTeam] = useState([]);
  const [blueTeam, setBlueTeam] = useState([]);
  const [spectators, setSpectators] = useState([]);

  /**
   * ********FUNCTIONS**********
   */

  /**
   * Gets the current teams from firestore
   */
  const getCurrentTeams = async () => {
    const firestore = firebase.firestore();

    //spectators
    const spectatorRef = await firestore.collection("spectators").get();
    let spectatorData = spectatorRef.docs.map((doc) => doc.data());
    spectatorData.pop(); //remove dummy data
    setSpectators(spectatorData);
  };

  return (
    <div className="mainContainer">
      <div style={{ flexDirection: "column" }}>
        <div>PUGS!</div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={s.teamContainer}>
            <div>Team 1</div>
            {redTeam.map((player) => {
              return <Player data={player} color="#ec4053" />;
            })}
          </div>
          <div style={s.teamContainer}>
            <div>Team 2</div>
            {blueTeam.map((player) => {
              return <Player data={player} color="#5fd1ff" />;
            })}
          </div>
          <div style={s.spectatorContainer}>
            <div>Spectators</div>
            {spectators.map((spectator) => {
              return <Spectator data={spectator} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  teamContainer: {
    display: "flex",
    flexDirection: "column",
    margin: 10,
    width: 300,
  },
  spectatorContainer: {
    display: "flex",
    flexDirection: "column",
    margin: 10,
    width: 300,
  },
};

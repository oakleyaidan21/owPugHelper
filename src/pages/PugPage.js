import React, { useEffect, useState } from "react";
import Player from "../components/Player.js";
import * as firebase from "firebase";
import "firebase/firestore";
import Spectator from "../components/Spectator.js";

export default function PugPage(props) {
  const firestore = firebase.firestore();

  /**
   * Listens to firestore changes and updates the
   * teams accordingly
   */
  useEffect(() => {
    const unsubscribeRed = firestore
      .collection("redTeam")
      .onSnapshot((snap) => {
        let redData = snap.docs.map((doc) => doc.data());
        setRedTeam(redData);
      });
    const unsubscribeBlue = firestore
      .collection("blueTeam")
      .onSnapshot((snap) => {
        let blueData = snap.docs.map((doc) => doc.data());
        setBlueTeam(blueData);
      });
    const unsubscribeSpec = firestore
      .collection("spectators")
      .onSnapshot((snap) => {
        let specData = snap.docs.map((doc) => doc.data());
        setSpectators(specData);
      });
    return () => {
      unsubscribeRed();
      unsubscribeBlue();
      unsubscribeSpec();
    };
  }, [firestore]);

  /**
   * ********STATE**************
   */
  const [redTeam, setRedTeam] = useState([]);
  const [blueTeam, setBlueTeam] = useState([]);
  const [spectators, setSpectators] = useState([]);

  /**
   * ********FUNCTIONS**********
   */

  const emptyBlue = 6 - blueTeam.length;
  const emptyRed = 6 - redTeam.length;

  return (
    <div className="mainContainer" style={s.blurredImage}>
      <div style={{ flexDirection: "column" }}>
        <div style={s.owHeader}>
          <div style={{ fontWeight: "bold" }}>PICK UP GAME</div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
          <div style={s.matchContainer}>
            <div style={s.teamContainer}>
              <div style={s.teamHeader}>Team 1</div>
              {blueTeam.map((player) => {
                return (
                  <Player data={player} color="#5fd1ff" firestore={firestore} />
                );
              })}
              {[...Array(emptyBlue)].map((empty, i) => {
                return (
                  <div style={s.emptyPlayer} key={i + "blue"}>
                    EMPTY
                  </div>
                );
              })}
            </div>
            <div style={s.versus}>VS</div>
            <div style={s.teamContainer}>
              <div style={s.teamHeader}>Team 2</div>
              {redTeam.map((player) => {
                return (
                  <Player data={player} color="#ec4053" firestore={firestore} />
                );
              })}
              {[...Array(emptyRed)].map((empty, i) => {
                return (
                  <div style={s.emptyPlayer} key={i + "red"}>
                    EMPTY
                  </div>
                );
              })}
            </div>
          </div>
          <div style={s.spectatorDivider} />
          <div style={s.spectatorContainer}>
            <div style={s.teamHeader}>Spectators</div>
            {spectators.map((spectator) => {
              return <Spectator data={spectator} firestore={firestore} />;
            })}
          </div>
        </div>
        <div style={s.buttonContainer}>
          <div style={s.startButton}>START</div>
          <div style={s.clearButton}>CLEAR</div>
        </div>
      </div>
    </div>
  );
}

const s = {
  owHeader: {
    backgroundColor: "lightgrey",
    flex: 1,
    justifyContent: "space-between",

    padding: 20,
    display: "flex",
    flexDirection: "row",
  },

  teamContainer: {
    display: "flex",
    flexDirection: "column",
    width: 300,
  },
  spectatorContainer: {
    display: "flex",
    flexDirection: "column",
    width: 300,
  },

  blurredImage: {
    backgroundImage:
      "url('https://cdnb.artstation.com/p/assets/images/images/022/564/641/4k/helder-pinto-5kings-row.jpg')",
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  startButton: {
    padding: 10,
    backgroundColor: "#b98139",
    fontWeight: "bold",
    color: "white",
    margin: 10,
  },

  clearButton: {
    padding: 10,
    backgroundColor: "#4087bd",
    fontWeight: "bold",
    color: "white",
    margin: 10,
  },

  teamHeader: {
    fontWeight: "bold",
    color: "white",
  },

  matchContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 2,
  },

  versus: {
    fontSize: 50,
    display: "flex",
    fontWeight: "bold",
    margin: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  spectatorDivider: {
    width: 2,
    backgroundColor: "grey",
    height: 50,
    margin: 20,
  },

  emptyPlayer: {
    flex: 1,
    display: "flex",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginBottom: 5,
    color: "white",
    fontWeight: "bold",
    backgroundColor: "grey",
  },
};

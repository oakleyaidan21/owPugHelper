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
  const [balancedRed, setBalancedRed] = useState([]);
  const [balancedBlue, setBalancedBlue] = useState([]);
  const [spectators, setSpectators] = useState([]);

  /**
   * ********FUNCTIONS**********
   */

  /**
   * Adds 1 to the gamesPlayed field of
   * everyone on red and blue team
   */
  const startPug = () => {
    //red
    firestore
      .collection("redTeam")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            gamesPlayed: doc.data().gamesPlayed + 1,
          });
        });
      });

    //blue
    firestore
      .collection("blueTeam")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            gamesPlayed: doc.data().gamesPlayed + 1,
          });
        });
      });
  };

  /**
   * Puts everyone on each team into spectators
   */
  const clearPug = () => {
    const red = redTeam;
    const blue = blueTeam;
    setBalancedBlue([]);
    setBalancedRed([]);

    // delete all players from each team
    firestore
      .collection("redTeam")
      .get()
      .then((res) => {
        res.forEach((element) => {
          element.ref.delete();
        });
      });

    firestore
      .collection("blueTeam")
      .get()
      .then((res) => {
        res.forEach((element) => {
          element.ref.delete();
        });
      });

    //move them to spectators
    let batch = firestore.batch();

    for (let i = 0; i < red.length; i++) {
      let specRef = firestore.collection("spectators").doc(red[i].battletag);
      batch.set(specRef, { ...red[i] });
    }
    for (let i = 0; i < blue.length; i++) {
      let specRef = firestore.collection("spectators").doc(blue[i].battletag);
      batch.set(specRef, { ...blue[i] });
    }
    batch.commit();
  };

  /**
   * Balances using the greedy partition algorithm
   */
  const balancePug = () => {
    //put red and blue teams into one array
    let pool = [...redTeam, ...blueTeam];
    pool.sort((a, b) => {
      return parseInt(b.sr) - parseInt(a.sr);
    });

    let newRed = [];
    let newBlue = [];
    let sum_red = 0;
    let sum_blue = 0;
    for (let i = 0; i < pool.length; i++) {
      if (sum_red < sum_blue) {
        newRed.push(pool[i]);
        sum_red += parseInt(pool[i].sr);
      } else {
        newBlue.push(pool[i]);
        sum_blue += parseInt(pool[i].sr);
      }
    }

    setBalancedRed(newRed);
    setBalancedBlue(newBlue);
  };

  /**
   * Sets the balanced teams in the API
   */
  const setBalancedTeams = () => {
    //delete all members of red and blue team
    firestore
      .collection("redTeam")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      })
      .then(() => {
        firestore
          .collection("blueTeam")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.delete();
            });
          })
          .then(() => {
            let batch = firestore.batch();
            //add balancedRed and balancedBlue to red and blue teams in API
            for (let i = 0; i < balancedRed.length; i++) {
              let redRef = firestore
                .collection("redTeam")
                .doc(balancedRed[i].battletag);
              batch.set(redRef, { ...balancedRed[i] });
            }
            for (let i = 0; i < balancedBlue.length; i++) {
              let blueRef = firestore
                .collection("blueTeam")
                .doc(balancedBlue[i].battletag);
              batch.set(blueRef, { ...balancedBlue[i] });
            }

            batch.commit().then((b) => {
              console.log("b:", b);
            });

            setBalancedBlue([]);
            setBalancedRed([]);
          });
      });
  };

  const redToShow = balancedRed.length > 0 ? balancedRed : redTeam;
  const blueToShow = balancedBlue.length > 0 ? balancedBlue : blueTeam;

  const emptyBlue = 6 - blueToShow.length;
  const emptyRed = 6 - redToShow.length;

  let redAvg = 0;
  let blueAvg = 0;
  let redCount = { Tank: 0, Support: 0, Damage: 0 };
  let blueCount = { Tank: 0, Support: 0, Damage: 0 };

  //get averages and roles for each team
  for (let i = 0; i < redToShow.length; i++) {
    redAvg += parseInt(redToShow[i].sr);
    if (redToShow[i].selectedRoles.Tank) redCount.Tank += 1;
    if (redToShow[i].selectedRoles.Support) redCount.Support += 1;
    if (redToShow[i].selectedRoles.Damage) redCount.Damage += 1;
  }

  for (let i = 0; i < blueToShow.length; i++) {
    blueAvg += parseInt(blueToShow[i].sr);
    if (blueToShow[i].selectedRoles.Tank) blueCount.Tank += 1;
    if (blueToShow[i].selectedRoles.Support) blueCount.Support += 1;
    if (blueToShow[i].selectedRoles.Damage) blueCount.Damage += 1;
  }

  redAvg = (redAvg / redToShow.length).toFixed(0);
  blueAvg = (blueAvg / blueToShow.length).toFixed(0);

  return (
    <div className="mainContainer" style={s.blurredImage}>
      <div style={{ flexDirection: "column" }}>
        <div style={s.owHeader}>
          <div style={{ fontWeight: "bold" }}>PICK UP GAME</div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
          <div style={s.matchContainer}>
            <div style={{ display: "flex", flex: 1, flexDirection: "row" }}>
              <div style={s.teamContainer}>
                <div style={s.teamHeader}>Team 1</div>
                {blueToShow.map((player) => {
                  return (
                    <Player
                      data={player}
                      color="#5fd1ff"
                      firestore={firestore}
                      sizes={[redToShow.length, blueToShow.length]}
                    />
                  );
                })}
                {[...Array(emptyBlue)].map((empty, i) => {
                  return (
                    <div style={s.emptyPlayer} key={i + "blue"}>
                      EMPTY
                    </div>
                  );
                })}
                <div style={{ color: "white", fontWeight: "bold" }}>
                  SR Average: {blueAvg}
                </div>
                <div style={{ color: "white", fontWeight: "bold" }}>
                  {blueCount.Tank} tank(s)
                </div>
                <div style={{ color: "white", fontWeight: "bold" }}>
                  {blueCount.Support} support(s)
                </div>
                <div style={{ color: "white", fontWeight: "bold" }}>
                  {blueCount.Damage} damage player(s)
                </div>
              </div>
              <div style={s.versus}>VS</div>
              <div style={s.teamContainer}>
                <div style={s.teamHeader}>Team 2</div>
                {redToShow.map((player) => {
                  return (
                    <Player
                      data={player}
                      color="#ec4053"
                      firestore={firestore}
                      sizes={[redToShow.length, blueToShow.length]}
                    />
                  );
                })}
                {[...Array(emptyRed)].map((empty, i) => {
                  return (
                    <div style={s.emptyPlayer} key={i + "red"}>
                      EMPTY
                    </div>
                  );
                })}
                <div style={{ color: "white", fontWeight: "bold" }}>
                  SR Average: {redAvg}
                </div>
                <div style={{ color: "white", fontWeight: "bold" }}>
                  {redCount.Tank} tank(s)
                </div>
                <div style={{ color: "white", fontWeight: "bold" }}>
                  {redCount.Support} support(s)
                </div>
                <div style={{ color: "white", fontWeight: "bold" }}>
                  {redCount.Damage} damage player(s)
                </div>
              </div>
            </div>
            {/* BUTTONS */}
            <div style={s.buttonContainer}>
              <div style={s.startButton} onClick={startPug}>
                START
              </div>
              <div style={s.clearButton} onClick={clearPug}>
                CLEAR
              </div>
              <div
                style={s.clearButton}
                onClick={() => {
                  if (balancedBlue.length > 0) {
                    setBalancedBlue([]);
                    setBalancedRed([]);
                  } else {
                    balancePug();
                  }
                }}
              >
                {balancedBlue.length > 0 ? "UNDO" : "BALANCE"}
              </div>
              {balancedBlue.length > 0 && (
                <div style={s.clearButton} onClick={setBalancedTeams}>
                  SET
                </div>
              )}
            </div>
          </div>
          <div style={s.spectatorDivider} />
          <div style={s.spectatorContainer}>
            <div style={s.teamHeader}>Spectators</div>
            {spectators.map((spectator) => {
              return (
                <Spectator
                  data={spectator}
                  firestore={firestore}
                  sizes={[redToShow.length, blueToShow.length]}
                />
              );
            })}
          </div>
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
    maxHeight: 200,
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
    flexDirection: "column",
    flex: 2,
    height: 550,
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

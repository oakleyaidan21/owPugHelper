import React, { useState } from "react";
import "../styling/EnterUsername.css";
import Form from "react-bootstrap/Form";
import * as firebase from "firebase";
import "firebase/firestore";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";

export default function EnterUsername(props) {
  const history = useHistory();

  /**
   * *********STATE*********
   */
  const [battletag, setBattletag] = useState("");

  /**
   * *********FUNCTIONS*****
   */
  const getHTML = (url, callback) => {
    if (!window.XMLHttpRequest) return;

    let xhr = new XMLHttpRequest();

    // Setup callback
    xhr.onload = function () {
      if (callback && typeof callback === "function") {
        callback(this.responseXML);
      }
    };

    // Get the HTML
    xhr.open("GET", url);
    xhr.responseType = "document";
    xhr.send();
  };

  const submitBattletag = () => {
    // const url =
    //   "https://cors-anywhere.herokuap.com/https://www.overbuff.com/players/pc/" +
    //   battletag.replace("#", "-") +
    //   "/";
    // console.log("url:", url);
    // getHTML(url, (res) => {
    //   console.log(res);
    // });

    const sr = 3000;

    addToPug(sr);
  };

  const addToPug = (sr) => {
    const firestore = firebase.firestore();

    firestore
      .collection("spectators")
      .doc(battletag)
      .set({
        battletag: battletag,
        sr: sr,
        gamesPlayed: 0,
      })
      .then(() => {
        console.log("spectator added successfully!");
        history.push("/pugpage");
      })
      .catch((error) => {
        console.error("error adding spectator: ", error);
      });
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
          <Button variant="primary" type="submit" onClick={submitBattletag}>
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

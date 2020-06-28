/**
 * Adds a player to the spectator collection
 * @param {Firestore instance} firestore
 * @param {String} battletag the player in question
 * @param {Object} data the data to add
 */
export const addToSpec = (firestore, battletag, data) => {
  firestore
    .collection("spectators")
    .doc(battletag)
    .set({
      ...data,
    })
    .then(() => {
      window.location.reload();
    });
};

/**
 * Adds a player to the redTeam collection
 * @param {Firestore instance} firestore
 * @param {String} battletag the player in question
 * @param {Object} data the data to add
 */
export const addToRed = (firestore, battletag, data) => {
  firestore
    .collection("redTeam")
    .doc(battletag)
    .set({
      ...data,
    })
    .then(() => {
      window.location.reload();
    });
};

/**
 * Adds a player to the blueTeam collection
 * @param {Firestore instance} firestore
 * @param {String} battletag the player in question
 * @param {Object} data the data to add
 */
export const addToBlue = (firestore, battletag, data) => {
  firestore
    .collection("blueTeam")
    .doc(battletag)
    .set({
      ...data,
    })
    .then(() => {
      window.location.reload();
    });
};

/**
 * Removes a player from the spectator collection
 * @param {Firestore instance} firestore
 * @param {String} battletag the player in question
 */
export const removeFromSpec = (firestore, battletag) => {
  firestore
    .collection("spectators")
    .doc(battletag)
    .delete()
    .then(() => {
      window.location.reload();
    });
};

/**
 * Removes a player from the redTeam collection
 * @param {Firestore instance} firestore
 * @param {String} battletag the player in question
 */
export const removeFromRed = (firestore, battletag) => {
  firestore
    .collection("redTeam")
    .doc(battletag)
    .delete()
    .then(() => {
      window.location.reload();
    });
};

/**
 * Removes a player from the blueTeam collection
 * @param {Firestore instance} firestore
 * @param {String} battletag the player in question
 */
export const removeFromBlue = (firestore, battletag) => {
  firestore
    .collection("blueTeam")
    .doc(battletag)
    .delete()
    .then(() => {
      window.location.reload();
    });
};

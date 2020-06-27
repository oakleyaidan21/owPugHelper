import React from "react";

export default function Player(props) {
  const { data } = props;
  return (
    <div style={[s.container, { backgroundColor: props.color }]}>
      {data.battletag}
    </div>
  );
}

const s = {
  container: {
    flex: 1,
    display: "flex",
  },
};

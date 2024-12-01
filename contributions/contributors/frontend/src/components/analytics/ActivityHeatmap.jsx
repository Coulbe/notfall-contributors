import React from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";

const ActivityHeatmap = ({ data }) => {
  return (
    <div style={{ height: 400 }}>
      <ResponsiveHeatMap
        data={data}
        keys={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
        indexBy="hour"
        colors="nivo"
        margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
        axisTop={null}
        axisRight={null}
        axisBottom={{ legend: "Day of Week", legendPosition: "middle", legendOffset: 32 }}
        axisLeft={{ legend: "Hour", legendPosition: "middle", legendOffset: -40 }}
      />
    </div>
  );
};

export default ActivityHeatmap;

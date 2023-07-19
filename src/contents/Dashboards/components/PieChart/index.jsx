import PropTypes from "prop-types";

// Material Dashboard 2 React Examples
import PieChart from "examples/Charts/PieChart";

function PieCharts({ icon, title, height, description, chart }) {
  return <PieChart height={height} title={title} description={description} chart={chart} />;
}

PieCharts.defaultProps = {
  icon: { color: "info", component: "leaderboard" },
  title: "Pie Chart",
  height: "22.19rem",
};

PieCharts.propTypes = {
  icon: PropTypes.object,
  title: PropTypes.string,
  height: PropTypes.string,
  description: PropTypes.string,
  chart: PropTypes.object.isRequired,
};

export default PieCharts;

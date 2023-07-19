import { useMemo, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Line } from "react-chartjs-2";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React helper functions
import gradientChartLine from "assets/theme/functions/gradientChartLine";

// GradientLineChart configurations
import configs from "examples/Charts/LineCharts/GradientLineChart/configs";

// Material Dashboard 2 PRO React base styles
import colors from "assets/theme/base/colors";

function ChartSales({ title, description, height, chart }) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({});
  const { data, options } = chartData;

  useEffect(() => {
    const chartDatasets = chart.datasets
      ? chart.datasets.map((dataset) => ({
          ...dataset,
          tension: 0,
          pointRadius: 0,
          borderWidth: 4,
          borderColor: colors[dataset.color]
            ? colors[dataset.color || "dark"].main
            : colors.dark.main,
          fill: true,
          maxBarThickness: 6,
          backgroundColor: gradientChartLine(
            chartRef.current.children[0],
            colors[dataset.color] ? colors[dataset.color || "dark"].main : colors.dark.main
          ),
        }))
      : [];

    setChartData(configs(chart.labels || [], chartDatasets));
  }, [chart]);

  const renderChart = (
    <MDBox py={2} pr={2}>
      {title || description ? (
        <MDBox display="flex" px={description ? 1 : 0} pt={description ? 1 : 0}>
          <MDBox px={2}>
            {title && <MDTypography variant="h6">{title}</MDTypography>}
            <MDBox mb={2}>
              <MDTypography component="div" variant="button" color="text">
                {description}
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      ) : null}
      {useMemo(
        () => (
          <MDBox ref={chartRef} sx={{ height }}>
            <Line data={data} options={options} />
          </MDBox>
        ),
        [chartData, height]
      )}
    </MDBox>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}

// Setting default values for the props of GradientLineChart
ChartSales.defaultProps = {
  title: "",
  description: "",
  height: "19.125rem",
};

// Typechecking props for the GradientLineChart
ChartSales.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default ChartSales;

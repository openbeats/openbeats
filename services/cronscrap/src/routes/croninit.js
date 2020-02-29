import {
  Router
} from "express";
import {
  fetchTopCharts,
  englishTopCharts
} from "../core/topCharts";

const router = Router();

router.get("/inittopcharts", (req, res) => {
  setTimeout(() => {
    fetchTopCharts();
    englishTopCharts();
  }, 0);
  res.send({
    status: true,
    msg: "Topcharts fetch initiated"
  });
});

export default router;
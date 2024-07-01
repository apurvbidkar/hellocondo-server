import buildingsService from "../services/buildings.service.js";

class Buildings {
  constructor() {
    console.log("------------------Building controller class initiated------------------");
  }

  getAll = async (req, res) => {
    try {
      const buildings = await buildingsService.getAllBuildings(req.query);
      res.status(200).json({ ...buildings, status: "success", message: "data fetched successfully" });
    } catch (error) {
      return res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
    }
  };

  getDetails = async (req, res) => {
    try {
      const { id } = req.params;
      const building = await buildingsService.getBuilding(id);
      res.status(200).json({ status: "success", message: "data fetched successfully", data: building });
    } catch (error) {
      return res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
    }
  };

  getNearbyBuildings = async (req, res) => {
    res.status(200).json({ status: "success", data: {}, message: "data fetched successfully" });
  };

  getAmenities = async (req, res) => {
    res.status(200).json({ status: "success", data: {}, message: "data fetched successfully" });
  };

  getPolicies = async (req, res) => {
    res.status(200).json({ status: "success", data: {}, message: "data fetched successfully" });
  };
}

export default new Buildings();

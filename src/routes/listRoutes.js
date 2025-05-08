import express from "express";
import { authorizeRoles, verifyToken } from "../middleware/auth.js";
import {
  createAgribusiness,
  createAgriculture,
  createAnimal,
  createCrops,
  createEducation,
  createIrrigation,
  createMachine,
  deleteAgribusinessById,
  deleteAgricultureById,
  deleteAnimalById,
  deleteCropsById,
  deleteEducationById,
  deleteIrrigationById,
  deleteMachineById,
  getAgribusiness,
  getAgribusinessById,
  getAgriculture,
  getAgricultureById,
  getAnimal,
  getAnimalById,
  getCrops,
  getCropsById,
  getEducation,
  getEducationById,
  getIrrigation,
  getIrrigationById,
  getMachine,
  getMachineById,
  updateAgribusinessById,
  updateAgricultureById,
  updateAnimalById,
  updateCropsById,
  updateEducationById,
  updateIrrigationById,
  updateMachineById,
} from "../controllers/listController.js";

const router = express.Router();

//Education
router.post(
  "/create-education",
  verifyToken,
  authorizeRoles("admin"),
  createEducation
);

router.get(
  "/get-education",
  verifyToken,
  authorizeRoles("admin", "user"),
  getEducation
);

router.get(
  "/get-education-byid",
  verifyToken,
  authorizeRoles("admin"),
  getEducationById
);

router.delete(
  "/delete-education",
  verifyToken,
  authorizeRoles("admin"),
  deleteEducationById
);

router.put(
  "/update-education",
  verifyToken,
  authorizeRoles("admin"),
  updateEducationById
);

//Irrigation
router.post(
  "/create-irrigation",
  verifyToken,
  authorizeRoles("admin"),
  createIrrigation
);

router.get(
  "/get-irrigation",
  verifyToken,
  authorizeRoles("admin", "user"),
  getIrrigation
);

router.get(
  "/get-irrigation-byid",
  verifyToken,
  authorizeRoles("admin"),
  getIrrigationById
);

router.put(
  "/update-irrigation",
  verifyToken,
  authorizeRoles("admin"),
  updateIrrigationById
);

router.delete(
  "/delete-irrigation",
  verifyToken,
  authorizeRoles("admin"),
  deleteIrrigationById
);

//ANIMAL

router.post(
  "/create-animal",
  verifyToken,
  authorizeRoles("admin"),
  createAnimal
);

router.get(
  "/get-animal",
  verifyToken,
  authorizeRoles("admin", "user"),
  getAnimal
);

router.get(
  "/get-animal-byid",
  verifyToken,
  authorizeRoles("admin"),
  getAnimalById
);

router.put(
  "/update-animal",
  verifyToken,
  authorizeRoles("admin"),
  updateAnimalById
);

router.delete(
  "/delete-animal",
  verifyToken,
  authorizeRoles("admin"),
  deleteAnimalById
);

//Agribusiness

router.post(
  "/create-agribusiness",
  verifyToken,
  authorizeRoles("admin"),
  createAgribusiness
);

router.get(
  "/get-agribusiness",
  verifyToken,
  authorizeRoles("admin", "user"),
  getAgribusiness
);

router.get(
  "/get-agribusiness-byid",
  verifyToken,
  authorizeRoles("admin"),
  getAgribusinessById
);

router.put(
  "/update-agribusiness",
  verifyToken,
  authorizeRoles("admin"),
  updateAgribusinessById
);

router.delete(
  "/delete-agribusiness",
  verifyToken,
  authorizeRoles("admin"),
  deleteAgribusinessById
);

//Machine
router.post(
  "/create-machine",
  verifyToken,
  authorizeRoles("admin"),
  createMachine
);

router.get(
  "/get-machine",
  verifyToken,
  authorizeRoles("admin", "user"),
  getMachine
);

router.get(
  "/get-machine-byid",
  verifyToken,
  authorizeRoles("admin"),
  getMachineById
);

router.put(
  "/update-machine",
  verifyToken,
  authorizeRoles("admin"),
  updateMachineById
);

router.delete(
  "/delete-machine",
  verifyToken,
  authorizeRoles("admin"),
  deleteMachineById
);

//Agriculture

router.post(
  "/create-agriculture",
  verifyToken,
  authorizeRoles("admin"),
  createAgriculture
);

router.get(
  "/get-agriculture",
  verifyToken,
  authorizeRoles("admin", "user"),
  getAgriculture
);

router.get(
  "/get-agriculture-byid",
  verifyToken,
  authorizeRoles("admin"),
  getAgricultureById
);

router.put(
  "/update-agriculture",
  verifyToken,
  authorizeRoles("admin"),
  updateAgricultureById
);

router.delete(
  "/delete-agriculture",
  verifyToken,
  authorizeRoles("admin"),
  deleteAgricultureById
);

//Crops

router.post("/create-crops", verifyToken, authorizeRoles("admin"), createCrops);

router.get(
  "/get-crops",
  verifyToken,
  authorizeRoles("admin", "user"),
  getCrops
);

router.get(
  "/get-crops-byid",
  verifyToken,
  authorizeRoles("admin"),
  getCropsById
);

router.put(
  "/update-crops",
  verifyToken,
  authorizeRoles("admin"),
  updateCropsById
);

router.delete(
  "/delete-crops",
  verifyToken,
  authorizeRoles("admin"),
  deleteCropsById
);

export default router;

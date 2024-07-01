import express from "express";
import {
  changePassword,
  getUsers,
  logOut,
  registerUser,
  editUser,
  getUser,
  changeUserStatus,
  deleteUser,
} from "../../controllers/user.controller.js";
import { checkAuthorization } from "../../middlewares/authorizeMiddleware.js";
import { Action, Section } from "../../types/index.js";
import { isValidUUID } from "../../middlewares/validationMiddleware.js";

const userRoutes = express.Router();

userRoutes.get("/users", checkAuthorization(Section.USER_MANAGEMENT, Action.READ), getUsers);
userRoutes.get("/users/:id", checkAuthorization(Section.USER_MANAGEMENT, Action.READ), isValidUUID("id"), getUser);
userRoutes.delete(
  "/users/:id",
  checkAuthorization(Section.USER_MANAGEMENT, Action.WRITE),
  isValidUUID("id"),
  deleteUser,
);
userRoutes.post("/users", checkAuthorization(Section.USER_MANAGEMENT, Action.WRITE), registerUser);
userRoutes.put("/users", checkAuthorization(Section.USER_MANAGEMENT, Action.WRITE), editUser);
userRoutes.put("/users/:id/toggle-status", checkAuthorization(Section.USER_MANAGEMENT, Action.WRITE), changeUserStatus);
userRoutes.post("/change-password", changePassword);
userRoutes.post("/logout", logOut);

export default userRoutes;

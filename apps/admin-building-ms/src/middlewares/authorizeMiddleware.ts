import { NextFunction, Response } from "express";
import {
  Action,
  RequestWithLoggedInUser,
  Section,
  UserPermissions,
  resStatusType,
} from "../types/authorization.types.js";

function userHasPermission(permissions: UserPermissions[], section: Section, action: Action): boolean {
  return permissions.some((perm) => {
    if (perm.section === section) {
      if (
        (action === Action.READ && perm.isRead) ||
        (action === Action.WRITE && perm.isWrite) ||
        (action === Action.DELETE && perm.isDelete)
      ) {
        return true;
      }
    }
    return perm.subPermissions.length > 0 && userHasPermission(perm.subPermissions, section, action);
  });
}

export function checkAuthorization(requiredSection: Section, requiredAction: Action) {
  return (req: RequestWithLoggedInUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: resStatusType.Failed,
        message: "You are not authorized to access this resource",
      });
    }

    const hasRequiredPermission = userHasPermission(req.user.permissions, requiredSection, requiredAction);

    if (!hasRequiredPermission) {
      return res.status(403).json({
        status: resStatusType.Failed,
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
}

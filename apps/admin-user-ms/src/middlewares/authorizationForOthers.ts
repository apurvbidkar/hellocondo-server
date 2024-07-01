import { Response } from "express";
import { Action, RequestWithLoggedInUser, resStatusType, Section } from "../types/index.js";
import { UserPermissions } from "../types/permission.types.js";

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

export function checkAuthorizationForOthers(req: RequestWithLoggedInUser, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      status: resStatusType.Failed,
      message: "You are not authorized to access this resource",
    });
  }

  const requiredSection = req.body.section as Section;
  const requiredAction = req.body.action as Action;

  const hasRequiredPermission = userHasPermission(req.user.permissions, requiredSection, requiredAction);

  if (!hasRequiredPermission) {
    return res.status(403).json({
      status: resStatusType.Failed,
      message: "You do not have permission to perform or access this resource",
    });
  }

  return res.status(200).json({
    status: resStatusType.Success,
    data: { user: req.user },
    message: "You have permission to access this resource",
  });
}

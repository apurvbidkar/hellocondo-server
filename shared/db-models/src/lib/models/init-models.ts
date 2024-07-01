import type { Sequelize } from "sequelize";
import type { activityLogsAttributes, activityLogsCreationAttributes } from "./activityLogs.js";
import { activityLogs as _activityLogs } from "./activityLogs.js";
import type { ahrefVolumeKdAttributes, ahrefVolumeKdCreationAttributes } from "./ahrefVolumeKd.js";
import { ahrefVolumeKd as _ahrefVolumeKd } from "./ahrefVolumeKd.js";
import type { amenitiesAttributes, amenitiesCreationAttributes } from "./amenities.js";
import { amenities as _amenities } from "./amenities.js";
import type { appModuleTypesAttributes, appModuleTypesCreationAttributes } from "./appModuleTypes.js";
import { appModuleTypes as _appModuleTypes } from "./appModuleTypes.js";
import type { appUserActionTypesAttributes, appUserActionTypesCreationAttributes } from "./appUserActionTypes.js";
import { appUserActionTypes as _appUserActionTypes } from "./appUserActionTypes.js";
import type { buildingMediaAttributes, buildingMediaCreationAttributes } from "./buildingMedia.js";
import { buildingMedia as _buildingMedia } from "./buildingMedia.js";
import type { buildingPsfHoaAttributes, buildingPsfHoaCreationAttributes } from "./buildingPsfHoa.js";
import { buildingPsfHoa as _buildingPsfHoa } from "./buildingPsfHoa.js";
import type { buildingsAttributes, buildingsCreationAttributes } from "./buildings.js";
import { buildings as _buildings } from "./buildings.js";
import type { commissionsIncPoiAttributes, commissionsIncPoiCreationAttributes } from "./commissionsIncPoi.js";
import { commissionsIncPoi as _commissionsIncPoi } from "./commissionsIncPoi.js";
import type { geoHierarchyAttributes, geoHierarchyCreationAttributes } from "./geoHierarchy.js";
import { geoHierarchy as _geoHierarchy } from "./geoHierarchy.js";
import type { inquiriesAttributes, inquiriesCreationAttributes } from "./inquiries.js";
import { inquiries as _inquiries } from "./inquiries.js";
import { listingsData as _listingsData } from "./listingsData.js";
import type { menuPermissionsAttributes, menuPermissionsCreationAttributes } from "./menuPermissions.js";
import { menuPermissions as _menuPermissions } from "./menuPermissions.js";
import type { menusAttributes, menusCreationAttributes } from "./menus.js";
import { menus as _menus } from "./menus.js";
import type { neighborhoodPsfHoaAttributes, neighborhoodPsfHoaCreationAttributes } from "./neighborhoodPsfHoa.js";
import { neighborhoodPsfHoa as _neighborhoodPsfHoa } from "./neighborhoodPsfHoa.js";
import type { policiesAttributes, policiesCreationAttributes } from "./policies.js";
import { policies as _policies } from "./policies.js";
import type { speaktoAgentAttributes, speaktoAgentCreationAttributes } from "./speaktoAgent.js";
import { speaktoAgent as _speaktoAgent } from "./speaktoAgent.js";
import type { subscribeAttributes, subscribeCreationAttributes } from "./subscribe.js";
import { subscribe as _subscribe } from "./subscribe.js";
import type { usStateZipCodesAttributes, usStateZipCodesCreationAttributes } from "./usStateZipCodes.js";
import { usStateZipCodes as _usStateZipCodes } from "./usStateZipCodes.js";
import type { userDataPermissionAttributes, userDataPermissionCreationAttributes } from "./userDataPermission.js";
import { userDataPermission as _userDataPermission } from "./userDataPermission.js";
import type { userRolesAttributes, userRolesCreationAttributes } from "./userRoles.js";
import { userRoles as _userRoles } from "./userRoles.js";
import type { usersAttributes, usersCreationAttributes } from "./users.js";
import { users as _users } from "./users.js";
import { groupAmenities as _groupAmenities } from "./groupAmenities.js";
import type { groupAmenitiesAttributes, groupAmenitiesCreationAttributes } from "./groupAmenities.js";
import { groupPolicies as _groupPolicies } from "./groupPolicies.js";
import type { groupPoliciesAttributes, groupPoliciesCreationAttributes } from "./groupPolicies.js";

export {
  _activityLogs as activityLogs,
  _ahrefVolumeKd as ahrefVolumeKd,
  _amenities as amenities,
  _appModuleTypes as appModuleTypes,
  _appUserActionTypes as appUserActionTypes,
  _buildingMedia as buildingMedia,
  _buildingPsfHoa as buildingPsfHoa,
  _buildings as buildings,
  _commissionsIncPoi as commissionsIncPoi,
  _geoHierarchy as geoHierarchy,
  _inquiries as inquiries,
  _listingsData as listingsData,
  _menuPermissions as menuPermissions,
  _menus as menus,
  _neighborhoodPsfHoa as neighborhoodPsfHoa,
  _policies as policies,
  _speaktoAgent as speaktoAgent,
  _subscribe as subscribe,
  _userDataPermission as userDataPermission,
  _userRoles as userRoles,
  _users as users,
  _usStateZipCodes as usStateZipCodes,
  _groupAmenities as groupAmenities,
  _groupPolicies as groupPolicies,
};

export type {
  activityLogsAttributes,
  activityLogsCreationAttributes,
  ahrefVolumeKdAttributes,
  ahrefVolumeKdCreationAttributes,
  amenitiesAttributes,
  amenitiesCreationAttributes,
  appModuleTypesAttributes,
  appModuleTypesCreationAttributes,
  appUserActionTypesAttributes,
  appUserActionTypesCreationAttributes,
  buildingMediaAttributes,
  buildingMediaCreationAttributes,
  buildingPsfHoaAttributes,
  buildingPsfHoaCreationAttributes,
  buildingsAttributes,
  buildingsCreationAttributes,
  commissionsIncPoiAttributes,
  commissionsIncPoiCreationAttributes,
  geoHierarchyAttributes,
  geoHierarchyCreationAttributes,
  inquiriesAttributes,
  inquiriesCreationAttributes,
  menuPermissionsAttributes,
  menuPermissionsCreationAttributes,
  menusAttributes,
  menusCreationAttributes,
  neighborhoodPsfHoaAttributes,
  neighborhoodPsfHoaCreationAttributes,
  policiesAttributes,
  policiesCreationAttributes,
  speaktoAgentAttributes,
  speaktoAgentCreationAttributes,
  subscribeAttributes,
  subscribeCreationAttributes,
  userDataPermissionAttributes,
  userDataPermissionCreationAttributes,
  userRolesAttributes,
  userRolesCreationAttributes,
  usersAttributes,
  usersCreationAttributes,
  usStateZipCodesAttributes,
  usStateZipCodesCreationAttributes,
  groupAmenitiesAttributes,
  groupAmenitiesCreationAttributes,
  groupPoliciesAttributes,
  groupPoliciesCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const activityLogs = _activityLogs.initModel(sequelize);
  const ahrefVolumeKd = _ahrefVolumeKd.initModel(sequelize);
  const amenities = _amenities.initModel(sequelize);
  const appModuleTypes = _appModuleTypes.initModel(sequelize);
  const appUserActionTypes = _appUserActionTypes.initModel(sequelize);
  const buildingMedia = _buildingMedia.initModel(sequelize);
  const buildingPsfHoa = _buildingPsfHoa.initModel(sequelize);
  const buildings = _buildings.initModel(sequelize);
  const commissionsIncPoi = _commissionsIncPoi.initModel(sequelize);
  const geoHierarchy = _geoHierarchy.initModel(sequelize);
  const inquiries = _inquiries.initModel(sequelize);
  const menuPermissions = _menuPermissions.initModel(sequelize);
  const menus = _menus.initModel(sequelize);
  const listingsData = _listingsData.initModel(sequelize);
  const neighborhoodPsfHoa = _neighborhoodPsfHoa.initModel(sequelize);
  const policies = _policies.initModel(sequelize);
  const speaktoAgent = _speaktoAgent.initModel(sequelize);
  const subscribe = _subscribe.initModel(sequelize);
  const usStateZipCodes = _usStateZipCodes.initModel(sequelize);
  const userDataPermission = _userDataPermission.initModel(sequelize);
  const userRoles = _userRoles.initModel(sequelize);
  const users = _users.initModel(sequelize);
  const groupAmenities = _groupAmenities.initModel(sequelize);
  const groupPolicies = _groupPolicies.initModel(sequelize);

  activityLogs.belongsTo(appModuleTypes, { as: "module", foreignKey: "module_id" });
  appModuleTypes.hasMany(activityLogs, { as: "activity_logs", foreignKey: "module_id" });
  activityLogs.belongsTo(appUserActionTypes, { as: "action", foreignKey: "action_id" });
  appUserActionTypes.hasMany(activityLogs, { as: "activity_logs", foreignKey: "action_id" });
  // buildingMedia.belongsTo(buildings, { as: "b", foreignKey: "b_id" });
  // buildings.hasMany(buildingMedia, { as: "building_media", foreignKey: "b_id" });
  buildings.belongsTo(geoHierarchy, { as: "geo", foreignKey: "geo_id" });
  geoHierarchy.hasMany(buildings, { as: "buildings", foreignKey: "geo_id" });
  menuPermissions.belongsTo(menus, { as: "menu", foreignKey: "menu_id" });
  menus.hasMany(menuPermissions, { as: "menu_permissions", foreignKey: "menu_id" });
  menus.belongsTo(menus, { as: "child_of_menu", foreignKey: "child_of" });
  menus.hasMany(menus, { as: "menus", foreignKey: "child_of" });
  users.belongsTo(userRoles, { as: "role", foreignKey: "role_id" });
  userRoles.hasMany(users, { as: "users", foreignKey: "role_id" });
  activityLogs.belongsTo(users, { as: "user_activity_logs", foreignKey: "user_id" });
  users.hasMany(activityLogs, { as: "activity_logs", foreignKey: "user_id" });
  buildingMedia.belongsTo(users, { as: "created_by_user", foreignKey: "created_by" });
  users.hasMany(buildingMedia, { as: "building_media", foreignKey: "created_by" });
  buildingMedia.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by" });
  users.hasMany(buildingMedia, { as: "updated_by_building_media", foreignKey: "updated_by" });
  buildings.belongsTo(users, { as: "created_by_user", foreignKey: "created_by" });
  users.hasMany(buildings, { as: "buildings", foreignKey: "created_by" });
  buildings.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by" });
  users.hasMany(buildings, { as: "updated_by_buildings", foreignKey: "updated_by" });
  buildings.belongsTo(users, { as: "deleted_by_user", foreignKey: "deleted_by" });
  users.hasMany(buildings, { as: "deleted_by_buildings", foreignKey: "deleted_by" });
  menuPermissions.belongsTo(users, { as: "user_menu_permissions", foreignKey: "user_id" });
  users.hasMany(menuPermissions, { as: "menu_permissions", foreignKey: "user_id" });
  userDataPermission.belongsTo(users, { as: "user_data_permission", foreignKey: "user_id" });
  users.hasMany(userDataPermission, { as: "user_data_permissions", foreignKey: "user_id" });
  userDataPermission.belongsTo(users, { as: "created_by_user", foreignKey: "created_by" });
  users.hasMany(userDataPermission, { as: "created_by_user_data_permissions", foreignKey: "created_by" });
  userDataPermission.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by" });
  users.hasMany(userDataPermission, { as: "updated_by_user_data_permissions", foreignKey: "updated_by" });
  users.hasMany(userDataPermission, { as: "user_user_data_permissions", foreignKey: "user_id" });
  users.belongsTo(users, { as: "created_by_user", foreignKey: "created_by" });
  // users.belongsTo(users, { as: "deleted_by_users", foreignKey: "deleted_by" });
  // users.hasMany(users, { as: "deleted_by_users", foreignKey: "deleted_by" });
  users.hasMany(users, { as: "users", foreignKey: "created_by" });
  users.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by" });
  users.hasMany(users, { as: "updated_by_users", foreignKey: "updated_by" });
  listingsData.belongsTo(buildings, { as: "building", foreignKey: "building_id" });
  buildings.hasMany(listingsData, { as: "listings_data", foreignKey: "building_id" });
  amenities.belongsTo(groupAmenities, { as: "group", foreignKey: "group_id" });
  groupAmenities.hasMany(amenities, { as: "amenities", foreignKey: "group_id" });
  amenities.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by" });
  users.hasMany(amenities, { as: "amenities", foreignKey: "updated_by" });
  policies.belongsTo(groupPolicies, { as: "group_policies", foreignKey: "group_id" });
  groupPolicies.hasMany(policies, { as: "policies", foreignKey: "group_id" });
  policies.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by"});
  users.hasMany(policies, { as: "policies", foreignKey: "updated_by"});
  //----------------------- Custom Association -----------------------
  buildings.hasOne(buildingMedia, { as: "building_media", foreignKey: "b_id", sourceKey: "id" });

  return {
    activityLogs: activityLogs,
    ahrefVolumeKd: ahrefVolumeKd,
    amenities: amenities,
    appModuleTypes: appModuleTypes,
    appUserActionTypes: appUserActionTypes,
    buildingMedia: buildingMedia,
    buildingPsfHoa: buildingPsfHoa,
    buildings: buildings,
    commissionsIncPoi: commissionsIncPoi,
    geoHierarchy: geoHierarchy,
    inquiries: inquiries,
    menuPermissions: menuPermissions,
    menus: menus,
    listingsData: listingsData,
    neighborhoodPsfHoa: neighborhoodPsfHoa,
    policies: policies,
    speaktoAgent: speaktoAgent,
    subscribe: subscribe,
    usStateZipCodes: usStateZipCodes,
    userDataPermission: userDataPermission,
    userRoles: userRoles,
    users: users,
    groupAmenities: groupAmenities,
    groupPolicies: groupPolicies,
  };
}

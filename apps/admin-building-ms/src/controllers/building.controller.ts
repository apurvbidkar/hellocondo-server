import { sequelize, sq } from "@condo-server/db-models";
import { Request, Response } from "express";
import {
  buildingsData,
  checkBuildingInBuildingMedia,
  findMediaCoverage,
  formatFilterDropdownData,
  generateFilterDropdownQuery,
  generateMediaCoverage,
  generateWhereCondition,
  getAssignedBuildingsForUserQueryParams,
  getUserAssignedBuildings,
  handleDeletedImages,
  handleDeletedVideos,
  handleNewImages,
  handleNewVideos,
  updateBuildingDetails,
  updateBuildingMediaDetails,
  validateFilterDropdownValuesQueryParams,
  validateGetBuildingsQueryParams,
  validateMediaCoverageQueryParams,
  validateUploadBuildingMediaPayload,
} from "../services/building.services.js";
import {
  getAllPermittedLocations,
  getBuildingsOnAssignedLocations,
  getPermittedBuildingIds,
  getPermittedLocations,
} from "../services/userDataPermission.services.js";
import {
  DropdownValuesFilterParams,
  FilterConditionForGetBuildings,
  FilterDropdownResponse,
  GetBuildingsParams,
  MediaCoverageQueryParams,
  MediaCoverageQueryResponse,
  QueryWithReplacements,
  UploadBuildingMediaParamsType,
  getAssignedBuildingsForUserParams,
} from "../types/buildings.types.js";
import { GetLocationsResponse, ObjectId } from "../types/dataPermission.types.js";
import { RequestWithUser } from "../types/index.js";
import {
  BuildingsResponse,
  FilterDropdownQueryResponse,
  UserBuildingsResponse,
} from "../viewModel/buildings.viewModel.js";

export const getBuildings = async (req: Request, res: Response): Promise<void> => {
  try {
    if (typeof req.query?.filters === "string") {
      req.query.filters = JSON.parse(req.query.filters);
    }
    const value: GetBuildingsParams = await validateGetBuildingsQueryParams(req.query);
    const { page, limit, filters, userId }: GetBuildingsParams = value;
    const offset: number = (page - 1) * limit;
    const name: string = filters.name;
    const whereCondition: FilterConditionForGetBuildings = await generateWhereCondition(filters);
    let permittedBuildingIds: string[] | [] = [];
    if (userId) {
      permittedBuildingIds = await getPermittedBuildingIds(userId);
    }

    const buildings: BuildingsResponse = await buildingsData(
      whereCondition,
      offset,
      limit,
      name,
      permittedBuildingIds?.length ? permittedBuildingIds : null,
    );
    res.status(200).json({
      status: "success",
      data: buildings,
    });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

export const getMediaCoverage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (typeof req.query?.filters === "string") {
      req.query.filters = JSON.parse(req.query.filters);
    }
    const value: MediaCoverageQueryParams = await validateMediaCoverageQueryParams(req.query);
    const { filters }: MediaCoverageQueryParams = value;
    const whereCondition: FilterConditionForGetBuildings = await generateWhereCondition(filters);
    const mediaCoverage: MediaCoverageQueryResponse = await findMediaCoverage(filters.name, whereCondition);
    const generatedMediaCoverage = await generateMediaCoverage(mediaCoverage);
    res.status(200).json({ status: "success", data: generatedMediaCoverage });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

export const getFilterDropdownValues = async (req: Request, res: Response): Promise<void> => {
  try {
    if (typeof req.query?.filters === "string") {
      req.query.filters = JSON.parse(req.query.filters);
    }
    const value: DropdownValuesFilterParams = await validateFilterDropdownValuesQueryParams(req.query);
    const { query, replacements }: QueryWithReplacements = await generateFilterDropdownQuery(value);
    const results: FilterDropdownQueryResponse[] = await sequelize.query(query, {
      type: sq.QueryTypes.SELECT,
      replacements,
    });
    let data: FilterDropdownResponse = await formatFilterDropdownData(results);
    res.status(200).json({ status: "success", data: data });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

export const getAssignedBuildingsForUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const value: getAssignedBuildingsForUserParams = await getAssignedBuildingsForUserQueryParams(req.query);
    const { page, limit, userId }: getAssignedBuildingsForUserParams = value;
    const offset: number = (page - 1) * limit;
    let permittedBuildingIds = await getPermittedBuildingIds(userId);
    const buildings: UserBuildingsResponse = await getUserAssignedBuildings(permittedBuildingIds, offset, limit);
    res.status(200).json({
      status: "success",
      data: buildings,
    });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

export const uploadBuildingMedia = async (req: RequestWithUser, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  try {
    let createdBy = req?.user?.id;
    const value: UploadBuildingMediaParamsType = await validateUploadBuildingMediaPayload(req.body);
    let {
      bId,
      images,
      newImages,
      deletedImages,
      videos,
      newVideos,
      deletedVideos,
      videoTourUrl,
    }: UploadBuildingMediaParamsType = value;

    if (newImages.length) {
      images = await handleNewImages(newImages, bId, images, process.env.PRIMARY_S3_BUCKET);
    }

    if (deletedImages.length) {
      images = await handleDeletedImages(deletedImages, images, process.env.PRIMARY_S3_BUCKET);
    }

    if (newVideos.length) {
      videos = await handleNewVideos(newVideos, bId, videos, process.env.PRIMARY_S3_BUCKET);
    }

    if (deletedVideos.length) {
      videos = await handleDeletedVideos(deletedVideos, videos, process.env.PRIMARY_S3_BUCKET);
    }

    const [building]: [any, boolean] = await checkBuildingInBuildingMedia(
      bId,
      images,
      videos,
      videoTourUrl,
      transaction,
      createdBy,
    );

    if (building) {
      await updateBuildingMediaDetails(building, images, videos, videoTourUrl, transaction, createdBy);
    }
    let hasMediaAttachments = false;
    hasMediaAttachments = images?.length || videos?.length || videoTourUrl?.length ? true : false;
    const updatedRowsCount: number = await updateBuildingDetails(hasMediaAttachments, bId, transaction);
    await transaction.commit();
    res.status(200).json({
      status: "success",
      message: updatedRowsCount > 0 ? "Media Updated Successfully" : "Nothing to update",
    });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

export const getUserAssignedLocations = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const value: getAssignedBuildingsForUserParams = await getAssignedBuildingsForUserQueryParams(req.query);
    const { page, limit, userId }: getAssignedBuildingsForUserParams = value;
    const offset: number = (page - 1) * limit;
    let permittedLocations: GetLocationsResponse | [] = await getPermittedLocations(userId, offset, limit);
    res.status(200).json({
      status: "success",
      data: permittedLocations,
    });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

export const getBuildingsFromLocations = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const value: getAssignedBuildingsForUserParams = await getAssignedBuildingsForUserQueryParams(req.query);
    const { page, limit, userId }: getAssignedBuildingsForUserParams = value;
    const offset: number = (page - 1) * limit;
    const allLocations: ObjectId[] | [] = await getAllPermittedLocations(userId);
    const buildingFromLocations: UserBuildingsResponse = await getBuildingsOnAssignedLocations(
      allLocations,
      offset,
      limit,
    );
    res.status(200).json({
      status: "success",
      data: buildingFromLocations,
    });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ status: "failed", message: error?.message || "Error" });
  }
};

import { db, sq } from "@condo-server/db-models";
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import {
  GetBuildingsFilterParams,
  GetBuildingsParams,
  FilterConditionForGetBuildings,
  getAssignedBuildingsForUserParams,
  DropdownValuesFilterParams,
  FilterDropdownResponse,
  DropdownFilterValuesParams,
  MediaCoverageQueryParams,
  MediaCoverageQueryResponse,
  MediaCounts,
  QueryWithReplacements,
  UploadBuildingMediaParamsType,
  Media,
  DeletedMedia,
  Video,
  DeletedVideo,
} from "../types/buildings.types.js";
import { HttpError } from "../errors/index.js";
import {
  BuildingsResponse,
  UserBuildingsResponse,
  FilterDropdownQueryResponse,
} from "../viewModel/buildings.viewModel.js";
import {
  getBuildingsSchema,
  getAssignedBuildingsForUserSchema,
  dropdownFilterValuesSchema,
  mediaCoverageSchema,
  uploadBuildingMediaSchema,
} from "../validators/index.js";

const s3Client: S3Client = new S3Client({ region: process.env.AWS_REGION });

export const validateGetBuildingsQueryParams = async (queryParams: GetBuildingsParams): Promise<GetBuildingsParams> => {
  const { error, value } = getBuildingsSchema.validate(queryParams);
  if (error) {
    throw new HttpError(400, error.details[0].message);
  }
  return value;
};

export const generateWhereCondition = async (
  params: GetBuildingsFilterParams,
): Promise<FilterConditionForGetBuildings[]> => {
  try {
    const { state, city, metro, neighbourhood, zip, county } = params;
    const whereCondition = [];
    if (state) {
      whereCondition.push({ state: state || { [sq.Op.ne]: null } });
    }
    if (city) {
      whereCondition.push({ city: city || { [sq.Op.ne]: null } });
    }
    if (metro) {
      whereCondition.push({ metro: metro || { [sq.Op.ne]: null } });
    }
    if (neighbourhood) {
      whereCondition.push({
        neighbourhood_l1: neighbourhood || { [sq.Op.ne]: null },
      });
    }
    if (zip) {
      whereCondition.push({ zip: zip || { [sq.Op.ne]: null } });
    }
    if (county) {
      whereCondition.push({ county: county || { [sq.Op.ne]: null } });
    }
    return whereCondition;
  } catch (error: unknown) {
    throw new HttpError(500, "Failed to apply Filter On Buildings");
  }
};

export const buildingsData = async (
  whereCondition: FilterConditionForGetBuildings,
  offset: number,
  limit: number,
  name: string,
  permittedBuildingIds: string[] | [],
): Promise<BuildingsResponse> => {
  try {
    const buildingsWhereCondition: FilterConditionForGetBuildings = {
      name: name || { [sq.Op.ne]: null },
    };
    if (permittedBuildingIds?.length && permittedBuildingIds != null) {
      buildingsWhereCondition.id = {
        [sq.Op.notIn]: permittedBuildingIds,
      };
    }

    const buildings: BuildingsResponse = (await db.buildings.findAndCountAll({
      offset,
      limit,
      where: buildingsWhereCondition,
      attributes: [
        "id",
        "name",
        ["building_slug", "buildingSlug"],
        [sq.col("geo.county"), "county"],
        [sq.col("geo.state"), "state"],
        [sq.col("geo.city"), "city"],
        [sq.col("geo.zip"), "zip"],
        [sq.col("geo.metro"), "metro"],
        [sq.col("geo.neighbourhood_l1"), "neighbourhood"],
        [sq.col("building_media.video_tour_url"), "videoTourUrl"],
        [sq.col("building_media.videos"), "videos"],
        [sq.col("building_media.images"), "images"],
        [sq.fn("jsonb_array_length", sq.col("images")), "imagesCount"],
        [sq.fn("jsonb_array_length", sq.col("videos")), "videosCount"],
        [
          sq.literal(
            '(SELECT "sum_volume" FROM "ahref_volume_kd" WHERE "slug" = "buildings"."building_slug" ORDER BY "date_imported" DESC LIMIT 1)',
          ),
          "volume",
        ],
      ],
      include: [
        {
          model: db.geoHierarchy,
          as: "geo",
          where: {
            [sq.Op.and]: whereCondition,
          },
          attributes: [],
        },
        {
          model: db.buildingMedia,
          as: "building_media",
          attributes: [],
          required: false,
        },
      ],
      order: [
        ["id", "DESC"], // Add this line to sort by "id" in descending order
      ],
      raw: true,
    })) as unknown as BuildingsResponse;
    return buildings;
  } catch (error: unknown) {
    throw new HttpError(500, "Failed to get buildings data");
  }
};

export const getAssignedBuildingsForUserQueryParams = async (
  queryParams: getAssignedBuildingsForUserParams,
): Promise<getAssignedBuildingsForUserParams> => {
  const { error, value } = getAssignedBuildingsForUserSchema.validate(queryParams);
  if (error) {
    throw new HttpError(400, error.details[0].message);
  }
  return value;
};

export const getUserAssignedBuildings = async (
  permittedBuildings: string[] | [],
  offset: number,
  limit: number,
): Promise<UserBuildingsResponse> => {
  try {
    const buildings: UserBuildingsResponse = (await db.buildings.findAndCountAll({
      where: {
        id: { [sq.Op.in]: permittedBuildings },
      },
      attributes: [
        "id",
        "name",
        [sq.col("geo.county"), "county"],
        [sq.col("geo.state"), "state"],
        [sq.col("geo.city"), "city"],
        [sq.col("geo.zip"), "zip"],
        [sq.col("geo.metro"), "metro"],
        [sq.col("geo.neighbourhood_l1"), "neighbourhood"],
        [
          sq.literal(
            '(SELECT "sum_volume" FROM "ahref_volume_kd" WHERE "slug" = "buildings"."building_slug" ORDER BY "date_imported" DESC LIMIT 1)',
          ),
          "volume",
        ],
      ],
      include: [
        {
          model: db.geoHierarchy,
          as: "geo",
          attributes: [],
        },
      ],
      order: [["id", "DESC"]],
      offset,
      limit,
    })) as unknown as UserBuildingsResponse;
    return buildings;
  } catch (error) {
    throw new HttpError(500, "Failed to get assigned buildings for user");
  }
};

export const validateFilterDropdownValuesQueryParams = async (
  queryParams: DropdownValuesFilterParams,
): Promise<DropdownValuesFilterParams> => {
  const { error, value } = dropdownFilterValuesSchema.validate(queryParams);
  if (error) {
    throw new HttpError(400, error.details[0].message);
  }
  return value;
};

export const generateFilterDropdownQuery = async (
  params: DropdownValuesFilterParams,
): Promise<QueryWithReplacements> => {
  try {
    const filters: DropdownFilterValuesParams = params.filters;
    const { state, city, metro, county, neighbourhood, zip }: DropdownFilterValuesParams = filters;
    let query: string = `SELECT NULL AS neighbourhood, NULL AS zip, NULL AS city, NULL AS county, NULL AS metro, state , NULL AS buildingName FROM geo_hierarchy GROUP BY state`;
    const replacements: Record<string, string | number | null> = {};
    let metroField: string = metro != "Not Available" && metro != "No Metro Found" ? `AND metro = :metro ` : "";
    if (state) {
      query +=
        " UNION SELECT NULL AS neighbourhood, NULL AS zip, NULL AS city, NULL AS county, metro, NULL AS state , NULL AS buildingName FROM geo_hierarchy WHERE state = :state";
      replacements.state = state;
    }

    if (state && (metro == "Not Available" || metro == "No Metro Found")) {
      query += ` UNION SELECT NULL AS neighbourhood, NULL AS zip, NULL AS city, county, NULL AS metro, NULL AS state , NULL AS buildingName FROM geo_hierarchy WHERE state = :state`;
    }

    if (state && metro && metro != "Not Available") {
      query += ` UNION SELECT NULL AS neighbourhood, NULL AS zip, NULL AS city, county, NULL AS metro, NULL AS state , NULL AS buildingName FROM geo_hierarchy WHERE state = :state AND metro = :metro`;
      replacements.metro = metro;
    }

    if (state && metro && county) {
      query += ` UNION SELECT NULL AS neighbourhood, NULL AS zip, city, NULL AS county, NULL AS metro, NULL AS state , NULL AS buildingName FROM geo_hierarchy WHERE state = :state ${metroField} AND county= :county`;
      replacements.county = county;
    }

    if (state && metro && county && city) {
      query += ` UNION SELECT NULL AS neighbourhood, CAST(zip AS VARCHAR) AS zip, NULL AS city, NULL AS county, NULL AS metro, NULL AS state , NULL AS buildingName FROM geo_hierarchy WHERE state = :state ${metroField} AND county= :county AND city = :city`;
      replacements.city = city;
    }

    if (state && metro && county && city && zip) {
      query += ` UNION SELECT DISTINCT neighbourhood_l1 AS neighbourhood, NULL AS zip, NULL AS city, NULL AS county, NULL AS metro, NULL AS state , NULL AS buildingName FROM geo_hierarchy WHERE state = :state ${metroField} AND county= :county AND city = :city AND zip = :zip`;
      replacements.zip = zip;
    }

    if (state && metro && county && city && zip && neighbourhood) {
      query += ` UNION SELECT NULL AS neighbourhood, NULL AS zip, NULL AS city, NULL AS county, NULL AS metro, NULL AS state, b.name AS buildingName FROM geo_hierarchy g JOIN buildings b ON g.id = b.geo_id WHERE g.state = :state ${metroField} AND g.county= :county AND g.city = :city AND g.zip = :zip AND g.neighbourhood_l1 = :neighbourhood`;
      replacements.neighbourhood = neighbourhood;
    }
    return { query, replacements };
  } catch (error: unknown) {
    throw new HttpError(500, "Failed to find matching dropdown values");
  }
};

export const formatFilterDropdownData = async (
  results: FilterDropdownQueryResponse[],
): Promise<FilterDropdownResponse> => {
  try {
    const data: FilterDropdownResponse = {};
    (results as FilterDropdownQueryResponse[]).forEach((item) => {
      Object.keys(item).forEach((key) => {
        const value = item[key];
        if (value !== null && value !== undefined) {
          if (!data[key]) {
            data[key] = [];
          }
          if (!data[key].includes(value)) {
            if (value !== "") {
              data[key].push(value);
            }
          }
        }
      });
    });

    if (data["metro"] && data["metro"].length) {
      data["metro"].push("Not Available");
    }
    return data;
  } catch (error: unknown) {
    throw new HttpError(500, "Failed to format dropdown values data");
  }
};

export const validateMediaCoverageQueryParams = async (
  queryParams: MediaCoverageQueryParams,
): Promise<MediaCoverageQueryParams> => {
  const { error, value } = mediaCoverageSchema.validate(queryParams);
  if (error) {
    throw new HttpError(400, error.details[0].message);
  }
  return value;
};

export const findMediaCoverage = async (
  name: string,
  whereCondition: FilterConditionForGetBuildings,
): Promise<MediaCoverageQueryResponse> => {
  try {
    const mediaCoverage: MediaCoverageQueryResponse = (await db.buildings.findAndCountAll({
      where: {
        name: name || { [sq.Op.ne]: null },
      },
      attributes: [
        [
          sq.fn("SUM", sq.literal(`CASE WHEN jsonb_array_length("building_media"."images") > 0 THEN 1 ELSE 0 END`)),
          "images",
        ],
        [
          sq.fn("SUM", sq.literal(`CASE WHEN jsonb_array_length("building_media"."videos") > 0 THEN 1 ELSE 0 END`)),
          "videos",
        ],
        [
          sq.fn(
            "SUM",
            sq.literal(`CASE WHEN jsonb_array_length("building_media"."video_tour_url") > 0 THEN 1 ELSE 0 END`),
          ),
          "links",
        ],
      ],
      include: [
        {
          model: db.buildingMedia,
          as: "building_media",
          attributes: [],
        },
        {
          model: db.geoHierarchy,
          as: "geo",
          where: {
            [sq.Op.and]: whereCondition,
          },
          attributes: [],
        },
      ],
      raw: true,
    })) as unknown as MediaCoverageQueryResponse;
    return mediaCoverage;
  } catch (error) {
    throw new HttpError(500, "Failed to find media coverage for buildings");
  }
};

export const calculateBuildingsMediaCoverage = async (mediaCount: number, totalCount: number): Promise<number> => {
  try {
    const availableMediaPercentage: string = ((mediaCount / totalCount) * 100).toFixed(2);
    return parseFloat(availableMediaPercentage);
  } catch (error) {
    throw new HttpError(500, "Failed to Calculate media coverage for buildings");
  }
};

export const generateMediaCoverage = async (mediaCoverage: MediaCoverageQueryResponse): Promise<MediaCounts> => {
  try {
    let mediaCounts: MediaCounts = {
      imagesCount: 0,
      videosCount: 0,
      linksCount: 0,
      totalMediaCount: 0,
      remainingMediaCount: 0,
    };

    if (mediaCoverage.rows.length > 0) {
      mediaCounts.imagesCount = await calculateBuildingsMediaCoverage(
        parseInt(mediaCoverage.rows[0]["images"]) || 0,
        mediaCoverage.count,
      );
      mediaCounts.videosCount = await calculateBuildingsMediaCoverage(
        parseInt(mediaCoverage.rows[0]["videos"]) || 0,
        mediaCoverage.count,
      );
      mediaCounts.linksCount = await calculateBuildingsMediaCoverage(
        parseInt(mediaCoverage.rows[0]["links"]) || 0,
        mediaCoverage.count,
      );
      let totalMediaPercentageCount = mediaCounts.imagesCount + mediaCounts.videosCount + mediaCounts.linksCount;
      mediaCounts.totalMediaCount = Number(((totalMediaPercentageCount / 300) * 100).toFixed(2));
      mediaCounts.remainingMediaCount = 100 - mediaCounts.totalMediaCount;
    }
    return mediaCounts;
  } catch (error) {
    throw new HttpError(500, "Failed to generate media coverage for buildings");
  }
};

export const validateUploadBuildingMediaPayload = async (
  bodyParams: UploadBuildingMediaParamsType,
): Promise<UploadBuildingMediaParamsType> => {
  const { error, value } = uploadBuildingMediaSchema.validate(bodyParams);
  if (error) {
    throw new HttpError(400, error.details[0].message);
  }
  return value;
};

const moveS3Object = async (bucket: string, sourceKey: string, destinationKey: string): Promise<void> => {
  try {
    const copyObjectCommand: CopyObjectCommand = new CopyObjectCommand({
      Bucket: bucket,
      CopySource: `/${bucket}/${sourceKey}`,
      Key: destinationKey,
      ACL: "private",
    });
    await s3Client.send(copyObjectCommand);
    const deleteObjectCommand: DeleteObjectCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: sourceKey,
    });
    await s3Client.send(deleteObjectCommand);
    return;
  } catch (error: unknown) {
    throw new HttpError(500, "Failed to move item");
  }
};

const deleteS3Object = async (bucket: string, sourceKey: string): Promise<void> => {
  try {
    const deleteObjectCommand: DeleteObjectCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: sourceKey,
    });
    await s3Client.send(deleteObjectCommand);
    return;
  } catch (error) {
    throw new HttpError(500, "Failed to delete item");
  }
};

export const handleNewImages = async (
  newImages: Media[],
  bId: string,
  images: Media[],
  bucket: string,
): Promise<Media[]> => {
  try {
    for (let item of newImages) {
      let imageFileName: string = item["imageUrl"].split("/").pop();
      let thumbFileName: string = item["thumbUrl"].split("/").pop();
      let newImageSourceKey: string = item["imageUrl"];
      let newImageDestinationKey: string = `${process.env.NODE_ENV}/Media/Buildings/${bId}/images/${imageFileName}`;
      let newThumbSourceKey: string = item["thumbUrl"];
      let newThumbDestinationKey: string = `${process.env.NODE_ENV}/Media/Buildings/${bId}/images/thumbnails/${thumbFileName}`;
      await moveS3Object(bucket, newImageSourceKey, newImageDestinationKey);
      await moveS3Object(bucket, newThumbSourceKey, newThumbDestinationKey);

      let imageUrl: string = `${process.env.NODE_ENV}/Media/Buildings/${bId}/images/${imageFileName}`;
      let thumbUrl: string = `${process.env.NODE_ENV}/Media/Buildings/${bId}/images/thumbnails/${thumbFileName}`;
      delete item["imageUrl"];
      delete item["thumbUrl"];
      item["imageUrl"] = imageUrl;
      item["thumbUrl"] = thumbUrl;
      images.push(item);
    }
    return images;
  } catch (error) {
    throw new HttpError(500, "Failed to handle new images");
  }
};

export const handleDeletedImages = async (
  deletedImages: DeletedMedia[],
  images: Media[],
  bucket: string,
): Promise<Media[]> => {
  try {
    for (let item of deletedImages) {
      let deleteImageSourceKey: string = item["imageUrl"];
      let deleteThumbSourceKey: string = item["thumbUrl"];
      await deleteS3Object(bucket, deleteImageSourceKey);
      await deleteS3Object(bucket, deleteThumbSourceKey);
      const index: number = images.findIndex((image: Media) => image.id === item.id);
      if (index !== -1) {
        images.splice(index, 1);
      }
    }
    return images;
  } catch (error) {
    throw new HttpError(500, "Failed to delete images");
  }
};

export const handleNewVideos = async (
  newVideos: Video[],
  bId: string,
  videos: Video[],
  bucket: string,
): Promise<Video[]> => {
  try {
    for (let item of newVideos) {
      let videoFileName: string = item["videoUrl"].split("/").pop();
      let videoThumbFileName: string = item["thumbUrl"].split("/").pop();
      let newVideoSourceKey: string = item["videoUrl"];
      let newVideoThumbSourceKey: string = item["thumbUrl"];
      let newVideoDestinationKey: string = `${process.env.NODE_ENV}/Media/Buildings/${bId}/videos/${videoFileName}`;
      let newVideoThumbDestinationKey: string = `${process.env.NODE_ENV}/Media/Buildings/${bId}/videos/thumbnails/${videoThumbFileName}`;
      await moveS3Object(bucket, newVideoSourceKey, newVideoDestinationKey);
      await moveS3Object(bucket, newVideoThumbSourceKey, newVideoThumbDestinationKey);
      let videoUrl: string = `${process.env.NODE_ENV}/Media/Buildings/${bId}/videos/${videoFileName}`;
      let thumbUrl: string = `${process.env.NODE_ENV}/Media/Buildings/${bId}/videos/thumbnails/${videoThumbFileName}`;
      item["videoUrl"] = videoUrl;
      item["thumbUrl"] = thumbUrl;
      videos.push(item);
    }
    return videos;
  } catch (error) {
    throw new HttpError(500, "Failed to handle new videos");
  }
};

export const handleDeletedVideos = async (
  deletedVideos: DeletedVideo[],
  videos: Video[],
  bucket: string,
): Promise<Video[]> => {
  try {
    for (let item of deletedVideos) {
      let deleteVideoSourceKey: string = item["videoUrl"];
      let deleteVideoThumbSourceKey: string = item["thumbUrl"];
      await deleteS3Object(bucket, deleteVideoSourceKey);
      await deleteS3Object(bucket, deleteVideoThumbSourceKey);

      const index: number = videos.findIndex((video: Video) => {
        return video.id == item.id
      });
      if (index !== -1) {
        videos.splice(index, 1);
      }
    }
    return videos;
  } catch (error) {
    throw new HttpError(500, "Failed to delete videos");
  }
};

export const checkBuildingInBuildingMedia = async (
  bId: string,
  images: Media[],
  videos: Video[],
  videoTourUrl: string[],
  transaction: sq.Transaction,
  createdBy: string,
): Promise<[any, boolean]> => {
  //used any here because script was not able to identify the type of return output from query
  try {
    const [building, created] = await db.buildingMedia.findOrCreate({
      where: { bId: bId },
      defaults: {
        images: images,
        videos: videos,
        videoTourUrl: videoTourUrl,
        createdBy: createdBy,
        updatedBy: createdBy,
      },
      transaction: transaction,
    });
    return [building, created];
  } catch (error) {
    throw new HttpError(500, "Failed to check building");
  }
};

export const updateBuildingMediaDetails = async (
  building: any,
  images: Media[],
  videos: Video[],
  videoTourUrl: string[],
  transaction: sq.Transaction,
  createdBy: string,
): Promise<void> => {
  //used any here because script was not able to identify the type of return output from buildings query
  try {
    await building.update(
      {
        images: images,
        videos: videos,
        videoTourUrl: videoTourUrl,
        createdBy: createdBy,
        updatedBy: createdBy,
      },
      { transaction },
    );
    return;
  } catch (error) {
    throw new HttpError(500, "Failed to update building media");
  }
};

export const updateBuildingDetails = async (
  hasMediaAttachments: boolean,
  bId: string,
  transaction: sq.Transaction,
): Promise<number> => {
  try {
    const [updatedRowsCount] = await db.buildings.update(
      { hasMediaAttachments: hasMediaAttachments },
      { where: { id: bId }, transaction: transaction },
    );
    return updatedRowsCount;
  } catch (error) {
    throw new HttpError(500, "Failed to update building details");
  }
}

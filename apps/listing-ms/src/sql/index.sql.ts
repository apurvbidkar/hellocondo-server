export const getNearbyNeighborhoodsExcludingCurrentSQL = `
SELECT *,
       St_distance(wkb_geometry, St_setsrid(St_makepoint(:longitude, :latitude),
                                 4326))
       AS distance
FROM   "neighborhoods_2n"
WHERE LOWER(state) = LOWER(:state)
       AND LOWER(county) = LOWER(:county)
       AND St_dwithin(wkb_geometry, St_setsrid(St_makepoint(:longitude,
                                               :latitude),
                                    4326),
        :distanceInMeters
           )
       AND name != (SELECT name
                    FROM   "neighborhoods_2n"
                    WHERE  St_intersects(wkb_geometry,
                           St_setsrid(St_makepoint(
                                      :longitude,
                                      :latitude), 4326
                                   ))
                    LIMIT  1)
ORDER  BY distance ASC
`;

export const getNearbyZipCodesExcludingCurrentSQL = `
SELECT *,
       St_distance(wkb_geometry, St_setsrid(St_makepoint(:longitude, :latitude),
                                 4326))
       AS distance
FROM   "zip_code_boundaries"
WHERE LOWER(state) = LOWER(:state)
       AND LOWER(county) = LOWER(:county)
       AND St_dwithin(wkb_geometry, St_setsrid(St_makepoint(:longitude,
                                               :latitude),
                                    4326),
               :distanceInMeters)
       AND zip5 != (SELECT zip5
                    FROM   "zip_code_boundaries"
                    WHERE  St_intersects(wkb_geometry,
                           St_setsrid(St_makepoint(
                                      :longitude,
                                      :latitude), 4326
                                   ))
                    LIMIT  1)
ORDER  BY distance ASC
`;

export function updateOrderClauseForFooterAPI(query: string, nameOrder: "ASC" | "DESC", colName: string): string {
  const regex = /ORDER\s+BY\s+distance\s+ASC/i;
  // Replace the matched line with the new order clause
  const updatedQuery = query.replace(regex, `ORDER BY "${colName}" ${nameOrder}`);
  return updatedQuery;
}

export const getPoiDataForListing = `
              SELECT
                     "BusinessName", "City", "Street", "Zip", "Latitude", "Longitude", "Category", "LineOfBusiness", "Industry",
                     (
                            3958.8 * acos( 
                            cos(radians(:lat)) * cos(radians("Latitude")) * cos(radians("Longitude") - radians(:lon))
                            + sin(radians(:lat)) * sin(radians("Latitude"))
                            )
                     ) AS DistanceMiles,
                     (
                            3958.8 * 1760 * acos(
                            cos(radians(:lat)) * cos(radians("Latitude")) * cos(radians("Longitude") - radians(:lon))
                            + sin(radians(:lat)) * sin(radians("Latitude"))
                            )
                     ) AS DistanceYards
              FROM commissions_inc_poi
              WHERE "City" = :city
              AND "Category" IN (:category)
              AND "LineOfBusiness" IN (:lineOfBusiness)
              AND ST_Contains(
                     ST_SetSRID(
                            ST_GeomFromText('POLYGON((' || :polygon || '))', 4326),
                            4326
                     ),
                     ST_SetSRID(
                            ST_MakePoint("Longitude", "Latitude"),
                            4326
                     )
              )
              ORDER BY DistanceMiles
       `;

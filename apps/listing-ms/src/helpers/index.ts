import { SESClient, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
import { Buffer } from "buffer";
import config from "../config/index.js";
import { HttpError } from "../errors/index.js";
import { DistanceUnit, Media } from "../types/index.js";

const client = new SESClient({ region: process.env.REGION });

/**
 *
 * @param image - It is object of media data
 * @returns - Encoded string
 */
const encodedImage = async (image: Media, height: number, width: number) => {
  const newImageObject = {
    bucket: config.galleryImage.bucket,
    key: image.Path,
    edits: {
      resize: {
        height,
        width,
        fit: "inside",
      },
    },
  };
  const bufferData = JSON.stringify(newImageObject);
  return Buffer.from(bufferData).toString("base64");
};

const sendEmail = async (recipient: string, subject: string, emailHtml: string): Promise<boolean> => {
  try {
    // Prepare email parameters
    const emailParams: SendEmailCommandInput = {
      Source: config.email.pSender,
      Destination: { ToAddresses: [recipient] },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Charset: "UTF-8", Data: emailHtml } },
      },
    };

    // Create an SES command to send the email
    const command = new SendEmailCommand(emailParams);

    // Send the email
    await client.send(command);
    return true;
  } catch (error) {
    throw new HttpError(500, "Error sending email to user");
  }
};

/**
 * An object mapping distance units to their conversion factors to meters.
 *
 * @constant
 * @type {Object.<DistanceUnit, number>}
 * @property {number} km - Conversion factor for kilometers to meters.
 * @property {number} mi - Conversion factor for miles to meters.
 * @property {number} m - Conversion factor for meters to meters.
 * @property {number} yd - Conversion factor for yards to meters.
 * @property {number} ft - Conversion factor for feet to meters.
 */
const conversionFactors: { [key in DistanceUnit]: number } = {
  km: 1000,
  mi: 1609.34,
  m: 1,
  yd: 0.9144,
  ft: 0.3048,
};

/**
 * Converts a given distance to meters based on the provided unit.
 *
 * @param {number} distance - The distance to convert.
 * @param {DistanceUnit} unit - The unit of the distance to be converted.
 * @returns {number} - The distance converted to meters.
 *
 * @example
 * // Convert 5 kilometers to meters
 * const meters = convertToMeters(5, 'km'); // 5000
 *
 * @example
 * // Convert 3 miles to meters
 * const meters = convertToMeters(3, 'mi'); // 4828.02
 */
export function convertToMeters(distance: number, unit: DistanceUnit): number {
  return distance * conversionFactors[unit];
}

export { encodedImage, sendEmail };

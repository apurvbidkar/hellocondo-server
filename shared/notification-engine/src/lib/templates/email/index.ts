import * as fs from "fs";
import * as path from "path";
import { HttpError } from "../../errors/index.js";
import config from "../../config/index.js";
import { EmailTemplateVariables } from "../../types/email.types.js";
import { fileURLToPath } from "url";

// --------------------------------------- Module scoped (private) variables ---------------------------

// Define __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bucketName = config.s3.pb;
const mailConstants = {
  companyLogo: `https://${bucketName}.s3.amazonaws.com/assets/logo.png`,
  facebookLogo: `https://${bucketName}.s3.amazonaws.com/assets/Facebook.png`,
  instagramLogo: `https://${bucketName}.s3.amazonaws.com/assets/instagram.png`,
  twitter: `https://${bucketName}.s3.amazonaws.com/assets/twitter.png`,
  reddit: `https://${bucketName}.s3.amazonaws.com/assets/reddit.png`,
};

export interface TemplateRawData {
  mainTemplate: string;
  headerPartial: string;
  footerPartial: string;
}

/**
 * Reads the email template files.
 * @param {string} templateName - The name of the email template to read.
 * @returns {Promise<TemplateRawData>} The raw data of the email template.
 * @throws {HttpError} If there's an error reading the email template.
 */
export async function readTemplate(templateName: string): Promise<TemplateRawData> {
  try {
    const templatePath = path.join(__dirname, `../email/${templateName}.html`);
    const mainTemplate = fs.readFileSync(templatePath, "utf-8");

    // Read header partial file once during initialization
    const headerPartialPath = path.join(__dirname, "../email/partials/header.html");
    const headerPartial = fs.readFileSync(headerPartialPath, "utf-8");

    // Read footer partial file once during initialization
    const footerPartialPath = path.join(__dirname, "../email/partials/footer.html");
    const footerPartial = fs.readFileSync(footerPartialPath, "utf-8");

    return { mainTemplate, headerPartial, footerPartial };
  } catch (error) {
    throw new HttpError(500, "Error reading email template");
  }
}

/**
 * Compiles the email template using Handlebars.
 * @param {TemplateRawData} templateData - The raw data of the email template.
 * @param {EmailTemplateVariables} templateParams - The parameters used in the email template.
 * @returns {Promise<string>} The compiled HTML of the email template.
 * @throws {HttpError} If there's an error compiling the email template.
 */
export async function compileTemplate(
  templateData: TemplateRawData,
  templateParams: EmailTemplateVariables,
): Promise<string> {
  try {
    // Combine mail constants and template parameters
    const { headerPartial, footerPartial } = templateData;

    // Compile the template by replacing the variables
    let compiledHtml = replaceVariables(templateData.mainTemplate, {
      header: headerPartial,
      footer: footerPartial,
      ...mailConstants,
      ...templateParams,
    });
    compiledHtml = replaceVariables(compiledHtml, { ...mailConstants, ...templateParams });

    return compiledHtml;
  } catch (error) {
    throw new HttpError(500, "Error compiling email template");
  }
}
// A simple function to replace variables in the template

function replaceVariables(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return key in variables ? variables[key] : `{{${key}}}`;
  });
}

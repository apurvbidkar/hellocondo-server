import { SendEmailCommand, SendEmailCommandInput, SESClient } from "@aws-sdk/client-ses";
import { HttpError } from "./errors/index.js";
import config from "./config/index.js";
import { EmailOptions, EmailParams, EmailTemplateVariables, EmailWithCCBCC, SingleEmail } from "./types/email.types.js";
import { compileTemplate, readTemplate, TemplateRawData } from "./templates/email/index.js";
import { isValidEmail, validateBulkEmails } from "./validators/index.js";

// --------------------------------------- Module scoped (private) variables ---------------------------
const client = new SESClient({ region: config.awsRegion });

/**
 * Sends an email using AWS SES (Simple Email Service).
 *
 * @param {EmailParams} emailParams - The parameters required to send the email.
 * @returns {Promise<boolean>} A boolean indicating whether the email was sent successfully.
 * @throws {HttpError} If there's an error during the email sending process.
 */
export const sendEmail = async (emailParams: EmailParams): Promise<boolean> => {
  try {
    // Destructure emailParams
    const { from, to, subject, body } = emailParams;
    await isValidEmail(to);
    await isValidEmail(from);

    // Prepare email parameters
    const sesParams: SendEmailCommandInput = {
      Source: from,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Charset: "UTF-8", Data: body } },
      },
    };

    // Create an SES command to send the email
    const command = new SendEmailCommand(sesParams);
    // const command = new

    // Send the email
    await client.send(command);
    return true;
  } catch (error: any) {
    throw new HttpError(500, error?.message || "Failed to send email", error);
  }
};
export async function sendEmailWithCCAndBCC(obj: EmailOptions): Promise<boolean> {
  try {
    // Destructure emailParams
    const { to, cc, bcc, from, subject, body } = obj;

    const input: SendEmailCommandInput = {
      Source: from,
      Destination: { ToAddresses: [to], CcAddresses: cc || [], BccAddresses: bcc || [] },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Charset: "UTF-8", Data: body } },
      },
    };

    const command = new SendEmailCommand(input);
    await client.send(command);
    return true;
  } catch (error: any) {
    throw new HttpError(500, error.message || "Failed to send email", error);
  }
}

/**
 * Compiles the email template, sends the email using AWS SES, and returns a boolean indicating success.
 *
 * @param {string} templateName - The name of the email template.
 * @param {EmailTemplateVariables} templateParams - The parameters used to compile the email template.
 * @param {EmailParams} emailParams - The parameters required to send the email.
 * @returns {Promise<boolean>} A boolean indicating whether the email was sent successfully.
 * @throws {HttpError} If there's an error during the email sending process.
 */
export async function compileAndSendMail(
  templateName: string,
  templateParams: EmailTemplateVariables,
  emailParams: SingleEmail,
): Promise<boolean> {
  try {
    const rawHtmlString: TemplateRawData = await readTemplate(templateName);
    const body: string = await compileTemplate(rawHtmlString, templateParams);
    const params = {
      body,
      subject: emailParams.subject,
      from: emailParams.from || config.email.pSender,
      to: emailParams.to,
    };

    await sendEmail(params);
    return true;
  } catch (error: any) {
    throw new HttpError(500, error.message || "Failed to send email");
  }
}

/**
 * Compiles and sends bulk emails to multiple recipients.
 * @param {string} templateName - Name of the email template to use.
 * @param {EmailTemplateVariables} templateParams - Variables to populate in the email template.
 * @param {string[]} emails - Array of recipient email addresses.
 * @param {string} [subject] - Optional subject for the emails. Defaults to "Default Subject".
 * @param {string} [sender] - Optional sender email address. Uses default sender if not provided.
 * @returns {Promise<boolean>} Promise indicating success or failure of sending emails.
 * @throws {HttpError} Throws HTTP 500 error if sending emails fails.
 */
export async function compileAndSendBulkMail(
  templateName: string,
  templateParams: EmailTemplateVariables,
  emails: string[],
  subject?: string,
  sender?: string,
): Promise<boolean> {
  try {
    const recipients = emails;

    const rawHtmlString: TemplateRawData = await readTemplate(templateName);

    for (const recipient of recipients) {
      const body: string = await compileTemplate(rawHtmlString, templateParams);
      const emailParams: EmailParams = {
        body,
        subject: subject || "Default Subject",
        from: sender || config.email.pSender,
        to: recipient,
      };

      await sendEmail(emailParams);
    }

    return true;
  } catch (error: any) {
    throw new HttpError(500, error.message || "Failed to send bulk email", error);
  }
}

/**
 * Compiles and sends an email with CC and BCC recipients.
 * @param {string} templateName - Name of the email template to use.
 * @param {EmailTemplateVariables} templateParams - Variables to populate in the email template.
 * @param {EmailWithCCBCC} emailWithCCBCC - Object containing email details with CC and BCC information.
 * @returns {Promise<boolean>} Promise indicating success or failure of sending the email.
 * @throws {HttpError} Throws HTTP 500 error if sending email fails.
 */
export async function compileAndSendMailCCBCC(
  templateName: string,
  templateParams: EmailTemplateVariables,
  emailWithCCBCC: EmailWithCCBCC,
): Promise<boolean> {
  try {
    const { to, cc, bcc, from, subject } = emailWithCCBCC;

    if (cc && cc.length > 0) {
      await validateBulkEmails(cc);
    }
    if (bcc && bcc.length > 0) {
      await validateBulkEmails(bcc);
    }

    await isValidEmail(to);

    if (from) {
      await isValidEmail(from);
    }

    const rawHtmlString: TemplateRawData = await readTemplate(templateName);
    const body: string = await compileTemplate(rawHtmlString, templateParams);

    const emailParams: EmailOptions = {
      body,
      subject,
      to,
      cc,
      bcc,
      from: from || config.email.pSender,
    };

    await sendEmailWithCCAndBCC(emailParams);

    return true;
  } catch (error: any) {
    throw new HttpError(500, error.message || "Failed to send email with CC/BCC", error);
  }
}

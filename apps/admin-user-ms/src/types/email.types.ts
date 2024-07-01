export interface EmailParams {
  sender?: string;
  recipient: string;
  subject?: string;
  mailBody?: string;
}

export interface EmailTemplateVariables {
  [key: string]: string | number | boolean | object | null | undefined;
}

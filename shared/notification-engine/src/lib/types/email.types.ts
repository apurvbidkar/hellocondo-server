export interface EmailParams {
  from: string;
  to: string;
  subject: string;
  body: string;
}

export interface EmailTemplateVariables {
  [key: string]: string | number | boolean | object | null | undefined;
}

export interface EmailTemplateData {
  html: string;
}

export interface EmailOptions {
  cc?: string[];
  bcc?: string[];
  subject?: string;
  from?: string;
  to: string;
  body: string;
}

export interface SingleEmail {
  to: string;
  subject: string;
  from?: string;
}

export interface EmailWithCCBCC extends SingleEmail {
  cc?: string[];
  bcc?: string[];
}

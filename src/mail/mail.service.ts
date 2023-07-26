import { Logger, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/smtp-connection';
import { MailNotification } from './mail-notification.type';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name, { timestamp: true });

  private supportMailAccount = nodemailer.createTransport({
    host: process.env.SUPPORT_EMAIL_HOST,
    port: parseInt(process.env.SUPPORT_EMAIL_PORT),
    secure: process.env.SUPPORT_EMAIL_CONNECTION_SECURE === 'true',
    auth: {
      user: process.env.SUPPORT_EMAIL_USER,
      pass: process.env.SUPPORT_EMAIL_PASSWORD,
    },
  } as Options);

  private fenceControlMailAccount = nodemailer.createTransport({
    host: process.env.FENCE_CONTROL_EMAIL_HOST,
    port: parseInt(process.env.FENCE_CONTROL_EMAIL_PORT),
    secure: process.env.FENCE_CONTROL_EMAIL_CONNECTION_SECURE === 'true',
    auth: {
      user: process.env.FENCE_CONTROL_EMAIL_USER,
      pass: process.env.FENCE_CONTROL_EMAIL_PASSWORD,
    },
  } as Options);

  public async sendDoubleOptInMail(email: string, randomToken: string): Promise<boolean> {
    try {
      const hostPort = process.env.WEB_APP_PORT
        ? `${process.env.WEB_APP_HOST}:${process.env.WEB_APP_PORT}`
        : process.env.WEB_APP_HOST;

      const confirmLink = `${process.env.WEB_APP_PROTOCOL}://${hostPort}/${
        process.env.WEB_APP_EMAIL_CONFIRMATION_PATH
      }?email=${encodeURIComponent(email)}&token=${randomToken}`;

      await this.supportMailAccount.sendMail({
        from: `"${process.env.APP_NAME}" <${process.env.APP_EMAIL}>`,
        to: email,
        subject: 'Kerbl-Welt: Bestätigung Email-Adresse / Confirmation email address',
        html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" lang="en"></html>
        <html>
        <head>
        \t<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        \t<meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <!-- <meta name="color-scheme" content="light dark">
            <meta name="supported-color-schemes" content="light dark"> -->
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <title>Register New Account</title>
            <style type="text/css">
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&family=Source+Sans+Pro&display=swap');
        
                table {
                    border-spacing: 0;
                }
        
                td {
                    padding: 0;
                }
        
                p {
                    font-size: 1rem;
                    letter-spacing: 0.03rem;
                    line-height: 1.5rem;
                }
        
                img {
                border: 0;
                }
        
                a {
                color: #7AB51D;
                text-decoration: none;
                }
        
        
                @media screen and (max-width: 599.98px) {
        
                }
                @media screen and (max-width: 399.98px) {
        
                }
        
                /* Custom Dark Mode Colors */
        
                @media (prefers-color-scheme: dark) {
        
                }
        
            </style>
        
        \t<!--[if (gte mso 9)|(IE)]>
        \t\t<style type="text/css">
        \t\t\ttable {border-collapse: collapse !important;}
        \t\t</style>
        \t<![endif]-->
        
        </head>
        <body style="Margin:0;padding:0;min-width:100%;background-color:#dbdbdb;">
            <!--[if (gte mso 9)|(IE)]>
                <style type="text/css">
                    body {background-color: #dbdbdb!important;}
                    body, table, td, p, a {font-family: 'Roboto', sans-serif, Arial, Helvitica!important;}
                </style>
            <![endif]-->
        
            <center style="width: 100%;table-layout:fixed;background-color: #dbdbdb;padding-bottom: 40px;">
                <div style="max-width: 600px;background-color: #fafdfe;box-shadow: 0 0 10px rgba(0, 0, 0, .2);">
        
        
        
                <!--[if (gte mso 9)|(IE)]>
                    <table width="600" align="center" style="border-spacing:0;color:#191919;" role="presentation">
                    <tr>
                    <td style="padding:0;">
                <![endif]-->
        
        
        
                    <table align="center" style="border-spacing: 0;color:#191919;font-family: 'Roboto', sans-serif, Arial, Helvetica!important;background-color: #fafdfe;Margin:0;padding:0;width: 100%;max-width: 600px;" role="presentation">
        
                        <!-- START BANNER -->
                        <tr>
                            <td  class="banner" style="padding: 0">
                                <!--[if (gte mso 9)|(IE)]>
                                <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:341px;">
                                    <v:fill type="tile" src="https://iot.kerbl.cloud/allgemein/images-email/image_newAccount.png" />
                                    <v:textbox inset="0,0,0,0">
                                <![endif]-->
                                <img src="https://iot.kerbl.cloud/allgemein/images-email/image_newAccount.png" style="width: 100%;">
                                <!--[if (gte mso 9)|(IE)]>
                                </v:textbox>
                                </v:rect>
                                <![endif]-->
                            </td>
                        </tr>
                        <!-- END BANNER -->
        
                        <!-- START TITLE, TEXT & BUTTON -->
                        <tr>
                            <td style="padding: 0;background-color: #ffffff;">
                                <table width="100%" style="border-spacing: 0;" role="presentation">
                                    <tr>
                                        <td style="padding: 50px 50px 0px 50px;color: #191919;text-align: center;font-size: 16px;">
                                            <p style="font-size: 24px;font-weight: 700;">Lieber Kerbl Kunde,</p>
                                            <p>Hallo und Willkommen bei Kerbl-Welt! Bitte klicke auf den Button, um deine E-Mail-Adresse zu bestätigen und die Registrierung abzuschließen.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding: 30px 50px 30px 50px;"">
                                            <table cellpadding="0" cellspacing="0" role="presentation">
                                                <tr>
                                                    <td style="border-radius: 22px;" bgcolor="#7AB51D">
                                                        <a href="${confirmLink}" target="_blank" style="font-size: 16px; font-weight: medium;text-decoration:none;color:#ffffff;background-color:  #7AB51D;border:1px solid #7AB51D;border-radius: 22px;padding: 12px 24px;display: inline-block;">Bestätigen</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
        
                                    <tr>
                                        <td>
                                            <table width="75%" align="center">
                                                <tr>
                                                    <td height="1" style="background-color: #7AB51D;"></td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 10px 50px 50px 50px;color: #191919;text-align: center;font-size: 16px;">
                                            <p style="color: #7AB51D;text-decoration:none;">
                                                Bei Fragen kannst du dich gerne an unseren Service wenden <a href="mailto:info@kerbl.com" style="color: #7AB51D;text-decoration:none;">info@kerbl.com</a>
                                            </p>
                                            <p style="font-size: 16px;padding-bottom: 5px;">Freundliche Grüße<br>Dein Kerbl-Welt Team</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <!-- END TITLE, TEXT & BUTTON -->
        
        
        
                        <!-- START LINE GRAY -->
                        <tr>
                            <td style="border-top: 1px dashed #999999;"></td>
                        </tr>
                        <!-- END LINE GRAY -->
        
        
                        <!-- START TITLE, TEXT & BUTTON ENGLISH -->
                        <tr>
                            <td style="padding: 0;background-color: #ffffff;">
                                <table width="100%" style="border-spacing: 0;" role="presentation">
                                    <tr>
                                        <td style="padding: 50px 50px 0px 50px;color: #191919;text-align: center;font-size: 16px;">
                                            <p style="font-size: 24px;font-weight: 700;">Dear Kerbl customer,</p>
                                            <p>Hello and welcome to Kerbl World! Please click on the button below to confirm your email address and complete the registration.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding: 30px 50px 30px 50px;"">
                                            <table cellpadding="0" cellspacing="0" role="presentation">
                                                <tr>
                                                    <td style="border-radius: 22px;" bgcolor="#7AB51D">
                                                        <a href="${confirmLink}" target="_blank" style="font-size: 16px; font-weight: medium;text-decoration:none;color:#ffffff;background-color:  #7AB51D;border:1px solid #7AB51D;border-radius: 22px;padding: 12px 24px;display: inline-block;">Confirm</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
        
                                    <tr>
                                        <td>
                                            <table width="75%" align="center">
                                                <tr>
                                                    <td height="1" style="background-color: #7AB51D;"></td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 10px 50px 50px 50px;color: #191919;text-align: center;">
                                            <p style="color: #7AB51D;text-decoration:none;">
                                                If you have any questions, please do not hesitate to contact our service team at <a href="mailto:info@kerbl.com" style="color: #7AB51D;text-decoration:none;">info@kerbl.com</a>
                                            </p>
                                            <p style="font-size: 16px;padding-bottom: 5px;">Best regards<br>Your Kerbl World Team</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <!-- END TITLE, TEXT & BUTTON ENGLISH -->
        
        
                        <!-- START LOGO -->
                        <tr>
                            <td style="padding: 0;">
                                <table width="100%" style="border-spacing: 0;background-color: #f2f2f2;" role="presentation">
            
                                    <tr>
                                        <td style="padding: 30px 0 20px 0;text-align: center;">
                                            <a href="https://www.kerbl.com" target="_blank"><img src="https://iot.kerbl.cloud/allgemein/images-email/ImgLogoKerbl.png" alt="Kerbl" border="0"></a>
                                        </td>
                                    </tr>
            
                                </table>
                            </td>
                        </tr>
                        <!-- END LOGO -->
        
        
        
                        <!-- START SOCIAL ICONS -->
                        <tr>
                            <td style="padding: 0;">
                            <table width="100%" style="border-spacing: 0;" role="presentation">
                                <tr>
                                    <td style="background-color: #f2f2f2;text-align: center;padding: 0px 0 20px 0;">
                                        <a href="https://www.facebook.com/kerbl.de/" target="_blank"><img src="https://iot.kerbl.cloud/allgemein/images-email/circle-facebook.png"  alt="Facebook" width="32" border="0"></a>
                                        <a href="https://www.youtube.com/user/KerblMedienKanal" target="_blank"><img src="https://iot.kerbl.cloud/allgemein/images-email/circle-youtube.png"  alt="YouTube" width="32" border="0"></a>
                                        <a href="https://www.instagram.com/kerbl.de/" target="_blank"><img src="https://iot.kerbl.cloud/allgemein/images-email/circle-instagram.png"  alt="Instagram" width="32" border="0"></a>
                                    </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        <!-- END SOCIAL ICONS -->
        
        
        
        
                        <!-- START THREE ROWS -->
                        <tr>
                            <td style="padding: 0;background-color: #7AB51D;">
                                <table width="100%" style="border-spacing: 0;" role="presentation">
                
                                    <tr>
                                        <td style="padding: 20px 0px;text-align: center;">
                                        
                                            <p style="font-size: 0.875rem; letter-spacing: 0.03rem;line-height: 1rem;"><a href="https://www.kerbl.com/de/kontakt" target="_blank" style="color: #ffffff;">Kontakt</a></p>
                                            <p style="font-size: 0.875rem; letter-spacing: 0.03rem;line-height: 1rem;"><a href="https://www.kerbl.com/de/impressum" target="_blank" style="color: #ffffff;">Impressum</a></p>
                                            <p style="font-size: 0.875rem; letter-spacing: 0.03rem;line-height: 1rem;"><a href="https://www.kerbl.com/de/datenschutzerklaerung" target="_blank" style="color: #ffffff;">Datenschutz</a></p>
                                        
                                        </td>
                                    </tr>
                            </table>
                        </td>
                    </tr>
                            <!-- END THREE COLUMNS -->
        
        
        
                    <!-- START FOOTER -->
                    <tr>
                        <td style="padding: 0;background-color: #191919;">
                        <table width="100%" style="border-spacing: 0;" role="presentation">
                            <tr>
                                <td style="font-size: 0.75rem; letter-spacing: 0.03rem;line-height: 1rem;padding: 10px 0 10px 0;color: #999999;text-align: center;">
                                    © Albert Kerbl GmbH
                                </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    <!-- END FOOTER -->
        
        
        
                    </table>
        
        
        
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
        
        
                </div>
            </center> 
        </body>
        </html>
        `,
      });
      this.logger.log(`Successfully sent email for double opt in to '${email}'`);
      return true;
    } catch (e) {
      this.logger.error(`Failed sending email for double opt in to '${email}': ${e.message}`);
      return false;
    }
  }

  public async sendSetNewPasswordMail(email: string, randomToken: string): Promise<boolean> {
    const hostPort = process.env.WEB_APP_PORT
      ? `${process.env.WEB_APP_HOST}:${process.env.WEB_APP_PORT}`
      : process.env.WEB_APP_HOST;

    const resetLink = `${process.env.WEB_APP_PROTOCOL}://${hostPort}/${
      process.env.WEB_APP_SET_NEW_PASSWORD_PATH
    }?email=${encodeURIComponent(email)}&token=${randomToken}`;

    try {
      await this.supportMailAccount.sendMail({
        from: `"${process.env.APP_NAME}" <${process.env.APP_EMAIL}>`,
        to: email,
        subject: 'Kerbl-Welt: Passwort zurücksetzen / Reset password',
        html: `
          <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml" lang="en"></html>
          <html>
          <head>
          \t<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          \t<meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <!-- <meta name="color-scheme" content="light dark">
              <meta name="supported-color-schemes" content="light dark"> -->
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <title>Forgot-Password</title>
              <style type="text/css">
                  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&family=Source+Sans+Pro&display=swap');
          
                  table {
                      border-spacing: 0;
                  }
          
                  td {
                      padding: 0;
                  }
          
                  p {
                      font-size: 1rem;
                      letter-spacing: 0.03rem;
                      line-height: 1.5rem;
                  }
          
                  img {
                  border: 0;
                  }
          
                  a {
                  color: #7AB51D;
                  text-decoration: none;
                  }
          
          
                  @media screen and (max-width: 599.98px) {
          
                  }
                  @media screen and (max-width: 399.98px) {
          
                  }
          
                  /* Custom Dark Mode Colors */
          
                  @media (prefers-color-scheme: dark) {
          
          }
          
              </style>
          
          \t<!--[if (gte mso 9)|(IE)]>
          \t\t<style type="text/css">
          \t\t\ttable {border-collapse: collapse !important;}
          \t\t</style>
          \t<![endif]-->
          
          </head>
          <body style="Margin:0;padding:0;min-width:100%;background-color:#dbdbdb;">
              <!--[if (gte mso 9)|(IE)]>
                  <style type="text/css">
                      body {background-color: #dbdbdb!important;}
                      body, table, td, p, a {font-family: 'Roboto', sans-serif, Arial, Helvitica!important;}
                  </style>
              <![endif]-->
          
              <center style="width: 100%;table-layout:fixed;background-color: #dbdbdb;padding-bottom: 40px;">
                  <div style="max-width: 600px;background-color: #fafdfe;box-shadow: 0 0 10px rgba(0, 0, 0, .2);">
          
          
                  <!--[if (gte mso 9)|(IE)]>
                      <table width="600" align="center" style="border-spacing:0;color:#191919;" role="presentation">
                      <tr>
                      <td style="padding:0;">
                  <![endif]-->
          
          
          
                      <table align="center" style="border-spacing: 0;color:#191919;font-family: 'Roboto', sans-serif, Arial, Helvetica!important;background-color: #fafdfe;Margin:0;padding:0;width: 100%;max-width: 600px;" role="presentation">
          
                          <!-- START BANNER -->
                          <tr>
                              <td  class="banner" style="padding: 0">
                                  <!--[if (gte mso 9)|(IE)]>
                                  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:341px;">
                                      <v:fill type="tile" src="https://iot.kerbl.cloud/allgemein/images-email/image_newAccount.png" />
                                      <v:textbox inset="0,0,0,0">
                                  <![endif]-->
                                  <img src="https://iot.kerbl.cloud/allgemein/images-email/image_forgotPassword.png" style="width: 100%;">
                                  <!--[if (gte mso 9)|(IE)]>
                                  </v:textbox>
                                  </v:rect>
                                  <![endif]-->
                              </td>
                          </tr>
                          <!-- END BANNER -->
          
                          <!-- START TITLE, TEXT & BUTTON -->
                          <tr>
                              <td style="padding: 0;background-color: #ffffff;">
                                  <table width="100%" style="border-spacing: 0;" role="presentation">
                                      <tr>
                                          <td style="padding: 50px 50px 0px 50px;color: #191919;text-align: center;font-size: 16px;">
                                              <p style="font-size: 24px;font-weight: 700;">Hallo User!</p>
                                              <p>Passwort vergessen? Bitte klicke auf den Button um deine Passwort zurückzusetzen.</p>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td align="center" style="padding: 30px 50px 30px 50px;"">
                                              <table cellpadding="0" cellspacing="0" role="presentation">
                                                  <tr>
                                                      <td style="border-radius: 22px;" bgcolor="#7AB51D">
                                                          <a href="${resetLink}" target="_blank" style="font-size: 16px; font-weight: medium;text-decoration:none;color:#ffffff;background-color:  #7AB51D;border:1px solid #7AB51D;border-radius: 22px;padding: 12px 24px;display: inline-block;">Passwort zurücksetzen</a>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
          
                                      <tr>
                                          <td>
                                              <table width="75%" align="center">
                                                  <tr>
                                                      <td height="1" style="background-color: #7AB51D;"></td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                      
                                      <tr>
                                          <td style="padding: 10px 50px 50px 50px;color: #191919;text-align: center;font-size: 16px;">
                                              <p style="color: #7AB51D;text-decoration:none;">
                                                  Bei Fragen kannst du dich gerne an unseren Service wenden <a href="mailto:info@kerbl.com" style="color: #7AB51D;text-decoration:none;">info@kerbl.com</a>
                                              </p>
                                              <p style="font-size: 16px;padding-bottom: 5px;">Freundliche Grüße<br>Dein Kerbl-Welt Team</p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <!-- END TITLE, TEXT & BUTTON -->
          
          
          
                          <!-- START LINE GRAY -->
                          <tr>
                              <td style="border-top: 1px dashed #999999;"></td>
                          </tr>
                          <!-- END LINE GRAY -->
          
          
                          <!-- START TITLE, TEXT & BUTTON ENGLISH -->
                          <tr>
                              <td style="padding: 0;background-color: #ffffff;">
                                  <table width="100%" style="border-spacing: 0;" role="presentation">
                                      <tr>
                                          <td style="padding: 50px 50px 0px 50px;color: #191919;text-align: center;font-size: 16px;">
                                              <p style="font-size: 24px;font-weight: 700;">Hello, User!</p>
                                              <p>Forgot your Password? To reset your Password, click on the button below.</p>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td align="center" style="padding: 30px 50px 30px 50px;"">
                                              <table cellpadding="0" cellspacing="0" role="presentation">
                                                  <tr>
                                                      <td style="border-radius: 22px;" bgcolor="#7AB51D">
                                                          <a href="${resetLink}" target="_blank" style="font-size: 16px; font-weight: medium;text-decoration:none;color:#ffffff;background-color:  #7AB51D;border:1px solid #7AB51D;border-radius: 22px;padding: 12px 24px;display: inline-block;">Reset password</a>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
          
                                      <tr>
                                          <td>
                                              <table width="75%" align="center">
                                                  <tr>
                                                      <td height="1" style="background-color: #7AB51D;"></td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                      
                                      <tr>
                                          <td style="padding: 10px 50px 50px 50px;color: #191919;text-align: center;">
                                              <p style="color: #7AB51D;text-decoration:none;">
                                                  If you have any questions, please do not hesitate to contact our service team at <a href="mailto:info@kerbl.com" style="color: #7AB51D;text-decoration:none;">info@kerbl.com</a>
                                              </p>
                                              <p style="font-size: 16px;padding-bottom: 5px;">Best regards<br>Your Kerbl World Team</p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <!-- END TITLE, TEXT & BUTTON ENGLISH -->
          
          
                          <!-- START LOGO -->
                          <tr>
                              <td style="padding: 0;">
                                  <table width="100%" style="border-spacing: 0;background-color: #f2f2f2;" role="presentation">
              
                                      <tr>
                                          <td style="padding: 30px 0 20px 0;text-align: center;">
                                              <a href="https://www.kerbl.com" target="_blank"><img src="https://iot.kerbl.cloud/allgemein/images-email/ImgLogoKerbl.png" alt="Kerbl" border="0"></a>
                                          </td>
                                      </tr>
              
                                  </table>
                              </td>
                          </tr>
                          <!-- END LOGO -->
          
          
          
          
                          <!-- START SOCIAL ICONS -->
                          <tr>
                              <td style="padding: 0;">
                              <table width="100%" style="border-spacing: 0;" role="presentation">
                                  <tr>
                                      <td style="background-color: #f2f2f2;text-align: center;padding: 0px 0 20px 0;">
                                          <a href="https://www.facebook.com/kerbl.de/" target="_blank"><img src="https://iot.kerbl.cloud/allgemein/images-email/circle-facebook.png"  alt="Facebook" width="32" border="0"></a>
                                          <a href="https://www.youtube.com/user/KerblMedienKanal" target="_blank"><img src="https://iot.kerbl.cloud/allgemein/images-email/circle-youtube.png"  alt="YouTube" width="32" border="0"></a>
                                          <a href="https://www.instagram.com/kerbl.de/" target="_blank"><img src="https://iot.kerbl.cloud/allgemein/images-email/circle-instagram.png"  alt="Instagram" width="32" border="0"></a>
                                      </td>
                                  </tr>
                              </table>
                              </td>
                          </tr>
                          <!-- END SOCIAL ICONS -->
          
          
          
          
                          <!-- START THREE ROWS -->
                          <tr>
                              <td style="padding: 0;background-color: #7AB51D;">
                                  <table width="100%" style="border-spacing: 0;" role="presentation">        
                                      <tr>
                                          <td style="padding: 20px 0px;text-align: center;">
                                          
                                              <p style="font-size: 0.875rem; letter-spacing: 0.03rem;line-height: 1rem;"><a href="https://www.kerbl.com/de/kontakt" target="_blank" style="color: #ffffff;">Kontakt</a></p>
                                              <p style="font-size: 0.875rem; letter-spacing: 0.03rem;line-height: 1rem;"><a href="https://www.kerbl.com/de/impressum" target="_blank" style="color: #ffffff;">Impressum</a></p>
                                              <p style="font-size: 0.875rem; letter-spacing: 0.03rem;line-height: 1rem;"><a href="https://www.kerbl.com/de/datenschutzerklaerung" target="_blank" style="color: #ffffff;">Datenschutz</a></p>
                                          
                                          </td>
                                      </tr>
                              </table>
                          </td>
                      </tr>
                              <!-- END THREE COLUMNS -->
          
          
          
                      <!-- START FOOTER -->
                      <tr>
                          <td style="padding: 0;background-color: #191919;">
                          <table width="100%" style="border-spacing: 0;" role="presentation">
                              <tr>
                                  <td style="font-size: 0.75rem; letter-spacing: 0.03rem;line-height: 1rem;padding: 10px 0 10px 0;color: #999999;text-align: center;">
                                      © Albert Kerbl GmbH
                                  </td>
                              </tr>
                          </table>
                          </td>
                      </tr>
                      <!-- END FOOTER -->
          
          
          
                      </table>
          
          
          
                      <!--[if (gte mso 9)|(IE)]>
                      </td>
                      </tr>
                      </table>
                      <![endif]-->
          
          
                  </div>
              </center> 
          </body>
          </html>
        `,
      });
      this.logger.log(`Successfully sent email for setting new password to '${email}'`);
      return true;
    } catch (e) {
      this.logger.error(
        `Failed sending email for setting new password to '${email}': ${e.message}`,
      );
      return false;
    }
  }

  public async sendFenceControlSubscriptionEndsSoonMail(
    email: string,
    webAppUrl: string,
    endDate: Date,
    deviceId: string,
  ): Promise<boolean> {
    try {
      // delay in order to not reach max. email sends per second in AWS Workmail
      await new Promise((resolve) => setTimeout(resolve, 500));

      await this.fenceControlMailAccount.sendMail({
        from: `"${process.env.APP_NAME}" <${process.env.FENCE_CONTROL_EMAIL}>`,
        to: email,
        subject:
          'Erinnerung: FenceControl Abo endet bald / Reminder: FenceControl subscription ends soon',
        html: `
        <html>
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
            </style>
        </head>
        
            <body style="max-width: 600px; font-family: 'Roboto', sans-serif;border: 1px solid #0000001A;">
        
            <div style="text-align: center; ">
                <img src="https://fence-control-subscription-email.s3.amazonaws.com/assets/newsletter-img.png"
                    style="max-width: 100%;">
                <h1 style="margin-top: 32px;">Vielen Dank!</h1>
                <p style="margin-left: 6%; margin-right: 6%; font-size: 18px; overflow-wrap: break-word;">
                    Danke für die
                    vergangenen Jahre, in denen du mit deiner AKO
                    FenceControl<sup style="font-size: 10px;">1)</sup> die Sicherheit
                    deiner Elektrozaunanlage immer im Griff hattest.
                    Am <span style="font-weight: 700; color: #D20029;">${endDate.toLocaleDateString(
                      'de-DE',
                    )}</span>
                    endet die Laufzeit deiner FenceControl Mobilfunkanbindung (ID: ${deviceId}).
                    Klicke hier, um Sie zu verlängern:</p>
                <a href="${webAppUrl}" target="_blank"
                    style="margin-top: 16px; margin-bottom: 16px; border-radius: 9999px; border-width: 1px; border-style: solid; border-color: #7AB51D; padding-top: 4px; padding-bottom: 4px; padding-left: 20px; padding-right: 20px; font-size: 17px; text-decoration: none;">
                    <span style="color:#7AB51D">Laufzeitverlängerung</span>
                </a>
                <p style=" margin-left: 12%;margin-right: 12%; color: #7AB51D; font-size: 16px; margin-top: 30px;">
                    <sup style="font-size: 10px;">1)</sup>
                    Die AKO FenceControl-App und die AKO Agrartechnik GmbH sind Teil der Albert Kerbl GmbH
                </p>
                <p
                    style=" margin-left: 12%;margin-right: 12%;  background-color: #F1F7E8; padding: 28px 10px 28px 10px; margin-bottom: 54px;margin-top: 10px;">
                    Bei Fragen kannst du dich gerne an unseren Service wenden <a
                        href="mailto:weidezaun@kerbl.com">weidezaun@kerbl.com</a>
                </p>
            </div>
            <div style="text-align: center; border-top: 1px dashed #999999;">
                <h1 style="margin-top: 32px;">Thank you!</h1>
                <p style="margin-left: 6%; margin-right: 6%;  font-size: 18px;  overflow-wrap: break-word;">
                    Thank you for
                    the past years in which you always had the security of your electric fence system under control with your
                    AKO FenceControl<sup style="font-size: 10px;">1)</sup>. The term of your FenceControl mobile radio
                    connection (ID: ${deviceId}) is due to end on <span
                        style="font-weight: 700; color: #D20029;">${endDate.toLocaleDateString(
                          'en',
                        )}</span>. Click
                    here to extend it:</p>
                <a href="${webAppUrl}" target="_blank"
                    style="margin-top: 16px; margin-bottom: 16px; border-radius: 9999px; border-width: 1px; border-style: solid; --tw-border-opacity: 1; border-color: #7AB51D; padding-top: 4px; padding-bottom: 4px; padding-left: 20px; padding-right: 20px; font-size: 17px; text-decoration: none;">
                    <span style="color:#7AB51D">Termextension</span>
                </a>
                <p style=" margin-left: 12%;margin-right: 12%; color: #7AB51D; font-size: 16px; margin-top: 30px;">
                    <sup style="font-size: 10px;">1)</sup>
                    The AKO FenceControl app and AKO Agrartechnik GmbH are part of Albert Kerbl GmbH
                </p>
                <p
                    style=" margin-left: 12%;margin-right: 12%;background-color: #F1F7E8;padding: 28px 10px 28px 10px; margin-bottom: 54px;margin-top: 10px;">
                    If you have any questions, please do not hesitate to contact our service team at <a
                        href="mailto:weidezaun@kerbl.com">weidezaun@kerbl.com</a>
                </p>
            </div>
            <div style="text-align: center;background-color: #f2f2f2;">
                <div style="padding-top:35px">
                    <a href="https://kerbl.com" target="_blank"
                        style="margin-right: 12px; --tw-text-opacity: 1; color: #767676;">Kontakt</a>
                    <a href="https://kerbl.com" target="_blank"
                        style="margin-right: 12px; --tw-text-opacity: 1; color: #767676;">Impressum</a>
                    <a href="https://kerbl.com" target="_blank" style="--tw-text-opacity: 1; color: #767676;">Datenschutz</a>
                </div>
                <div style="padding-top:35px">
                    <a class="mr-3" href="https://www.facebook.com/kerbl.de/" target="_blank"
                        style="margin-right: 12px; text-decoration: none;"> <img
                            src="https://fence-control-subscription-email.s3.amazonaws.com/assets/facebook.png" alt> </a>
                    <a class="mr-3" href="https://www.youtube.com/user/KerblMedienKanal" target="_blank"
                        style="margin-right: 12px; text-decoration: none;">
                        <img src="https://fence-control-subscription-email.s3.amazonaws.com/assets/youtube.png" alt> </a>
                    <a href="https://www.instagram.com/kerbl.de/" target="_blank"> <img
                            src="https://fence-control-subscription-email.s3.amazonaws.com/assets/instagram.png" alt> </a>
                </div>
                <div style="padding-top:27px; padding-bottom: 42px;">
                    <img src="https://fence-control-subscription-email.s3.amazonaws.com/assets/ako logo bottom.png">
                </div>
            </div>
            <div style="background: #999999;text-align: center; padding-top:19px; padding-bottom:19px; ">
                <span style="color:#FFFFFF;">© Albert Kerbl GmbH</span>
            </div>
        </body>
        
      </html>`,
      });
      this.logger.log(
        `Successfully sent email for renewing the FenceControl subscription to '${email}'`,
      );
      return true;
    } catch (e) {
      this.logger.error(
        `Failed sending email for renewing the FenceControl subscription to '${email}': ${e.message}`,
      );
      return false;
    }
  }

  public async sendNotification(email: string, notification: MailNotification): Promise<boolean> {
    try {
      await this.supportMailAccount.sendMail({
        from: `"${process.env.APP_NAME}" <${process.env.APP_EMAIL}>`,
        to: email,
        subject: notification.title,
        html: notification.content,
      });

      this.logger.log(`Successfully sent notification(s) to '${email}'`);
      return true;
    } catch (e) {
      this.logger.error(`Failed sending notification(s) to '${email}': ${e.message}`);
      return false;
    }
  }
}

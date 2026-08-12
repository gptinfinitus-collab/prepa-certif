import * as React from "react";
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import {
  SITE_NAME,
  SITE_URL,
  EmailLogo,
  EmailFooter,
  main,
  container,
  h1,
  text,
  button,
  type EmailLocale,
} from "./email-brand";

interface InviteEmailProps {
  siteName: string;
  siteUrl: string;
  confirmationUrl: string;
  locale?: EmailLocale;
}

export const InviteEmail = ({ confirmationUrl, locale = "fr" }: InviteEmailProps) => {
  if (locale === "en") {
    return (
      <Html lang="en" dir="ltr">
        <Head />
        <Preview>You have been invited to join {SITE_NAME}</Preview>
        <Body style={main}>
          <Container style={container}>
            <EmailLogo />
            <Heading style={h1}>You have been invited</Heading>
            <Text style={text}>
              You have received an invitation to join <strong>{SITE_NAME}</strong>, your preparation
              space for ISO auditor certifications. Click the button below to accept the invitation
              and create your account:
            </Text>
            <Button style={button} href={confirmationUrl}>
              Accept the invitation
            </Button>
            <Text style={text}>
              If the button doesn't work, you can also paste this link into your browser:
              <br />
              {confirmationUrl}
            </Text>
            <Text style={{ ...text, fontSize: "14px", color: "#6b7280" }}>
              If you weren't expecting this invitation, simply ignore this email.
            </Text>
            <EmailFooter locale={locale} />
          </Container>
        </Body>
      </Html>
    );
  }
  return (
    <Html lang="fr" dir="ltr">
      <Head />
      <Preview>Vous avez été invité à rejoindre {SITE_NAME}</Preview>
      <Body style={main}>
        <Container style={container}>
          <EmailLogo />
          <Heading style={h1}>Vous avez été invité</Heading>
          <Text style={text}>
            Vous avez reçu une invitation pour rejoindre <strong>{SITE_NAME}</strong>, votre espace de
            préparation aux certifications d'auditeur ISO. Cliquez sur le bouton ci-dessous pour accepter
            l'invitation et créer votre compte :
          </Text>
          <Button style={button} href={confirmationUrl}>
            Accepter l'invitation
          </Button>
          <Text style={text}>
            Si le bouton ne s'affiche pas, vous pouvez aussi coller ce lien dans votre navigateur :
            <br />
            {confirmationUrl}
          </Text>
          <Text style={{ ...text, fontSize: "14px", color: "#6b7280" }}>
            Si vous ne vous attendiez pas à cette invitation, ignorez cet e-mail.
          </Text>
          <EmailFooter locale={locale} />
        </Container>
      </Body>
    </Html>
  );
};

export default InviteEmail;

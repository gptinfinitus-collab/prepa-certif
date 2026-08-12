import * as React from "react";
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import {
  SITE_NAME,
  EmailLogo,
  EmailFooter,
  main,
  container,
  h1,
  text,
  button,
  type EmailLocale,
} from "./email-brand";

interface RecoveryEmailProps {
  siteName: string;
  confirmationUrl: string;
  locale?: EmailLocale;
}

export const RecoveryEmail = ({ confirmationUrl, locale = "fr" }: RecoveryEmailProps) => {
  if (locale === "en") {
    return (
      <Html lang="en" dir="ltr">
        <Head />
        <Preview>Reset your password — {SITE_NAME}</Preview>
        <Body style={main}>
          <Container style={container}>
            <EmailLogo />
            <Heading style={h1}>Reset your password</Heading>
            <Text style={text}>
              You requested a password reset for <strong>{SITE_NAME}</strong>. Click the button
              below to choose a new one. This link expires in 1 hour.
            </Text>
            <Button style={button} href={confirmationUrl}>
              Choose a new password
            </Button>
            <Text style={text}>
              If the button doesn't work, you can also paste this link into your browser:
              <br />
              {confirmationUrl}
            </Text>
            <Text style={{ ...text, fontSize: "14px", color: "#6b7280" }}>
              If you did not request this, ignore this email. Your password will not be changed.
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
      <Preview>Réinitialisation de votre mot de passe — {SITE_NAME}</Preview>
      <Body style={main}>
        <Container style={container}>
          <EmailLogo />
          <Heading style={h1}>Réinitialisation de votre mot de passe</Heading>
          <Text style={text}>
            Vous avez demandé la réinitialisation de votre mot de passe pour <strong>{SITE_NAME}</strong>.
            Cliquez sur le bouton ci-dessous pour en choisir un nouveau. Ce lien expire dans 1 heure.
          </Text>
          <Button style={button} href={confirmationUrl}>
            Choisir un nouveau mot de passe
          </Button>
          <Text style={text}>
            Si le bouton ne s'affiche pas, vous pouvez aussi coller ce lien dans votre navigateur :
            <br />
            {confirmationUrl}
          </Text>
          <Text style={{ ...text, fontSize: "14px", color: "#6b7280" }}>
            Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail. Votre mot de passe ne
            sera pas modifié.
          </Text>
          <EmailFooter locale={locale} />
        </Container>
      </Body>
    </Html>
  );
};

export default RecoveryEmail;

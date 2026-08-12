import * as React from "react";
import { Body, Button, Container, Head, Heading, Html, Link, Preview, Text } from "@react-email/components";
import {
  SITE_NAME,
  EmailLogo,
  EmailFooter,
  main,
  container,
  h1,
  text,
  button,
  link,
  type EmailLocale,
} from "./email-brand";

interface EmailChangeEmailProps {
  siteName: string;
  oldEmail: string;
  email: string;
  newEmail: string;
  confirmationUrl: string;
  locale?: EmailLocale;
}

export const EmailChangeEmail = ({
  oldEmail,
  newEmail,
  confirmationUrl,
  locale = "fr",
}: EmailChangeEmailProps) => {
  if (locale === "en") {
    return (
      <Html lang="en" dir="ltr">
        <Head />
        <Preview>Confirm your email address change — {SITE_NAME}</Preview>
        <Body style={main}>
          <Container style={container}>
            <EmailLogo />
            <Heading style={h1}>Confirm your email address change</Heading>
            <Text style={text}>
              You requested to change the email address of your <strong>{SITE_NAME}</strong> account{" "}
              from <Link href={`mailto:${oldEmail}`} style={link}>{oldEmail}</Link> to{" "}
              <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>.
            </Text>
            <Text style={text}>Click the button below to confirm this change:</Text>
            <Button style={button} href={confirmationUrl}>
              Confirm the change
            </Button>
            <Text style={text}>
              If the button doesn't work, you can also paste this link into your browser:
              <br />
              {confirmationUrl}
            </Text>
            <Text style={{ ...text, fontSize: "14px", color: "#6b7280" }}>
              If you did not request this change, we recommend securing your account by changing your
              password immediately.
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
      <Preview>Confirmez le changement d'adresse e-mail — {SITE_NAME}</Preview>
      <Body style={main}>
        <Container style={container}>
          <EmailLogo />
          <Heading style={h1}>Confirmez le changement d'adresse e-mail</Heading>
          <Text style={text}>
            Vous avez demandé de remplacer l'adresse e-mail de votre compte <strong>{SITE_NAME}</strong>{" "}
            de <Link href={`mailto:${oldEmail}`} style={link}>{oldEmail}</Link> à{" "}
            <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>.
          </Text>
          <Text style={text}>Cliquez sur le bouton ci-dessous pour confirmer ce changement :</Text>
          <Button style={button} href={confirmationUrl}>
            Confirmer le changement
          </Button>
          <Text style={text}>
            Si le bouton ne s'affiche pas, vous pouvez aussi coller ce lien dans votre navigateur :
            <br />
            {confirmationUrl}
          </Text>
          <Text style={{ ...text, fontSize: "14px", color: "#6b7280" }}>
            Si vous n'êtes pas à l'origine de cette demande, nous vous recommandons de sécuriser votre
            compte en changeant immédiatement votre mot de passe.
          </Text>
          <EmailFooter locale={locale} />
        </Container>
      </Body>
    </Html>
  );
};

export default EmailChangeEmail;

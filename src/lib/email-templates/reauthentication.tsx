import * as React from "react";
import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import {
  SITE_NAME,
  EmailLogo,
  EmailFooter,
  main,
  container,
  h1,
  text,
  codeStyle,
  type EmailLocale,
} from "./email-brand";

interface ReauthenticationEmailProps {
  token: string;
  locale?: EmailLocale;
}

export const ReauthenticationEmail = ({ token, locale = "fr" }: ReauthenticationEmailProps) => {
  if (locale === "en") {
    return (
      <Html lang="en" dir="ltr">
        <Head />
        <Preview>Your verification code — {SITE_NAME}</Preview>
        <Body style={main}>
          <Container style={container}>
            <EmailLogo />
            <Heading style={h1}>Confirm your identity</Heading>
            <Text style={text}>
              Here is the verification code requested to access your <strong>{SITE_NAME}</strong>{" "}
              account. Enter it in the application to continue.
            </Text>
            <Text style={codeStyle}>{token}</Text>
            <Text style={{ ...text, fontSize: "14px", color: "#6b7280" }}>
              This code expires shortly. If you did not request this verification, ignore this email.
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
      <Preview>Votre code de vérification — {SITE_NAME}</Preview>
      <Body style={main}>
        <Container style={container}>
          <EmailLogo />
          <Heading style={h1}>Confirmer votre identité</Heading>
          <Text style={text}>
            Voici le code de vérification demandé pour accéder à votre compte <strong>{SITE_NAME}</strong>.
            Saisissez-le dans l'application pour poursuivre.
          </Text>
          <Text style={codeStyle}>{token}</Text>
          <Text style={{ ...text, fontSize: "14px", color: "#6b7280" }}>
            Ce code expire sous peu. Si vous n'avez pas demandé cette vérification, ignorez cet e-mail.
          </Text>
          <EmailFooter locale={locale} />
        </Container>
      </Body>
    </Html>
  );
};

export default ReauthenticationEmail;

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

interface SignupEmailProps {
  siteName: string;
  siteUrl: string;
  recipient: string;
  confirmationUrl: string;
  locale?: EmailLocale;
}

export const SignupEmail = ({ confirmationUrl, locale = "fr" }: SignupEmailProps) => {
  if (locale === "en") {
    return (
      <Html lang="en" dir="ltr">
        <Head />
        <Preview>Confirm your email address for {SITE_NAME}</Preview>
        <Body style={main}>
          <Container style={container}>
            <EmailLogo />
            <Heading style={h1}>Confirm your email address</Heading>
            <Text style={text}>
              Thank you for signing up on <strong>{SITE_NAME}</strong>. To activate your account and
              start your preparation, click the button below:
            </Text>
            <Button style={button} href={confirmationUrl}>
              Confirm my account
            </Button>
            <Text style={text}>
              If the button doesn't work, you can also paste this link into your browser:
              <br />
              {confirmationUrl}
            </Text>
            <Text style={{ ...text, fontSize: "14px", color: "#6b7280" }}>
              If you did not request this sign-up, simply ignore this email. Your address will not
              be used.
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
      <Preview>Confirmez votre adresse e-mail pour {SITE_NAME}</Preview>
      <Body style={main}>
        <Container style={container}>
          <EmailLogo />
          <Heading style={h1}>Confirmez votre adresse e-mail</Heading>
          <Text style={text}>
            Merci de votre inscription sur <strong>{SITE_NAME}</strong>. Pour activer votre compte et
            accéder à votre préparation, cliquez sur le bouton ci-dessous :
          </Text>
          <Button style={button} href={confirmationUrl}>
            Confirmer mon compte
          </Button>
          <Text style={text}>
            Si le bouton ne s'affiche pas, vous pouvez aussi coller ce lien dans votre navigateur :
            <br />
            {confirmationUrl}
          </Text>
          <Text style={{ ...text, fontSize: "14px", color: "#6b7280" }}>
            Si vous n'êtes pas à l'origine de cette inscription, ignorez simplement cet e-mail. Votre
            adresse ne sera pas utilisée.
          </Text>
          <EmailFooter locale={locale} />
        </Container>
      </Body>
    </Html>
  );
};

export default SignupEmail;

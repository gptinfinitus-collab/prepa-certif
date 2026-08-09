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
} from "./email-brand";

interface EmailChangeEmailProps {
  siteName: string;
  oldEmail: string;
  email: string;
  newEmail: string;
  confirmationUrl: string;
}

export const EmailChangeEmail = ({
  oldEmail,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
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
        <EmailFooter />
      </Container>
    </Body>
  </Html>
);

export default EmailChangeEmail;

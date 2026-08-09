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
} from "./email-brand";

interface RecoveryEmailProps {
  siteName: string;
  confirmationUrl: string;
}

export const RecoveryEmail = ({ confirmationUrl }: RecoveryEmailProps) => (
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
        <EmailFooter />
      </Container>
    </Body>
  </Html>
);

export default RecoveryEmail;

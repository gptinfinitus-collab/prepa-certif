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

interface MagicLinkEmailProps {
  siteName: string;
  confirmationUrl: string;
}

export const MagicLinkEmail = ({ confirmationUrl }: MagicLinkEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Votre lien de connexion — {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <EmailLogo />
        <Heading style={h1}>Votre lien de connexion</Heading>
        <Text style={text}>
          Cliquez sur le bouton ci-dessous pour vous connecter à <strong>{SITE_NAME}</strong>. Ce
          lien est temporaire et expirera sous peu.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Me connecter
        </Button>
        <Text style={text}>
          Si le bouton ne s'affiche pas, vous pouvez aussi coller ce lien dans votre navigateur :
          <br />
          {confirmationUrl}
        </Text>
        <Text style={{ ...text, fontSize: "14px", color: "#6b7280" }}>
          Si vous n'avez pas demandé ce lien, vous pouvez ignorer cet e-mail en toute sécurité.
        </Text>
        <EmailFooter />
      </Container>
    </Body>
  </Html>
);

export default MagicLinkEmail;

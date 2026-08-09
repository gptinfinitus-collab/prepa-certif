import * as React from "react";
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import {
  SITE_NAME,
  SITE_URL,
  CONTACT_EMAIL,
  EmailLogo,
  EmailFooter,
  main,
  container,
  h1,
  text,
  button,
} from "./email-brand";

interface SignupEmailProps {
  siteName: string;
  siteUrl: string;
  recipient: string;
  confirmationUrl: string;
}

export const SignupEmail = ({ confirmationUrl }: SignupEmailProps) => (
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
        <EmailFooter />
      </Container>
    </Body>
  </Html>
);

export default SignupEmail;

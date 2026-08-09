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
} from "./email-brand";

interface ReauthenticationEmailProps {
  token: string;
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
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
        <EmailFooter />
      </Container>
    </Body>
  </Html>
);

export default ReauthenticationEmail;

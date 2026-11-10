import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import cipherCss from "@/cipher/cipher.css?url";
import cipherMarkupTemplate from "@/cipher/cipher-markup.html?raw";
import { startCipher } from "@/cipher/engine";
import logoAsset from "@/assets/cissna-hooded-emblem.png.asset.json";
import microSdImage from "@/assets/sandisk-microsd.jpg";

// Original page markup, with the uploaded emblem swapped in. Constant string so
// React never re-renders over the DOM the page script manages.
const cipherMarkup = cipherMarkupTemplate.split("__CIPHER_LOGO__").join(logoAsset.url).split("__MICROSD_IMAGE__").join(microSdImage);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "C.I.P.H.E.R. — Secure Workspace" },
      {
        name: "description",
        content:
          "C.I.P.H.E.R. secure workspace — field terminal, encrypted files and perimeter radar for CISSNA operations.",
      },
      { property: "og:title", content: "C.I.P.H.E.R. — Secure Workspace" },
      {
        property: "og:description",
        content: "Insert your C.I.P.H.E.R. Key to open the CISSNA private workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: cipherCss }],
  }),
  component: CipherPage,
});

function CipherPage() {
  useEffect(() => {
    startCipher();
  }, []);

  return <div id="cipher-app" dangerouslySetInnerHTML={{ __html: cipherMarkup }} />;
}

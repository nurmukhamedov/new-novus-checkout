import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
     mutation checkoutBrandingUpsert($checkoutBrandingInput: CheckoutBrandingInput!, $checkoutProfileId: ID!) {
      checkoutBrandingUpsert(checkoutBrandingInput: $checkoutBrandingInput, checkoutProfileId: $checkoutProfileId) {
        userErrors {
          message
        }
      }
    }`,
    {
      variables: {
        checkoutProfileId: "gid://shopify/CheckoutProfile/19169462",
        checkoutBrandingInput: {
          customizations: {
            primaryButton: { "cornerRadius": "NONE", "inlinePadding": "TIGHT", "blockPadding": "EXTRA_TIGHT", "typography": { "weight": "BOLD", "size": "LARGE" } },
            checkbox: {
              "cornerRadius": "NONE"
            },
            headingLevel2: {
              typography: {
                "size": "MEDIUM",
                "font": "SECONDARY"
              }
            }
          },
          designSystem: {
            typography: {
              primary: {
                customFontGroup: {
                  base: {
                    "genericFileId": "gid://shopify/GenericFile/26882860023990",
                    "weight": 600
                  },
                  bold: {
                    "genericFileId": "gid://shopify/GenericFile/26882860023990",
                    "weight": 600
                  }
                }
              },
              secondary: {
                customFontGroup: {
                  base: {
                    "genericFileId": "gid://shopify/GenericFile/26882860318902",
                    "weight": 500
                  },
                  bold: {
                    "genericFileId": "gid://shopify/GenericFile/26882860318902",
                    "weight": 500
                  }
                }
              },
            },
            "colors": {
              "schemes": {
                "scheme2": {
                  "base": {
                    "background": "#F5F5F5",
                    "text": "#515151"
                  }
                }
              }
            }
          }
        },
      },
    }
  );
  const responseJson = await response.json();



  return json({
    result: responseJson
  });
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData();
  const submit = useSubmit();
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  const generateProduct = () => submit({}, { replace: true, method: "POST" });

  return (
    <Page>
      <ui-title-bar title="Remix app template">
        <button
          variant="primary"
          onClick={generateProduct}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Generate a data"}
        </button>
      </ui-title-bar>
      <div><pre>{JSON.stringify(actionData?.result?.data, null, 2)}</pre></div>
    </Page>
  );
}

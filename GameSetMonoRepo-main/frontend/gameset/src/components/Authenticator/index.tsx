import { Authenticator, CheckboxField, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useOutletContext } from "react-router-dom";
import useScreenSize from "../../hooks/useScreenSize";
import "./index.css";

export const CustomAuthenticator = (props: any) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const { width, height } = useScreenSize();
  const isSidebarOpen = useOutletContext();

  function calculateMaxWidth() {
    if (width > 800) {
      if (isSidebarOpen === true) {
        return "calc(100% - 250px)";
      } else if (isSidebarOpen === false) {
        return "calc(100% - 70px)";
      } else {
        return "100%";
      }
    } else {
      return "100%";
    }
  }

  return (
    <div
      className={`authenticator-class ${user ? "" : "huge-z-index"}`}
      style={{ maxWidth: calculateMaxWidth(), maxHeight: "calc(100% - 100px)" }}
    >
      <Authenticator
        variation="modal"
        signUpAttributes={["birthdate", "email", "name", "family_name", "phone_number"]}
        socialProviders={["google"]}
        components={{
          SignUp: {
            FormFields() {
              const { validationErrors } = useAuthenticator();

              return (
                <>
                  <Authenticator.SignUp.FormFields />

                  <CheckboxField
                    errorMessage={validationErrors.acknowledgement as string}
                    hasError={!!validationErrors.acknowledgement}
                    name="acknowledgement"
                    value="yes"
                    label="I agree with the Terms and Conditions"
                  />
                </>
              );
            },
          },
        }}
        services={{
          async validateCustomSignUp(formData) {
            if (!formData.acknowledgement) {
              return {
                acknowledgement: "You must agree to the Terms and Conditions",
              };
            }
          },
        }}
      >
        <>{props.children}</>
      </Authenticator>
    </div>
  );
};

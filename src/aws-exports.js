const awsmobile = {
    aws_project_region: "us-east-1",
  
    // Cognito Identity Pool (for unauthenticated access)
    aws_cognito_identity_pool_id: "us-east-1:f1aaadfc-90cb-4380-bf52-f31ad1ba4915",
  
    // Cognito User Pool (for authentication)
    aws_cognito_region: "us-east-1",
    aws_user_pools_id: "us-east-1_TRav7O8Va",
    aws_user_pools_web_client_id: "67kkj6duf572rn2m2scjmu9e8h",
  
    // Auth settings
    oauth: {},
    aws_cognito_username_attributes: ["EMAIL"],
    aws_cognito_social_providers: [],
    aws_cognito_signup_attributes: ["EMAIL"],
    aws_cognito_mfa_configuration: "OFF",
    aws_cognito_mfa_types: ["SMS"],
    aws_cognito_password_protection_settings: {
      passwordPolicyMinLength: 8,
      passwordPolicyCharacters: []
    },
    aws_cognito_verification_mechanisms: ["EMAIL"],
  
    // Amplify Auth block
    Auth: {
      region: "us-east-1",
      userPoolId: "us-east-1_TRav7O8Va",
      userPoolWebClientId: "67kkj6duf572rn2m2scjmu9e8h",
      identityPoolId: "us-east-1:f1aaadfc-90cb-4380-bf52-f31ad1ba4915",
      mandatorySignIn: true,
      authenticationFlowType: "USER_PASSWORD_AUTH"
    },
  
    // PubSub (for AWS IoT over MQTT)
    PubSub: {
      region: "us-east-1",
      endpoint: "wss://a78qswyme5zdw-ats.iot.us-east-1.amazonaws.com/mqtt"
    },
  
    // ✅ Used in App.js to construct the PubSub endpoint
    aws_iot_endpoint: "a78qswyme5zdw-ats.iot.us-east-1.amazonaws.com"
  };
  
  export default awsmobile;
  
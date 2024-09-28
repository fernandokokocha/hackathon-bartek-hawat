param staticSites_chatbot string = 'hackathon-tax-chatbot'

resource staticSites_chatbot_resource 'Microsoft.Web/staticSites@2023-12-01' = {
  name: staticSites_chatbot
  location: 'West Europe'
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: 'https://github.com/fernandokokocha/hackathon-bartek-hawat'
    branch: 'main'
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    provider: 'GitHub'
    enterpriseGradeCdnStatus: 'Disabled'
    buildProperties: {
      appLocation: '/'
      apiLocation:  ''
      appArtifactLocation: 'dist'
    }
  }
}

resource staticSites_bartek_brother_chat_name_default 'Microsoft.Web/staticSites/basicAuth@2023-12-01' = {
  parent: staticSites_chatbot_resource
  name: 'default'
  location: 'West Europe'
  properties: {
    applicableEnvironmentsMode: 'SpecifiedEnvironments'
  }
}

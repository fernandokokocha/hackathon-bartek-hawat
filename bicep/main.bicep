targetScope = 'subscription'

param resourceGroupName string = 'Hackathon-Dev-RSG'
param rsgLocation string = 'westeurope'
param time string = utcNow()

resource newRresourceGroup 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: rsgLocation
}

module wa './webapp.bicep' = {
  name: 'WebAppDeployment${time}'
  scope: newRresourceGroup
}

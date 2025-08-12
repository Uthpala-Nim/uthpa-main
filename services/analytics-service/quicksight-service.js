const { 
  QuickSightClient, 
  CreateDataSourceCommand,
  CreateDataSetCommand,
  CreateDashboardCommand
} = require('@aws-sdk/client-quicksight');

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;
const QUICKSIGHT_USER = process.env.QUICKSIGHT_USER;

const quicksightClient = new QuickSightClient({ region: AWS_REGION });

async function createClickHouseDataSource() {
  const params = {
    AwsAccountId: AWS_ACCOUNT_ID,
    DataSourceId: 'clickhouse-gaming-analytics',
    Name: 'ClickHouse Gaming Analytics',
    Type: 'CUSTOM_SQL',
    DataSourceParameters: {
      CustomSql: {
        CredentialPair: {
          Username: process.env.CLICKHOUSE_USER || 'default',
          Password: process.env.CLICKHOUSE_PASSWORD || ''
        },
        DatabaseName: 'default',
        SqlEndpoint: process.env.CLICKHOUSE_HOST || 'http://localhost:8123'
      }
    },
    Permissions: [{
      Principal: QUICKSIGHT_USER,
      Actions: [
        'quicksight:DescribeDataSource',
        'quicksight:DescribeDataSourcePermissions',
        'quicksight:PassDataSource',
        'quicksight:UpdateDataSource',
        'quicksight:DeleteDataSource',
        'quicksight:UpdateDataSourcePermissions'
      ]
    }]
  };

  try {
    const command = new CreateDataSourceCommand(params);
    const response = await quicksightClient.send(command);
    console.log('Created QuickSight data source:', response);
    return response;
  } catch (error) {
    console.error('Error creating QuickSight data source:', error);
    throw error;
  }
}

async function createAnalyticsDashboard() {
  // Define dataset for user events
  const eventDataSetParams = {
    AwsAccountId: AWS_ACCOUNT_ID,
    DataSetId: 'gaming-events-dataset',
    Name: 'Gaming Platform Events',
    PhysicalTableMap: {
      'events': {
        CustomSql: {
          DataSourceArn: `arn:aws:quicksight:${AWS_REGION}:${AWS_ACCOUNT_ID}:datasource/clickhouse-gaming-analytics`,
          Name: 'Gaming Events',
          SqlQuery: `
            SELECT 
              ts,
              session_id,
              event,
              path,
              value
            FROM events
            WHERE ts >= dateadd('day', -7, now())
          `
        }
      }
    },
    LogicalTableMap: {
      'EVENTS': {
        Alias: 'Gaming Events',
        Source: {
          PhysicalTableId: 'events'
        }
      }
    },
    ImportMode: 'DIRECT_QUERY',
    Permissions: [{
      Principal: QUICKSIGHT_USER,
      Actions: [
        'quicksight:DescribeDataSet',
        'quicksight:DescribeDataSetPermissions',
        'quicksight:PassDataSet',
        'quicksight:DescribeIngestion',
        'quicksight:ListIngestions',
        'quicksight:UpdateDataSet',
        'quicksight:DeleteDataSet',
        'quicksight:UpdateDataSetPermissions',
        'quicksight:CreateIngestion',
        'quicksight:CancelIngestion'
      ]
    }]
  };

  // Create dashboard with various visualizations
  const dashboardParams = {
    AwsAccountId: AWS_ACCOUNT_ID,
    DashboardId: 'gaming-analytics-dashboard',
    Name: 'Gaming Platform Analytics',
    Permissions: [{
      Principal: QUICKSIGHT_USER,
      Actions: [
        'quicksight:DescribeDashboard',
        'quicksight:ListDashboardVersions',
        'quicksight:UpdateDashboardPermissions',
        'quicksight:QueryDashboard',
        'quicksight:UpdateDashboard',
        'quicksight:DeleteDashboard',
        'quicksight:DescribeDashboardPermissions',
        'quicksight:UpdateDashboardPublishedVersion'
      ]
    }],
    SourceEntity: {
      SourceTemplate: {
        DataSetReferences: [{
          DataSetPlaceholder: 'events',
          DataSetArn: `arn:aws:quicksight:${AWS_REGION}:${AWS_ACCOUNT_ID}:dataset/gaming-events-dataset`
        }],
        Arn: `arn:aws:quicksight:${AWS_REGION}:${AWS_ACCOUNT_ID}:template/gaming-analytics-template`
      }
    },
    DashboardPublishOptions: {
      AdHocFilteringOption: {
        AvailabilityStatus: 'ENABLED'
      },
      ExportToCSVOption: {
        AvailabilityStatus: 'ENABLED'
      },
      SheetControlsOption: {
        VisibilityState: 'EXPANDED'
      }
    },
    VersionDescription: 'Initial version of gaming analytics dashboard'
  };

  try {
    // Create dataset
    const datasetCommand = new CreateDataSetCommand(eventDataSetParams);
    await quicksightClient.send(datasetCommand);

    // Create dashboard
    const dashboardCommand = new CreateDashboardCommand(dashboardParams);
    const response = await quicksightClient.send(dashboardCommand);
    
    console.log('Created QuickSight dashboard:', response);
    return response;
  } catch (error) {
    console.error('Error creating QuickSight assets:', error);
    throw error;
  }
}

module.exports = {
  createClickHouseDataSource,
  createAnalyticsDashboard
};

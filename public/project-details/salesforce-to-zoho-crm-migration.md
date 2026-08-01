## The problem

More than 2 million records had to move from Salesforce to Zoho CRM without losing module relationships or the source IDs needed for later attachment work. Salesforce also had to remain available during the initial import so day-to-day work could continue while the Zoho data was checked.

## What moved

The migration covered six CRM modules:

- Leads: 14,313
- Contacts: 5,979
- Accounts: 4,162
- Opportunities: 17,244
- Products: 241
- Tasks: 182,070

## How I prepared the data

- Exported each Salesforce module in a structured format
- Removed duplicate and invalid records
- Normalised dates and picklist values for Zoho CRM
- Checked required fields before import
- Mapped Salesforce fields to existing and custom Zoho fields

## How I preserved relationships

Salesforce record IDs were stored in Zoho CRM so records could be traced back to their source. Those IDs also support later attachment migration, reconciliation, and checks between related modules.

## How the import was staged

The first full import ran while Salesforce remained the active CRM. This gave the team time to check the Zoho records, correct mapping issues, and prepare for the final changeover without pausing normal CRM work.

## Result

More than 2 million records moved across six CRM modules while Salesforce remained available for day-to-day work. Salesforce IDs and module relationships were retained for validation and later attachment migration.

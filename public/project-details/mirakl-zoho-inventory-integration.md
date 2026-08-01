## The problem

Marketplace orders were being handled across Mirakl and Zoho Inventory, with shipment updates, documents, and failed syncs requiring manual coordination. The integration needed to move orders on a schedule, avoid duplicates, and make failures visible to the support team.

## What the integration does

### Import Mirakl orders

- Fetches new and pending orders on a schedule
- Processes orders in batches
- Checks for an existing order before creating one in Zoho Inventory
- Accepts eligible marketplace orders

### Return shipment updates

- Sends shipment and fulfilment updates back to Mirakl
- Keeps marketplace order status aligned with Zoho Inventory

### Handle order documents

- Moves the documents required by the order process
- Makes those files available to the teams working in Zoho

### Record failed syncs

- Logs errors and exceptions in Zoho Desk
- Gives the support team one place to review failed syncs and unusual cases

## Technical implementation

- Scheduled triggers start each import
- REST APIs move order and shipment data between Mirakl and Zoho Inventory
- Validation runs before records are created or updated
- Zoho Desk stores errors and exceptions that need review

## Result

New Mirakl orders are imported on a schedule, checked for duplicates, and created in Zoho Inventory. Shipment updates return to Mirakl, while failed syncs are recorded in Zoho Desk for review.

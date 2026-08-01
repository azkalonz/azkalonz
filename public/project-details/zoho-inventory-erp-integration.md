## The problem

Orders in Zoho Inventory had to reach a third-party ERP with the shipping, production, add-on, and invoice details needed by sales, fulfilment, and production teams. The ERP API had limited documentation, so its order and attachment behaviour also had to be tested directly.

## What the integration sends

Each eligible order can include:

- Order number, reference, status, and custom fields
- Order notes
- Expected despatch and shipment dates
- Shipping and recipient contact details
- Item add-ons
- Palletise Order and Urgent Production flags
- Invoice PDFs

## Routing and packing

Despatch-location rules decide which orders enter the integration. Eligible items are packed during the sync before the complete order record is sent to the ERP.

## Invoice attachments

Invoice PDFs are attached to the ERP order through the available `/orders/attachment` endpoint. This required additional testing and coordination because the third-party API documentation was limited.

## Technical implementation

- Zoho Deluge handles business rules and API calls
- n8n manages workflow automation and API requests
- Postman was used to test endpoints and validate payloads

## Result

Eligible orders now move from Zoho Inventory to the ERP with shipping details, production flags, add-ons, and invoice PDFs. Despatch-location rules prevent ineligible orders from entering the integration.

## Overview

This project focused on building a custom integration between Zoho Inventory and a third-party ERP system to automate order synchronization. The integration was designed to reduce manual handling, improve order accuracy, and ensure downstream systems receive complete and reliable order data.

The solution handles conditional order processing, detailed data syncing, and document attachment despite limited third-party API documentation.

## Objectives

- Automatically push orders from Zoho Inventory to a third-party ERP
- Filter incoming orders based on despatch location
- Ensure all relevant order, shipping, and production data is captured and synced
- Reduce manual packing and data entry processes
- Attach invoice documents to synced orders

## Key Features

### Order Filtering and Control

- Orders are filtered based on despatch location before syncing
- Only eligible orders are sent to the ERP, preventing incorrect routing

### Order Data Synchronization

The integration syncs the following order details:

- Order number and reference
- Order status and custom fields
- Order notes
- Expected despatch and shipment dates

### Automated Order Packing

- Order items are automatically packed during the sync process
- Ensures consistency between Zoho Inventory and the ERP system

### Shipping Information Sync

- Full shipping details are synchronized
- Includes recipient contact information such as phone numbers

### Order Item Add-ons

- Order item add-ons are displayed in the ERP order details
- Provides better visibility for production and fulfillment teams

### Production and Logistics Data Capture

The integration ensures critical operational data is captured and synced:

- Palletise Order flag
- Urgent Production indicator
- Invoice PDF availability

### Invoice PDF Attachment

- Invoice PDFs are automatically attached to synced orders
- Implemented using the available `/orders/attachment` endpoint
- Required additional coordination due to limited API documentation

## Technical Implementation

- Built using Zoho Deluge for business logic and orchestration
- n8n used for workflow automation and API handling
- Postman used for API testing and payload validation

## Outcome

The integration successfully automated order flow from Zoho Inventory to the ERP system, improved data accuracy, and reduced manual intervention across sales, fulfillment, and production workflows.

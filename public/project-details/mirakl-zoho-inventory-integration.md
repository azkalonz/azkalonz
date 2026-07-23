## Overview

This project involved building an automated integration between Mirakl and Zoho Inventory to streamline marketplace order processing. The goal was to ensure timely order ingestion, status synchronization, and centralized incident tracking while reducing manual intervention.

The integration was designed as a scheduled workflow to continuously sync data between systems and support end-to-end order lifecycle management.

## Objectives

- Automatically pull orders from Mirakl into Zoho Inventory
- Process and accept pending marketplace orders
- Sync shipment updates back to Mirakl
- Handle document processing for orders
- Track integration-related issues and exceptions in Zoho Desk

## Key Features

### Scheduled Order Sync

- Implemented scheduled jobs to fetch new orders from Mirakl
- Ensures near real-time synchronization without manual triggering
- Handles batching and avoids duplicate order creation

### Order Acceptance Automation

- Automatically processes and accepts pending orders
- Reduces manual workload and speeds up order fulfillment pipeline

### Shipment Status Updates

- Syncs shipment and fulfillment updates back to Mirakl
- Keeps marketplace order statuses aligned with Zoho Inventory

### Document Processing

- Handles order-related documents as part of the workflow
- Ensures required files are available across systems for operations

### Incident Tracking (Zoho Desk)

- Integrated with Zoho Desk for logging errors and exceptions
- Enables visibility and faster resolution of integration issues
- Supports structured tracking of failed syncs and edge cases

## Technical Implementation

- Automated workflows using scheduled triggers
- API-based integration between Mirakl and Zoho Inventory
- Error handling and logging routed through Zoho Desk
- Data validation to ensure consistency across systems

## Outcome

The integration established a reliable and automated pipeline between Mirakl and Zoho Inventory, significantly improving order processing efficiency, reducing manual intervention, and enhancing visibility into operational issues through centralized incident tracking.

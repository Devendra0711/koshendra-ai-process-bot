# Order Creation Flow - Functional Documentation

## Overview

This document explains the complete order creation flow in the Order Management (OM) system. It covers the journey of an order from user input in the frontend application to its final storage in databases and downstream systems like TPS/SOA and McLeod.

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Modules Involved](#modules-involved)
3. [Order Creation Entry Points](#order-creation-entry-points)
4. [Order Creation Flow - Step by Step](#order-creation-flow---step-by-step)
5. [Data Requirements](#data-requirements)
6. [Order Types](#order-types)
7. [Order Processing Pipeline](#order-processing-pipeline)
8. [Downstream Systems Integration](#downstream-systems-integration)
9. [Order Status Lifecycle](#order-status-lifecycle)
10. [Failure Handling & Retry Mechanism](#failure-handling--retry-mechanism)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE                                      │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────┐  │
│  │   om-app        │    │ om-order-entry- │    │  order-management-app       │  │
│  │ (Shell App)     │───▶│      app        │    │  (Legacy)                   │  │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                     order-management-api                                     ││
│  │         (Gateway API - Routes requests to appropriate services)              ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         ORDER PROCESSING LAYER                                   │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────┐  │
│  │ om-order-create │───▶│    om-order     │───▶│   om-order-processor        │  │
│  │ (Validation &   │    │ (Core Order     │    │   (Service Bus Publisher)   │  │
│  │  Formatting)    │    │  Processing)    │    │                             │  │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         DOWNSTREAM SYSTEMS                                       │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────┐  │
│  │   MongoDB       │    │   TPS/SOA       │    │      McLeod TMS             │  │
│  │  (Data Store)   │    │ (Legacy System) │    │  (Transportation Mgmt)      │  │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Modules Involved

### Frontend Applications

| Module | Purpose |
|--------|---------|
| **om-app** | Shell application that hosts micro-frontends using single-spa architecture |
| **om-order-entry-app** | Main UI for order creation (single & bulk orders) |
| **order-management-app** | Legacy order management interface |
| **om-order-details-app** | View and manage existing order details |

### Backend Microservices

| Module | Purpose |
|--------|---------|
| **order-management-api** | Gateway API that routes requests to internal services |
| **om-order-create** | Handles order creation events, validation, and formatting |
| **om-order** | Core order processing - writes to MongoDB, applies business rules |
| **om-order-processor** | Publishes order messages to Azure Service Bus |
| **mcleod-events-processor** | Handles order sync with McLeod TMS |
| **om-ltl-order** | Handles LTL (Less Than Truckload) specific order processing |

### Supporting Services

| Module | Purpose |
|--------|---------|
| **om-event** | Manages order events and event processing |
| **om-order-status** | Handles order status mappings between systems |
| **location-settings** | Manages location configurations |
| **customer** | Customer master data and configurations |

---

## Order Creation Entry Points

### 1. Manual Order Entry (UI)
- User fills out order form in `om-order-entry-app`
- Supports single order and bulk order creation
- Form includes customer, stops, dates, equipment, and other order details

### 2. EDI Orders (Electronic Data Interchange)
- Orders received electronically from customers via EDI 204 transactions
- Processed through EDI parsing and validation
- Requires EDI partner profile configuration

### 3. API Integration
- External systems can create orders via REST API calls
- Must include all required order fields and authentication

---

## Order Creation Flow - Step by Step

### Step 1: User Input (Frontend)
1. User opens order entry form in `om-order-entry-app`
2. Selects customer from customer master
3. Enters order details:
   - Transportation mode (TL/LTL/IML)
   - Sub-mode
   - Equipment type
   - Origin and destination stops
   - Pickup and delivery dates
   - Commodity information
   - References (PO#, BOL#, etc.)
   - Special instructions/remarks

### Step 2: Form Validation (Frontend)
1. Client-side validation checks:
   - Required fields populated
   - Date sequence validation (origin date before destination)
   - Customer-specific rules
   - Equipment type compatibility
   - Cross-border order checks (for international shipments)

### Step 3: Order Submission (Frontend → API)
1. Form data is formatted into standard order payload
2. Payload submitted to `om-order-create` service via API:
   - **Endpoint**: `/order-event`
   - **Event Type**: `ORDER_CREATE`
3. Service returns order ID confirmation

### Step 4: Order Event Processing (om-order-create)
The `om-order-create` service executes a pipeline of tasks:

| Task | Purpose |
|------|---------|
| `validateExcelFields` | Validates fields for bulk orders (Excel upload) |
| `validateRequiredFields` | Ensures all mandatory fields are present |
| `generateOrderId` | Creates unique OM Order ID |
| `mapOcOrderPayload` | Maps UI payload to internal order format |
| `mapStops` | Processes and validates stop information |
| `mapMcleodFields` | Maps fields for McLeod integration |
| `validateOrderSchema` | Validates against order schema |
| `sendToOmOrder` | Sends order to om-order service |
| `sendPricingToFinancials` | Sends pricing info to financial systems |
| `sendToSoa` | Publishes order to TPS/SOA via Service Bus |
| `pushToCustomsBroker` | Handles customs broker for international orders |
| `updateTemplateUsedData` | Updates template usage statistics |

### Step 5: Core Order Processing (om-order)
1. Receives order from `om-order-create`
2. Executes processor pipeline based on order type:
   - Sets old order reference (for updates)
   - Validates customer eligibility
   - Applies appointment rules
   - Sets order alerts and flags
   - Computes search fields for indexing
   - Writes order to MongoDB
   - Returns processed order with computed fields

### Step 6: Service Bus Publishing (om-order-processor)
1. Order published to Azure Service Bus topic
2. Downstream subscribers receive order message:
   - TPS/SOA for legacy system integration
   - McLeod for TMS integration (if applicable)

### Step 7: Downstream System Updates
- **TPS/SOA**: Traditional order management and dispatch
- **McLeod**: For customers using McLeod TMS
- **Financial Systems**: Pricing and billing information

---

## Data Requirements

### Mandatory Fields for Order Creation

| Field | Description |
|-------|-------------|
| **Customer** | Customer ID from customer master |
| **Transport Mode** | TL, LTL, or IML |
| **Origin Stop** | Pickup location with address details |
| **Destination Stop** | Delivery location with address details |
| **Pickup Date** | Requested pickup date/time window |
| **Delivery Date** | Requested delivery date/time window |
| **Equipment Type** | Trailer/container type required |

### Optional Fields

| Field | Description |
|-------|-------------|
| **References** | PO numbers, BOL numbers, etc. |
| **Commodity** | Description of goods being shipped |
| **Weight** | Total shipment weight |
| **Special Instructions** | Handling requirements, remarks |
| **Accessorials** | Additional services (liftgate, inside delivery, etc.) |
| **Hazmat Details** | Hazardous materials information |
| **Temperature Control** | For refrigerated shipments |
| **Customs Broker** | For cross-border shipments |

---

## Order Types

| Type | Description |
|------|-------------|
| **Manual** | Created through UI by account managers |
| **EDI** | Received electronically from customers |
| **Template** | Created from saved order templates |
| **Bulk** | Multiple orders created simultaneously |

---

## Order Processing Pipeline

### For New Orders (ORDER_CREATE)
```
validateExcelFields → validateRequiredFields → generateOrderId → mapOcOrderPayload 
    → mapStops → mapMcleodFields → validateOrderSchema → sendToOmOrder 
    → sendPricingToFinancials → sendToSoa → pushToCustomsBroker → updateTemplateUsedData
```

### For Order Updates (ORDER_UPDATE)
```
validateRequiredFields → mapOcOrderPayload → mapStops → mapMcleodFields 
    → validateOrderSchema → sendToOmOrder → sendPricingToFinancials 
    → sendToSoa → pushToCustomsBroker → updateFailureQueueStaleEvent
```

### For Order Cancellation (ORDER_CANCEL)
```
validateRequiredFields → getOrderFromMongo → mapOrderUpdates → setOmDateTime 
    → mapMcleodFields → validateOrderSchema → sendToOmOrder → sendToSoa 
    → updateFailureQueueStaleEvent
```

---

## Downstream Systems Integration

### TPS/SOA Integration
- Traditional Hub Group order management system
- Receives order via Azure Service Bus
- Handles dispatch, tracking, and legacy operations

### McLeod TMS Integration
- For customers configured with McLeod
- Order synced via `mcleod-events-processor`
- Supports order create, update, and status sync
- Reference numbers and remarks synchronized

### MongoDB (Data Store)
- Primary data store for OM orders
- Collection: `db$transaction.om_order_orders`
- Maintains order history and computed fields
- Supports complex queries via wildcard indexing

---

## Order Status Lifecycle

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   OPENED    │────▶│  ACCEPTED   │────▶│  IN_TRANSIT │────▶│  COMPLETED  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  CANCELLED  │     │    HOLD     │     │   REJECTED  │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Status Descriptions

| Status | Description |
|--------|-------------|
| **OPENED** | Order created, awaiting acceptance |
| **ACCEPTED** | Order accepted, ready for planning |
| **IN_TRANSIT** | Order is being transported |
| **COMPLETED** | Order delivered successfully |
| **CANCELLED** | Order cancelled by customer or system |
| **HOLD** | Order on hold (various reasons) |
| **REJECTED** | Order rejected during validation |

---

## Failure Handling & Retry Mechanism

### Failure Queue
- Failed orders stored in failure queue collection
- Contains error details and failed task sequence
- Supports automatic retry based on configuration

### Retry Logic
1. System identifies failed task in pipeline
2. Failed event stored with error sequence number
3. Retry attempts skip already executed tasks
4. Maximum retry attempts configured per error type

### Error Types
- **Validation Errors**: No retry, requires manual correction
- **System Errors**: Automatic retry with exponential backoff
- **Integration Errors**: Retry with notification to support team

---

## Key Considerations for Order Creation

1. **Customer Configuration**: Ensure customer exists in customer master with proper flags
2. **Location Setup**: Origin and destination locations should be in location master
3. **Equipment Availability**: Selected equipment type must be valid for customer/mode
4. **Date Validation**: Pickup date must be before delivery date
5. **Cross-Border Orders**: Require customs broker configuration
6. **Hazmat Orders**: Need proper hazmat codes and documentation
7. **Template Usage**: Leverage templates for frequently used order configurations

---

## Related Documentation

- [Order Management API Documentation](https://ordersdev.hubgroup.com/ordermanagementapi/api-docs/)
- [om-order Processor Overview](./om-order/README.md)
- [McLeod Integration Guide](./mcleod-events-processor/README.md)
- [Order Management Architecture Diagram](https://hubgroup.sharepoint.com/sites/ITHubConnectTeams/Shared%20Documents/Order%20Management/Architecture/)

---

*Last Updated: February 2026*

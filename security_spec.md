# Security Specifications & Rules Audit Payload TDD

This document details the security model of the Firestore database, defining invariants, security test payloads, and expectation assertions.

## 1. Data Invariants

- **User Profiles**:
  - Authenticated user's UID must match the document ID under `/users/{userId}`.
  - A user cannot modify their own `role` or `plan` to avoid self-privileged elevation.
  - All users must represent their real, verified emails.

- **Portfolios**:
  - Any creator can read/write their own portfolio under `/portfolios/{portfolioId}`.
  - Anonymous/Unauthenticated users can read a portfolio only if `isPublished` is true.
  - Creation requires `userId` of the portfolio to match the creator's UID.
  - Updation prevents changing `userId` to a target victim user.

## 2. The "Dirty Dozen" Attack Vectors

### Attack 01: Profile Elevation
- **Action**: Create/Update `/users/victim_id` setting `role` to `admin` or `plan` to `lifetime`.
- **Expected Result**: `PERMISSION_DENIED`

### Attack 02: Impersonate ID Spoofing
- **Action**: Write a portfolio with `userId` of a different user.
- **Expected Result**: `PERMISSION_DENIED`

### Attack 03: Hijack Slug
- **Action**: Modify a victim's portfolio slug or fields.
- **Expected Result**: `PERMISSION_DENIED`

### Attack 04: Rogue Resource Injection
- **Action**: Write junk, excessively long document ID strings to trigger Denial of Wallet resources indexing.
- **Expected Result**: `PERMISSION_DENIED` (Rejected by size/format limits)

### Attack 05: Bypass Verified Email mandate
- **Action**: Write records with `email_verified == false` on a sensitive standard endpoint.
- **Expected Result**: `PERMISSION_DENIED`

### Attack 06: Modify Read-Only Timestamps
- **Action**: Alter `createdAt` fields to arbitrary client dates.
- **Expected Result**: `PERMISSION_DENIED`

### Attack 07: Rogue Status Toggle Admin moderates
- **Action**: Modify `isPublished` to bypass admin block locks.
- **Expected Result**: `PERMISSION_DENIED`

### Attack 08: Blank Query Scraping
- **Action**: Request blanket read list of portfolios without where-filters.
- **Expected Result**: `PERMISSION_DENIED`

### Attack 09: Value Type Poisoning
- **Action**: Update `templateId` with a value type like integer or boolean instead of a matching template string.
- **Expected Result**: `PERMISSION_DENIED`

### Attack 10: Array size overflow attack
- **Action**: Uploading an array containing 10,000 skill keywords to crash parsing loops.
- **Expected Result**: `PERMISSION_DENIED`

### Attack 11: Orphaned Portfolio Creator write
- **Action**: Creating a portfolio referencing a non-existent parent user ID.
- **Expected Result**: `PERMISSION_DENIED`

### Attack 12: Private PII data leak read
- **Action**: Unauthenticated user tries to pull private email profile details directly via get.
- **Expected Result**: `PERMISSION_DENIED`

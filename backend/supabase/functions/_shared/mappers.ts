// deno-lint-ignore-file no-explicit-any

// ── Claim ──────────────────────────────────────────────────────────────────

export function toClaim(row: any): any {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    category: row.category,
    companyName: row.company_name,
    status: row.status,
    strength: row.strength,
    strengthLabel: row.strength_label,
    amountClaimed: Number(row.amount_claimed),
    amountRecovered: row.amount_recovered != null ? Number(row.amount_recovered) : null,
    resolutionProgress: Number(row.resolution_progress),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    resolvedAt: row.resolved_at ?? null,
    caseId: row.case_id,
    description: row.description,
    policyNumber: row.policy_number ?? null,
    serialNumber: row.serial_number ?? null,
  };
}

export function toClaimRow(data: any, userId: string): any {
  const row: any = { user_id: userId };
  if (data.title !== undefined) row.title = data.title;
  if (data.category !== undefined) row.category = data.category;
  if (data.companyName !== undefined) row.company_name = data.companyName;
  if (data.description !== undefined) row.description = data.description;
  if (data.amountClaimed !== undefined) row.amount_claimed = data.amountClaimed;
  if (data.policyNumber !== undefined) row.policy_number = data.policyNumber;
  if (data.serialNumber !== undefined) row.serial_number = data.serialNumber;
  if (data.status !== undefined) row.status = data.status;
  return row;
}

// ── Evidence ───────────────────────────────────────────────────────────────

export function toEvidence(
  row: any,
  signedUri?: string,
  signedThumbnail?: string,
): any {
  return {
    id: row.id,
    claimId: row.claim_id,
    type: row.type,
    title: row.title,
    fileName: row.file_name,
    uri: signedUri ?? row.storage_path,
    thumbnailUri: signedThumbnail ?? row.thumbnail_path ?? null,
    flags: row.flags ?? [],
    aiSummary: row.ai_summary ?? null,
    extractedData: row.extracted_data ?? null,
    uploadedAt: row.uploaded_at,
    fileSize: Number(row.file_size),
    mimeType: row.mime_type,
  };
}

// ── Strategy ───────────────────────────────────────────────────────────────

export function toStrategy(row: any): any {
  return {
    claimId: row.claim_id,
    recommendedAction: row.recommended_action,
    actionDescription: row.action_description,
    claimStrength: row.claim_strength,
    winProbability: Number(row.win_probability),
    attentionItems: row.attention_items ?? [],
    escalationLadder: row.escalation_ladder ?? [],
    daysLeftToAppeal: row.days_left_to_appeal ?? null,
    aiSummary: row.ai_summary,
    generatedAt: row.generated_at,
  };
}

// ── Draft ──────────────────────────────────────────────────────────────────

export function toDraft(row: any): any {
  return {
    id: row.id,
    claimId: row.claim_id,
    tone: row.tone,
    version: row.version,
    content: row.content,
    aiReasoning: row.ai_reasoning,
    recipientName: row.recipient_name,
    recipientTitle: row.recipient_title,
    subject: row.subject,
    generatedAt: row.generated_at,
  };
}

// ── Template ───────────────────────────────────────────────────────────────

export function toTemplate(row: any): any {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    tags: row.tags ?? [],
    content: row.content,
    usageCount: row.usage_count,
  };
}

// ── Timeline Event ─────────────────────────────────────────────────────────

export function toTimelineEvent(row: any): any {
  return {
    id: row.id,
    claimId: row.claim_id,
    type: row.type,
    title: row.title,
    date: row.date,
    description: row.description,
  };
}

// ── User / Profile ─────────────────────────────────────────────────────────

export function toUser(row: any): any {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatarUri: row.avatar_uri ?? null,
    subscriptionTier: row.subscription_tier,
    createdAt: row.created_at,
  };
}

// ── Settings ───────────────────────────────────────────────────────────────

export function toSettings(row: any): any {
  return {
    notifications: row.notifications,
    emailNotifications: row.email_notifications,
    biometricLock: row.biometric_lock,
    darkMode: row.dark_mode,
  };
}

export function toSettingsRow(data: any): any {
  const row: any = {};
  if (data.notifications !== undefined) row.notifications = data.notifications;
  if (data.emailNotifications !== undefined) row.email_notifications = data.emailNotifications;
  if (data.biometricLock !== undefined) row.biometric_lock = data.biometricLock;
  if (data.darkMode !== undefined) row.dark_mode = data.darkMode;
  return row;
}

// ── Notification ───────────────────────────────────────────────────────────

export function toNotification(row: any): any {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    read: row.read,
    createdAt: row.created_at,
    claimId: row.claim_id ?? null,
  };
}

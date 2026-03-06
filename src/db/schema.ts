import {
  pgTable,
  pgEnum,
  text,
  boolean,
  integer,
  real,
  date,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────

export const userStatusEnum = pgEnum("user_status", [
  "looking_for_room",      // Mode B — needs a room
  "looking_for_roommate",  // Mode A — has a room
]);

export const genderEnum = pgEnum("gender", [
  "male",
  "female",
  "other",
  "prefer_not_to_say",
]);

export const genderPreferenceEnum = pgEnum("gender_preference", [
  "male",
  "female",
  "any",
]);

export const leaseDurationEnum = pgEnum("lease_duration", [
  "3_months",
  "6_months",
  "1_year",
  "flexible",
]);

export const workScheduleEnum = pgEnum("work_schedule", [
  "day_shift",
  "night_shift",
  "work_from_home",
  "flexible",
]);

export const sleepScheduleEnum = pgEnum("sleep_schedule", [
  "early_bird",
  "night_owl",
  "flexible",
]);

export const cleanlinessEnum = pgEnum("cleanliness", [
  "very_clean",
  "moderate",
  "relaxed",
]);

export const guestPolicyEnum = pgEnum("guest_policy", [
  "rarely",
  "sometimes",
  "often",
]);

export const vegPreferenceEnum = pgEnum("veg_preference", [
  "veg",
  "non_veg",
  "both",
]);

export const roomTypeEnum = pgEnum("room_type", [
  "private_room",
  "shared_room",
  "entire_flat",
]);

export const furnishingEnum = pgEnum("furnishing", [
  "fully_furnished",
  "semi_furnished",
  "unfurnished",
]);

export const matchStatusEnum = pgEnum("match_status", [
  "pending",
  "matched",
  "rejected",
  "expired",
]);

export const kycStatusEnum = pgEnum("kyc_status", [
  "not_submitted",
  "pending",
  "approved",
  "rejected",
]);

export const kycDocTypeEnum = pgEnum("kyc_doc_type", [
  "aadhaar",
  "pan",
  "driving_license",
  "passport",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "pending",
  "under_review",
  "resolved",
  "dismissed",
]);

export const reportedPropertyEnum = pgEnum("reported_property", [
  "user_profile",
  "room_listing",
  "message",
]);

// ─────────────────────────────────────────
// USER  (Better Auth base + app fields merged)
// ─────────────────────────────────────────

export const user = pgTable("user", {
  // ── Better Auth required fields (do not rename) ──
  id:             text("id").primaryKey(),
  name:           text("name").notNull(),
  email:          text("email").notNull().unique(),
  emailVerified:  boolean("email_verified").notNull(),
  image:          text("image"),
  createdAt:      timestamp("created_at").notNull(),
  updatedAt:      timestamp("updated_at").notNull(),

  // ── App-specific fields ──
  phone:          text("phone").unique(),
  age:            integer("age"),
  gender:         genderEnum("gender"),
  bio:            text("bio"),
  occupation:     text("occupation"),
  status:         userStatusEnum("status").default("looking_for_room"),
  isVerified:     boolean("is_verified").notNull().default(false),   // KYC badge
  isActive:       boolean("is_active").notNull().default(true),
  lastSeen:       timestamp("last_seen").defaultNow(),
  onboardingDone: boolean("onboarding_done").notNull().default(false),
});

// ─────────────────────────────────────────
// BETTER AUTH TABLES (unchanged)
// ─────────────────────────────────────────

export const session = pgTable("session", {
  id:        text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token:     text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId:    text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id:                    text("id").primaryKey(),
  accountId:             text("account_id").notNull(),
  providerId:            text("provider_id").notNull(),
  userId:                text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken:           text("access_token"),
  refreshToken:          text("refresh_token"),
  idToken:               text("id_token"),
  accessTokenExpiresAt:  timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope:                 text("scope"),
  password:              text("password"),
  createdAt:             timestamp("created_at").notNull(),
  updatedAt:             timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id:         text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value:      text("value").notNull(),
  expiresAt:  timestamp("expires_at").notNull(),
  createdAt:  timestamp("created_at"),
  updatedAt:  timestamp("updated_at"),
});

// ─────────────────────────────────────────
// USER PREFERENCES
// ─────────────────────────────────────────

export const userPreferences = pgTable("user_preferences", {
  id:               text("id").primaryKey(),
  userId:           text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),

  // Location
  city:             text("city").notNull(),
  locality:         text("locality"),
  lat:              real("lat"),
  lng:              real("lng"),

  // Budget (in ₹)
  budgetMin:        integer("budget_min").notNull(),
  budgetMax:        integer("budget_max").notNull(),

  // Timing
  moveInDate:       date("move_in_date"),
  leaseDuration:    leaseDurationEnum("lease_duration").default("flexible"),

  // Lifestyle
  workSchedule:     workScheduleEnum("work_schedule").default("flexible"),
  sleepSchedule:    sleepScheduleEnum("sleep_schedule").default("flexible"),
  cleanliness:      cleanlinessEnum("cleanliness").default("moderate"),
  guestPolicy:      guestPolicyEnum("guest_policy").default("sometimes"),
  vegPreference:    vegPreferenceEnum("veg_preference").default("both"),

  // Habits
  smoking:          boolean("smoking").notNull().default(false),
  drinking:         boolean("drinking").notNull().default(false),
  petsAllowed:      boolean("pets_allowed").notNull().default(false),

  // Roommate preference
  genderPreference: genderPreferenceEnum("gender_preference").default("any"),
  ageMin:           integer("age_min").default(18),
  ageMax:           integer("age_max").default(40),

  updatedAt:        timestamp("updated_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────
// ROOM LISTINGS
// ─────────────────────────────────────────

export const roomListings = pgTable(
  "room_listings",
  {
    id:           text("id").primaryKey(),
    userId:       text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    title:        text("title").notNull(),
    description:  text("description"),

    // Location
    city:         text("city").notNull(),
    locality:     text("locality").notNull(),
    fullAddress:  text("full_address"),
    lat:          real("lat"),
    lng:          real("lng"),

    // Pricing (in ₹)
    rent:         integer("rent").notNull(),
    deposit:      integer("deposit"),

    // Room details
    roomType:     roomTypeEnum("room_type").notNull().default("private_room"),
    furnishing:   furnishingEnum("furnishing").default("semi_furnished"),
    totalRooms:   integer("total_rooms").default(1),
    bathrooms:    integer("bathrooms").default(1),

    // Media & extras
    photos:       jsonb("photos").$type<string[]>().default([]),
    amenities:    jsonb("amenities").$type<string[]>().default([]),

    availableFrom: date("available_from"),
    isActive:     boolean("is_active").notNull().default(true),
    createdAt:    timestamp("created_at").defaultNow().notNull(),
    updatedAt:    timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdx:   index("listings_user_idx").on(t.userId),
    cityIdx:   index("listings_city_idx").on(t.city),
    activeIdx: index("listings_active_idx").on(t.isActive),
  })
);

// ─────────────────────────────────────────
// COMPATIBILITY SCORES
// ─────────────────────────────────────────

export const compatibilityScores = pgTable(
  "compatibility_scores",
  {
    id:           text("id").primaryKey(),
    userAId:      text("user_a_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    userBId:      text("user_b_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    score:        real("score").notNull(), // 0–100
    breakdown:    jsonb("breakdown").$type<{
                    budget: number;
                    location: number;
                    cleanliness: number;
                    schedule: number;
                    lifestyle: number;
                    lease: number;
                    guests: number;
                  }>(),
    calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
  },
  (t) => ({
    uniquePair: uniqueIndex("scores_unique_pair_idx").on(t.userAId, t.userBId),
    userAIdx:   index("scores_user_a_idx").on(t.userAId),
    scoreIdx:   index("scores_score_idx").on(t.score),
  })
);

// ─────────────────────────────────────────
// MATCHES
// ─────────────────────────────────────────

export const matches = pgTable(
  "matches",
  {
    id:          text("id").primaryKey(),
    initiatorId: text("initiator_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    receiverId:  text("receiver_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status:      matchStatusEnum("status").notNull().default("pending"),
    createdAt:   timestamp("created_at").defaultNow().notNull(),
    updatedAt:   timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    uniqueMatch:  uniqueIndex("matches_unique_idx").on(t.initiatorId, t.receiverId),
    initiatorIdx: index("matches_initiator_idx").on(t.initiatorId),
    receiverIdx:  index("matches_receiver_idx").on(t.receiverId),
    statusIdx:    index("matches_status_idx").on(t.status),
  })
);

// ─────────────────────────────────────────
// CONVERSATIONS
// ─────────────────────────────────────────

export const conversations = pgTable("conversations", {
  id:        text("id").primaryKey(),
  matchId:   text("match_id")
    .notNull()
    .references(() => matches.id, { onDelete: "cascade" })
    .unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────

export const messages = pgTable(
  "messages",
  {
    id:             text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    senderId:       text("sender_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content:        text("content").notNull(),
    isRead:         boolean("is_read").notNull().default(false),
    sentAt:         timestamp("sent_at").defaultNow().notNull(),
  },
  (t) => ({
    convIdx:   index("messages_conv_idx").on(t.conversationId),
    senderIdx: index("messages_sender_idx").on(t.senderId),
    sentAtIdx: index("messages_sent_at_idx").on(t.sentAt),
  })
);

// ─────────────────────────────────────────
// SAVED PROFILES & LISTINGS
// ─────────────────────────────────────────

export const savedProfiles = pgTable(
  "saved_profiles",
  {
    id:          text("id").primaryKey(),
    userId:      text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    savedUserId: text("saved_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt:   timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    uniqueSave: uniqueIndex("saved_profiles_unique_idx").on(t.userId, t.savedUserId),
  })
);

export const savedListings = pgTable(
  "saved_listings",
  {
    id:        text("id").primaryKey(),
    userId:    text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    listingId: text("listing_id")
      .notNull()
      .references(() => roomListings.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    uniqueSave: uniqueIndex("saved_listings_unique_idx").on(t.userId, t.listingId),
  })
);

// ─────────────────────────────────────────
// KYC VERIFICATIONS
// ─────────────────────────────────────────

export const kycVerifications = pgTable("kyc_verifications", {
  id:            text("id").primaryKey(),
  userId:        text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  docType:       kycDocTypeEnum("doc_type").notNull(),
  aadhaarLast4:  text("aadhaar_last4"),  // store only last 4 digits, never full number
  docPhotoUrl:   text("doc_photo_url"),
  selfieUrl:     text("selfie_url"),
  status:        kycStatusEnum("status").notNull().default("not_submitted"),
  rejectionNote: text("rejection_note"),
  submittedAt:   timestamp("submitted_at"),
  reviewedAt:    timestamp("reviewed_at"),
});

// ─────────────────────────────────────────
// BLOCKED USERS
// ─────────────────────────────────────────

export const blockedUsers = pgTable(
  "blocked_users",
  {
    id:        text("id").primaryKey(),
    blockerId: text("blocker_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    blockedId: text("blocked_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    uniqueBlock: uniqueIndex("blocked_users_unique_idx").on(t.blockerId, t.blockedId),
    blockerIdx:  index("blocked_users_blocker_idx").on(t.blockerId),
    blockedIdx:  index("blocked_users_blocked_idx").on(t.blockedId),
  })
);

// ─────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────

export const reports = pgTable(
  "reports",
  {
    id:                 text("id").primaryKey(),
    reporterId:         text("reporter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // What is being reported (at least one must be set)
    reportedUserId:     text("reported_user_id")
      .references(() => user.id, { onDelete: "set null" }),
    reportedListingId:  text("reported_listing_id")
      .references(() => roomListings.id, { onDelete: "set null" }),
    reportedProperty:   reportedPropertyEnum("reported_property").notNull(),

    // Content
    reason:             text("reason").notNull(),   // e.g. "Fake profile", "Spam"
    description:        text("description"),        // optional extra detail by reporter

    // Admin review
    status:             reportStatusEnum("status").notNull().default("pending"),
    reviewedAt:         timestamp("reviewed_at"),
    reviewedBy:         text("reviewed_by")
      .references(() => user.id, { onDelete: "set null" }),

    createdAt:          timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    reporterIdx: index("reports_reporter_idx").on(t.reporterId),
    statusIdx:   index("reports_status_idx").on(t.status),
  })
);

// ─────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────

export const userRelations = relations(user, ({ one, many }) => ({
  preferences:     one(userPreferences, { fields: [user.id], references: [userPreferences.userId] }),
  kyc:             one(kycVerifications, { fields: [user.id], references: [kycVerifications.userId] }),
  listings:        many(roomListings),
  sentMatches:     many(matches, { relationName: "initiator" }),
  receivedMatches: many(matches, { relationName: "receiver" }),
  savedProfiles:   many(savedProfiles, { relationName: "saver" }),
  savedListings:   many(savedListings),
  sentMessages:    many(messages),
  blocking:        many(blockedUsers, { relationName: "blocker" }),
  blockedBy:       many(blockedUsers, { relationName: "blocked" }),
  reportsFiled:    many(reports, { relationName: "reporter" }),
  reportsReceived: many(reports, { relationName: "reportedUser" }),
}));

export const matchesRelations = relations(matches, ({ one }) => ({
  initiator:    one(user, { fields: [matches.initiatorId], references: [user.id], relationName: "initiator" }),
  receiver:     one(user, { fields: [matches.receiverId], references: [user.id], relationName: "receiver" }),
  conversation: one(conversations, { fields: [matches.id], references: [conversations.matchId] }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  match:    one(matches, { fields: [conversations.matchId], references: [matches.id] }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
  sender:       one(user, { fields: [messages.senderId], references: [user.id] }),
}));

export const roomListingsRelations = relations(roomListings, ({ one, many }) => ({
  user:        one(user, { fields: [roomListings.userId], references: [user.id] }),
  savedBy:     many(savedListings),
  reports:     many(reports),
}));

export const blockedUsersRelations = relations(blockedUsers, ({ one }) => ({
  blocker: one(user, { fields: [blockedUsers.blockerId], references: [user.id], relationName: "blocker" }),
  blocked: one(user, { fields: [blockedUsers.blockedId], references: [user.id], relationName: "blocked" }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter:        one(user, { fields: [reports.reporterId], references: [user.id], relationName: "reporter" }),
  reportedUser:    one(user, { fields: [reports.reportedUserId], references: [user.id], relationName: "reportedUser" }),
  reportedListing: one(roomListings, { fields: [reports.reportedListingId], references: [roomListings.id] }),
  reviewer:        one(user, { fields: [reports.reviewedBy], references: [user.id] }),
}));

// ─────────────────────────────────────────
// INFERRED TYPES
// ─────────────────────────────────────────

export type User               = typeof user.$inferSelect;
export type NewUser            = typeof user.$inferInsert;
export type UserPreferences    = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;
export type RoomListing        = typeof roomListings.$inferSelect;
export type NewRoomListing     = typeof roomListings.$inferInsert;
export type Match              = typeof matches.$inferSelect;
export type NewMatch           = typeof matches.$inferInsert;
export type Conversation       = typeof conversations.$inferSelect;
export type Message            = typeof messages.$inferSelect;
export type NewMessage         = typeof messages.$inferInsert;
export type KycVerification    = typeof kycVerifications.$inferSelect;
export type CompatibilityScore = typeof compatibilityScores.$inferSelect;
export type BlockedUser        = typeof blockedUsers.$inferSelect;
export type NewBlockedUser     = typeof blockedUsers.$inferInsert;
export type Report             = typeof reports.$inferSelect;
export type NewReport          = typeof reports.$inferInsert;
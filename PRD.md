# Product Requirements Document (PRD)

## Product Name

**GuideFinder**

## Purpose

GuideFinder helps users quickly find step-by-step instructions for software installation or service deployment. If a guide doesn’t exist, the app uses AI to generate, validate, and store new instructions.

---

## MVP Scope

### Core Features

1. **Search Functionality**

   - Users can search for guides by software/service name.
   - Uses Shadcn-ui SearchBar component.

2. **Guide Listing**

   - Display a list of matching guides with titles and short descriptions.
   - Uses Shadcn-ui List and Card components.

3. **Guide Details View**

   - Show step-by-step instructions for a selected guide.
   - Uses Shadcn-ui Accordion or Steps components.

4. **AI Guide Generation**

   - If no guide is found, trigger AI to generate instructions.
   - Validate and store the new guide in the database.
   - Notify the user when the guide is ready.

5. **Basic Admin Panel (optional for MVP)**
   - Simple interface to review/edit AI-generated guides.

---

## Out of Scope (for MVP)

- User authentication
- Advanced admin features (analytics, user management)
- Multi-language support

---

## User Stories

- **As a user**, I want to search for software/service guides so I can follow installation steps.
- **As a user**, I want to view detailed, step-by-step instructions.
- **As a user**, if a guide doesn’t exist, I want the app to generate one for me.
- **As an admin**, I want to review and edit AI-generated guides (optional for MVP).

---

## Technical Requirements

- **Frontend:** React + TypeScript, Shadcn-ui for all UI components.
- **Backend:** Node.js/Express or Next.js API routes.
- **Database:** PostgreSQL or MongoDB for storing guides.
- **AI Integration:** OpenAI API or similar for guide generation.
- **Validation:** Basic checks to ensure AI-generated guides are relevant and safe.

---

## Success Metrics

- Time to find or generate a guide.
- Number of guides in the database.
- User satisfaction (feedback form).

---

## Implementation Plan

1. **Set up project structure (frontend & backend)**
2. **Implement search and guide listing UI (Shadcn-ui)**
3. **Build guide details view**
4. **Integrate database for storing/retrieving guides**
5. **Connect AI API for guide generation**
6. **Basic validation and admin review (optional)**
7. **Testing and bug fixes**
8. **Deploy MVP**

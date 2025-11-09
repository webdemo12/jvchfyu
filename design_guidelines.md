# Design Guidelines: Tiger Super Satta Results Website

## Design Approach
**Reference-Based Approach**: Following the provided screenshot design with professional enhancements. The design draws from gaming/lottery platforms with strong visual branding and clear data presentation.

## Core Design Principles
1. **Trust & Legitimacy**: Professional appearance with clear branding to establish credibility
2. **Data Clarity**: Results must be instantly readable with clear typography and spacing
3. **Cultural Relevance**: Incorporate traditional elements (deity imagery, auspicious colors) while maintaining modern web standards
4. **Mobile-First**: Optimize for mobile users who are the primary audience

## Typography
- **Headings**: Inter or Poppins (Bold/SemiBold) for headers and titles
- **Body Text**: Inter (Regular) for general content
- **Results Numbers**: JetBrains Mono or Roboto Mono (Medium) for lottery numbers - monospace ensures alignment
- **Sizes**: 
  - Hero/Page titles: text-3xl to text-4xl
  - Section headers: text-xl to text-2xl
  - Body/Table content: text-base to text-lg
  - Small labels: text-sm

## Layout System
**Spacing Units**: Use Tailwind units of 3, 4, 6, 8, 12, 16 for consistent rhythm (p-4, m-6, gap-8, etc.)

### Page Layouts

**Home Page (Live Results)**
- Fixed header with logo, navigation, and live indicator badge
- Banner section with deity images (3-4 images in horizontal scroll/grid)
- Main results table: Full-width container (max-w-6xl) with today's date prominently displayed
- Table shows time slots in left column, results numbers in right column
- Footer with copyright and quick links

**Previous Results Page**
- Header identical to home page
- Search bar section: Date picker with search button, centered in max-w-2xl container
- Results display: Cards or table format grouped by date
- Pagination controls at bottom
- Each result card shows: Date, all time slots with results

**Contact Form Page**
- Header identical to home page
- Two-column layout (lg:grid-cols-2): Form on left, contact info/map placeholder on right
- Form fields: Name, Phone, Email, Message (textarea)
- Submit button with loading state
- Success/error message display area

**Admin Panel**
- Minimal login page: Centered card (max-w-md) with logo, username/password fields
- Dashboard: Sidebar navigation (Results Management, Settings, Logout)
- Add Results form: Date picker, time slot selector, result number input
- Results table with edit/delete actions
- Password change section in settings

## Component Library

### Header
- Logo on left (tiger branding with text)
- Navigation menu: Home | Previous Results | Contact | Admin (desktop horizontal, mobile hamburger)
- Live indicator: Pulsing red dot with "LIVE" text (animate-pulse)
- Sticky positioning on scroll

### Deity Banner
- Horizontal scrollable container on mobile (snap-scroll)
- Grid layout on desktop (grid-cols-4)
- Images with subtle border and shadow (border-2 shadow-lg)
- Equal height containers (aspect-square or aspect-[4/3])

### Results Table
- Full-width responsive table with alternating row backgrounds
- Left column: Time slots (e.g., "10:30 AM") with icon
- Right column: Result numbers in large monospace font
- Hover state on rows (subtle background change)
- Mobile: Stack time and result vertically in cards

### Form Components
- Input fields: Rounded corners (rounded-lg), clear labels above, border on focus
- Textarea: Minimum 4 rows for message field
- Submit button: Full-width on mobile, auto-width on desktop
- Error states: Red border with error message below field

### Admin Components
- Data table with sortable columns, search filter
- Action buttons: Edit (pencil icon), Delete (trash icon)
- Modal for confirmations and edits
- Success/error toast notifications (top-right corner)

### Cards
- Results cards: White background, rounded-lg, shadow-md
- Padding: p-6
- Border on hover: border-l-4 with accent color

## Images

### Header Logo
- Tiger mascot with "Super Satta" text
- Dimensions: 120px x 50px (desktop), 80px x 35px (mobile)
- Format: PNG with transparency

### Deity Banner (4 images)
- Traditional deity images commonly associated with luck/prosperity
- Dimensions: Square or 4:3 aspect ratio
- Each image: Ornate frame treatment with subtle glow effect
- Placement: Between header and results section

### Background Patterns (Optional)
- Subtle texture or gradient on page background
- Light pattern overlay (10-20% opacity) for depth

## Key Interactions

### Live Indicator
- Pulsing animation on "LIVE" badge
- Updates timestamp every minute showing "Last updated: XX minutes ago"

### Search Functionality
- Date range picker with calendar popup
- Auto-submit on date selection or manual search button
- Loading skeleton while fetching results

### Admin Actions
- Inline editing for results (click to edit)
- Confirmation modal before deletion
- Auto-save indicator for draft results

### Mobile Navigation
- Hamburger menu slides from right
- Overlay backdrop with blur effect
- Close on backdrop click or X button

## Accessibility
- Semantic HTML: `<table>` for results, `<nav>` for navigation
- ARIA labels on interactive elements
- Keyboard navigation for all actions
- Focus indicators on form inputs and buttons
- Contrast ratio minimum 4.5:1 for text

## Responsive Breakpoints
- Mobile: Base styles (320px+)
- Tablet: md: (768px+) - side-by-side layouts begin
- Desktop: lg: (1024px+) - full multi-column layouts
- Wide: xl: (1280px+) - max content width with centered alignment

## Professional Polish
- Consistent box shadows for depth (shadow-sm to shadow-lg)
- Smooth transitions on interactive elements (transition-all duration-200)
- Loading states for all async operations
- Empty states with helpful messages ("No results found for selected date")
- Success confirmations after form submissions
- Proper error handling with user-friendly messages
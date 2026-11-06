# Privacy-aware consent interface prototypes

## Contents
- `index.html` — two switchable consent interfaces and usability-study instruments.
- `styles.css` — responsive styles.
- `script.js` — interface switching, disclosure panels, local demo preference, decision timer, comprehension score, and ratings summary.

## Run
Open `index.html` in a current browser. No server or build step is required.

## What is held constant across prototypes
Both interfaces describe the same fictional data practices:
- Email is required for account sign-in and recovery.
- Basic feature-use events are optional analytics.
- Email is deleted within 30 days after account deletion.
- Optional analytics events are retained for up to 12 months.
- No external analytics provider receives events in this fictional demo.
- No advertising use or precise location collection for these purposes.
- Analytics may be changed or withdrawn in Settings → Privacy.
- Declining analytics does not block use of the planner.

The retention and recipient details are clearly labelled as assumptions for a fictional prototype. They must be verified and replaced with accurate service facts before production use.

## Privacy and research safeguards
- The prototype does not ask for an actual email address or submit data to a server.
- Only the demo preference is stored in the browser's `localStorage`.
- The consent checkbox for optional analytics is unchecked by default.
- Accepting and declining analytics are similarly visible.
- The timer and questionnaire run in the browser and do not transmit participant responses.
- For a study, obtain voluntary participant consent, allow participants to stop, counterbalance interface order, avoid collecting unnecessary identifiers, and report aggregate results.
- Do not claim either interface is better until user-testing data has been collected and analysed.

## Framework alignment
The prototype applies the design principles in the project proposal: purpose limitation, plain language, contextual timing, choice without pressure, data minimisation, transparency about sharing, and revocability/control. It is a research prototype, not legal advice or a certification of compliance.

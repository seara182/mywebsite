# Changelog

## v.2.0.0 The American Quartet
Coming in 2027

## v1.3.0: Sandlot to Sunday
Coming somewhat soon

## v1.2.0: Watercooler Conversations

### New
- Added the Watercooler, a panel with the talking points for your team's next game and last result
- Added the stakes of the next game to the Watercooler: elimination games, postseason games, division matchups and win or losing streaks of three games or more
- Added a stakes label to the next game card
- Added a plain-language playoff race summary to the Watercooler, based on ESPN's clinch and seeding data, with a short explanation
- Added ESPN's recap headline of the last game to the Watercooler
- Added the standout player of the last game to the Watercooler
- Added a bye week note for NFL teams to the Watercooler
- Added a highlight on the Watercooler icon when there is something new to talk about
- Added a welcome screen on first launch to pick your NFL and MLB team, in English or German
- Added a short tour that shows where to switch sports and change teams
- Added a None option for each sport, so you can follow only the NFL, only MLB or neither (albeit the last option doesn't make much sense, does it now?)
- Added empty screens with a Choose a team button when no team is selected
- Added city, state and founding year to every team in the team selector
- Added two-tone team color markers for opponents, standings, results and the team selector
- Found a way to show player photos: more than 1,200 players now have a freely licensed photo
- Added a badge with the jersey number in team colors for players without a photo
- Added License information to Settings, with a credit for every player photo
- Added a maximize button to the title bar
- Added a Search highlights on YouTube link when no clip has been found 6 hours after the game

### Improved
- Highlight clips are now found for longer, because the app checks the league's weekly NFL or seasonal MLB highlight playlist first
- The app now looks for a missing highlight clip again every 30 minutes while it is open
- The Watercooler and the Player Spotlight now keep talking about the last NFL game for up to 21 days, so a game from last week is still covered
- Game details are now only saved once a game is final, and a recap posted later is picked up automatically
- The default team setting and the tab switcher now show the name of the team you follow
- The Team colors sidebar background now falls back to Slate when no team is selected for that sport
- Teams in the team selector are now sorted by team name
- Demo Mode now shows the current win or losing streak
- New installs on a German system now start in German
- Existing users keep their teams and skip the welcome screen after updating
- Updated the list of services in the privacy statement

### Accessibility
- Screen readers now announce when the Watercooler has new talking points

### Fixed
- Fixed data of a previously selected team sometimes replacing the current team's data after a slow refresh
- Fixed data of a team you stopped following still showing from saved data

## v1.1.0: Yours, Live and in Color

### New
- Added live score tracking for your followed NFL and MLB teams
- Added MLB Stats API and TheScore as live score sources, with automatic fallback when a source is unavailable
- Added a live view to the hero card showing the current score, game phase and a live indicator
- Added a live score to the Next Game widget in the sidebar
- Added a game clock that keeps counting down between NFL score updates
- Added a live game panel with linescore, current situation, scoring plays, TV, radio and streaming listings, links and highlights
- Added Windows notifications for score changes and final scores
- Added a taskbar flash for score changes while CheapSeats is in the foreground
- Added kickoff and first pitch reminders that can be set for individual games
- Added a button to send a test notification
- Added a live game example for NFL and MLB to Demo Mode
- Added a high contrast mode
- Added six sidebar gradients: Gold, Sunrise, Peach, Aurora, Lime and Cotton Candy
- Added the privacy statement to the app, available in English and German
- Added an optional crash report that opens in your own email app and is only sent by you
- Added memory for window size and maximized state between launches
- Added a new app icon

### Improved
- The accent color now matches the selected sidebar background
- Accent colors now meet a contrast ratio of at least 4.5:1, and 7:1 in high contrast mode
- Detail panels now open out of the card you clicked and close back into it
- The highlight area now shows a placeholder until the clip is posted
- The upcoming game panel now switches to the live view when the game starts
- The Next Game widget in the sidebar now opens the game panel
- Cached game and player details older than 90 days are now removed automatically
- Updated the privacy statement to meet GDPR requirements
- Updated the about section in Settings

### Accessibility
- Keyboard focus now stays inside open dialogs and returns to where you were when they close
- Added a proper heading structure for screen readers
- Raised the contrast of secondary text to at least 4.5:1 in light and dark theme
- Added arrow key navigation to the NFL and MLB tab switcher
- Tooltips can now be closed with Escape
- Screen readers no longer announce tooltips as buttons on desktop
- Restored the visible focus outline on search fields
- Screen readers now announce data refresh status changes in the title bar

### Fixed
- Fixed a gradient sliver on the edge of the team colors swatch in Settings
- Fixed a game in progress sometimes being shown as the last completed game
- Fixed live scores appearing frozen between updates

## v1.0.0: First Kickoff

### New
- Released CheapSeats on the Microsoft Store
- Added tracking for one NFL team and one MLB team at a time
- Added team selection for all 32 NFL teams and all 30 MLB teams, with the San Francisco 49ers and Giants as defaults
- Added an NFL and MLB tab switcher
- Added a sidebar with section navigation and a countdown to the next game
- Added a hero card for the next game with opponent, home or away, date, time, venue, TV and week
- Added the latest result to the hero card when no game is scheduled, and an offseason state
- Added a last game card showing both teams in their official colors
- Added highlight clips for the last game from the official NFL and MLB YouTube channels
- Added a head-to-head overview with the last five meetings against the next opponent
- Added the all-time series record for the 49ers and Giants
- Added a Player Spotlight with season stats and an option to pin a player
- Added a formation diagram and stat leaders for NFL teams
- Added a lineup diagram and batting order for MLB teams
- Added recent results
- Added division standings
- Added a venue card with opening year, capacity, surface, location, dimensions and roof type
- Added rotating venue fun facts for the 49ers and Giants
- Added a history section for the 49ers and Giants covering 13 seasons, with win and loss trend, scoring trend, championship pennants, franchise records and a season breakdown
- Added a playoff bracket
- Added a roster grouped by unit, with filtering by name, position or number
- Added an upcoming game panel with game info, weather, countdown, season context, ESPN win probability and head-to-head
- Added a finished game panel with team stats, top performers, recap, linescore and pitching decisions
- Added a player panel with height and weight in imperial and metric, years in the league, injury status, position-specific stats, season versus career comparison and a career chart
- Added glossary tooltips with 133 explanations of sports terms
- Added a searchable Rule Book with How to Watch, NFL Basics and MLB Basics
- Added language support for English and German
- Added Demo Mode with offline datasets for the 2014 Giants and the 2023 49ers
- Added adjustable text size
- Added light, dark and system theme
- Added a choice of default team on launch
- Added sidebar backgrounds per sport: Team colors, Sunset, Ocean, Forest, Dusk, Slate, Ember, Rose, Midnight and Mint
- Added an optional sport icon over the sidebar background
- Added illustrated San Francisco sidebar scenes when both the 49ers and Giants are selected
- Added launch at startup
- Added team colors throughout the app, based on the selected team
- Added a layout that adapts to narrow windows
- Added saved data so the app opens instantly and works when offline
- Added automatic data refresh every 3 minutes
- Added a notice when data could not be refreshed
- Added a crash screen with a reload button
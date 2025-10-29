/**
 * FAQ data structure for TermStation
 * Each FAQ item includes:
 * - id: unique identifier (used for anchors)
 * - question: the question text
 * - answer: the answer text (can include HTML for formatting, links, etc.)
 */

window.TERMSTATION_FAQ = [
  {
    id: "what",
    question: "What is TermStation?",
    answer: "TermStation is a terminal session manager, currently under active development. It aims to bring organization to terminal sessions with tabs, session filters and search, along with command templates and a programmable web API to streamline workflows, all while keeping the user close to the metal with direct access to the shell.",
  },
  {
    id: "why",
    question: "Why was it developed?",
    answer: "First and foremost, the developer wanted a workspace that could be easily shared between devices and accessed from mobile. This is the reason for the GUI as opposed to using an existing solution like tmux. Second, as his parallel AI tool use increased, the need for better organization became apparent as tiled windows were not cutting it.",
  },
  {
    id: "who",
    question: "Who is it for?",
    answer: "It's not for everyone, and maybe only the developer 😀. TermStation sticks with a strict policy of only providing features that can be applied to any terminal session. This means no AI specific features, git worktree integrations, etc. in the GUI. However the generic features are quite flexible and can be used to build custom workflows with some effort. For example, the input API can be used to facilitate real-time agent-to-agent communication. Or the in-app browser tabs can be used to pull in additional GUI features that invoke the API. Those who don't mind tinkering with their shell or neovim configurations will find the approach familiar.",
  },
  {
    id: "how",
    question: "How does it work?",
    answer: "Terminal sessions are launched from the GUI or API and attached to a headless server component as PTYs. Clients connect to the server using HTTPS and WebSockets for session streaming. This model allows for sessions to run in the background with no client attached, similar to tmux."
  },
  {
    id: "platforms",
    question: "What platforms are supported?",
    answer: "Native Electron builds are available for the GUI on Windows, macOS and Linux. A native iOS build is planned, with web access supported now. The backend has been tested on Linux and macOS with plans to support Windows."
  },
  {
    id: "open-source",
    question: "Will it be open source?",
    answer: "This is the plan, but be warned! Another motivation for building the tool was to evaluate different AI coding techniques and programming languages. Both the frontend and backend are written 100% by AI agents (Claude and Codex) in vanilla JavaScript—which the developer doesn't know—as the agents seemed to be most effective with it. It is surprisingly snappy, with no optimizations having been applied yet.",
  },
  {
    id: "release-date",
    question: "When will it be released?",
    answer: "TermStation is expected to be released in Winter 2025/2026. To stay updated on TermStation development, follow the developer on X at <a href=\"https://x.com/kcosr\" target=\"_blank\" rel=\"noopener noreferrer\">@kcosr</a>. You can also check back here for the latest information about features and release status."
  }
];
